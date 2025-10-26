import { bucket } from '@/lib/googleStorage';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const { filename, contentType } = await request.json();

  // 🧹 Sanitize filename (remove unsafe chars & spaces)
  const safeName = filename
    .replace(/\s+/g, '_') // replace spaces with underscores
    .replace(/[^a-zA-Z0-9._-]/g, '') // remove weird characters
    .trim();

  // 🗂️ Create a unique folder name
  const folder = uuidv4();

  // 🧱 Full path inside GCS bucket
  const filePath = `${folder}/uploads/${Date.now()}-${safeName}`;
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

  return Response.json({ uploadUrl, publicUrl });
}
