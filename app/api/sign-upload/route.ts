import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Category } from '@/types/wallpaper';

export const runtime = 'nodejs';

// Cloudinary eager transformations by category
const EAGER: Record<Category, string> = {
  desktop: 'c_fill,h_1080,w_1920,q_90,f_jpg',
  mobile: 'c_fill,h_1920,w_1080,q_90,f_jpg',
};

export async function POST(req: NextRequest) {
  try {
    const { category } = (await req.json()) as { category: Category };

    if (!category || !['desktop', 'mobile'].includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (!apiSecret || !apiKey || !cloudName) {
      return NextResponse.json({ error: 'Missing Cloudinary config' }, { status: 500 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `wallverse/${category}`;
    const eager = EAGER[category];

    // Build the exact param string that Cloudinary expects to sign
    // Keys must be alphabetical
    const paramsToSign = `eager=${eager}&folder=${folder}&timestamp=${timestamp}`;

    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + apiSecret)
      .digest('hex');

    return NextResponse.json({ signature, timestamp, apiKey, cloudName, eager, folder });
  } catch (err) {
    console.error('Sign upload error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
