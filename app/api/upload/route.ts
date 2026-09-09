import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { supabase } from '@/lib/supabase';
import { Category } from '@/types/wallpaper';

export const runtime = 'nodejs';
export const maxDuration = 60;

const RESOLUTIONS: Record<Category, { width: number; height: number }> = {
  desktop: { width: 1920, height: 1080 },
  mobile: { width: 1080, height: 1920 },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as Category | null;
    const name = formData.get('name') as string | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!category || !['desktop', 'mobile'].includes(category))
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    if (!file.type.startsWith('image/'))
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    if (file.size > 15 * 1024 * 1024)
      return NextResponse.json({ error: 'File too large (max 15 MB)' }, { status: 400 });

    // Resize with sharp
    const { width, height } = RESOLUTIONS[category];
    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const resized = await sharp(inputBuffer)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 90, progressive: true })
      .toBuffer();

    // Upload to Cloudinary
    const publicId = uuidv4();
    const { publicId: cloudinaryKey, secureUrl } = await uploadToCloudinary(
      resized,
      publicId,
      category
    );

    // Insert metadata into Supabase
    // r2_key column now stores the Cloudinary public_id
    const { data, error } = await supabase
      .from('wallpapers')
      .insert({
        name: name?.trim() || null,
        category,
        r2_key: cloudinaryKey, // reusing column — stores Cloudinary public_id
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, wallpaper: { ...data, secureUrl } }, { status: 201 });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
