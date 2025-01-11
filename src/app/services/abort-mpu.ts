import { api } from '@/constants/api';
import axios from 'axios';

type AbortUploadPayload = {
  fileKey: string;
  uploadId: string;
};

export async function abortMPU({ fileKey, uploadId }: AbortUploadPayload) {
  const result = await axios.delete(`${api.baseUrl}/abort-mpu`, {
    data: {
      fileKey,
      uploadId,
    },
  });

  return result.data;
}
