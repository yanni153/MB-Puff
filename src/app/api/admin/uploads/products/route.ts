import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
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

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    const extension = EXTENSIONS[file.type];
    if (!extension) {
      return Response.json({ error: 'Only JPG, PNG, WEBP, and GIF images are allowed' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: 'Each image must be 8MB or smaller' }, { status: 400 });
    }

    const filename = `${Date.now()}-${randomUUID()}.${extension}`;
    const destination = path.join(uploadDir, filename);
    const bytes = Buffer.from(await file.arrayBuffer());

    await writeFile(destination, bytes);
    urls.push(`/uploads/products/${filename}`);
  }

  return Response.json({ urls });
}
