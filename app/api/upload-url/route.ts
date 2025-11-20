import { NextResponse } from 'next/server';
import { bucket } from '@/lib/googleStorage';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const { filename, contentType, userId } = await request.json();

  // 🧹 Sanitize filename (remove unsafe chars & spaces)
  const safeName = filename
    .replace(/\s+/g, '_') // replace spaces with underscores
    .replace(/[^a-zA-Z0-9._-]/g, '') // remove weird characters
    .trim();

  // 🧱 Full path inside GCS bucket
  const filePath = `${userId}/resumes/${uuidv4()}-${safeName}`;
  const file = bucket.file(filePath);

  // ✍️ Generate signed upload URL
  const [uploadUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  });

  // 🌐 Public URL matches actual storage path
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

  // ✅ Use NextResponse.json()
  return NextResponse.json({ uploadUrl, publicUrl });
}
