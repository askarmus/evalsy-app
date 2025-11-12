// config/googleStorage.ts
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64!, 'base64').toString()),
});

export const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);
