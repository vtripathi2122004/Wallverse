import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Category } from '@/types/wallpaper';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, publicId, secureUrl } = body as {
      name: string | null;
      category: Category;
      publicId: string;
      secureUrl: string;
    };

    if (!publicId || !category || !['desktop', 'mobile'].includes(category)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Insert metadata into Supabase
    // r2_key column stores the Cloudinary public_id
    const { data, error } = await supabase
      .from('wallpapers')
      .insert({
        name: name?.trim() || null,
        category,
        r2_key: publicId,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true, wallpaper: { ...data, secureUrl } }, { status: 201 });
  } catch (err) {
    console.error('Save metadata error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
