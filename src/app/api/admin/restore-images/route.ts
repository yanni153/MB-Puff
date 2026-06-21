import { list, get } from '@vercel/blob';
import { NextResponse } from 'next/server';

const SECRET_KEY = "restorembpuff2026";

async function streamToBuffer(stream: ReadableStream<any>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

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
        const response = await get(blob.url, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN
        });
        
        if (!response || !response.stream) {
          throw new Error('Response stream is empty or null');
        }

        const buffer = await streamToBuffer(response.stream);
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
