import { list, get } from '@vercel/blob';
import { NextResponse } from 'next/server';

const SECRET_KEY = "restorembpuff2026";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log("⚡ Listing blobs...");
    const { blobs } = await list();
    
    const results = [];

    for (const blob of blobs) {
      try {
        console.log(`📥 Downloading ${blob.pathname}...`);
        const response = await get(blob.url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        
        results.push({
          pathname: blob.pathname,
          url: blob.url,
          base64: base64,
          mimeType: response.headers.get('content-type') || 'image/png'
        });
      } catch (err: any) {
        console.error(`❌ Failed to get blob ${blob.pathname}:`, err.message);
        results.push({
          pathname: blob.pathname,
          url: blob.url,
          error: err.message
        });
      }
    }

    return NextResponse.json({ blobs: results });
  } catch (error: any) {
    console.error("❌ Restore failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
