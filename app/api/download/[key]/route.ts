import { NextRequest, NextResponse } from 'next/server';
import { downloadFromCloudinary } from '@/lib/cloudinary';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    // Decode the base64url-encoded Cloudinary public_id
    const publicId = Buffer.from(params.key, 'base64url').toString('utf8');

    // Verify the asset exists in our DB (security gate)
    const { data, error } = await supabase
      .from('wallpapers')
      .select('r2_key, name, category')
      .eq('r2_key', publicId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Fetch from Cloudinary and stream back as download
    const buffer = await downloadFromCloudinary(publicId);
    const filename = `${data.name || data.category}-wallpaper.jpg`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (err) {
    console.error('Download error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
