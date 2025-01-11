import { api } from '@/constants/api';
import axios from 'axios';

type PrepareUploadPayload = {
  fileName: string;
  totalChunks: number;
};

type PrepareUploadResult = {
  data: {
    key: string;
    uploadId: string;
    parts: {
      url: string;
      partNumber: number;
    }[];
  };
};

export async function prepareUpload({ fileName, totalChunks }: PrepareUploadPayload) {
  const result = await axios.post<PrepareUploadResult>(`${api.baseUrl}/prepare-upload`, {
    fileName,
    totalChunks,
  });

  return result.data?.data;
}
