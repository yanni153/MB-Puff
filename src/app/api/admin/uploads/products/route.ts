import { put } from '@vercel/blob';
import { auth } from '@/lib/auth';

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function POST(request: Request) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== 'ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll('files').filter((item): item is File => item instanceof File);

  if (!files.length) {
    return Response.json({ error: 'No files uploaded' }, { status: 400 });
  }

  const urls: string[] = [];

  for (const file of files) {
    const extension = EXTENSIONS[file.type];
    if (!extension) {
      return Response.json({ error: 'Only JPG, PNG, WEBP, and GIF images are allowed' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: 'Each image must be 8MB or smaller' }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    
    // Upload to Vercel Blob
    const blob = await put(`products/${filename}`, file, {
      access: 'public',
    });

    urls.push(blob.url);
  }

  return Response.json({ urls });
}
