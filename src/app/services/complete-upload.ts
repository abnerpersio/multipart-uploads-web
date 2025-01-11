import { api } from '@/constants/api';
import axios from 'axios';

type CompleteUploadPayload = {
  fileKey: string;
  uploadId: string;
  parts: {
    partNumber: number;
    entityTag: string;
  }[];
};

export async function completeUpload({ fileKey, parts, uploadId }: CompleteUploadPayload) {
  const result = await axios.post(`${api.baseUrl}/complete-upload`, {
    fileKey,
    parts,
    uploadId,
  });

  return result.data;
}
