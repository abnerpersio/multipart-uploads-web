import { api } from '@/constants/api';
import { HttpResult } from '@/types/http';
import axios from 'axios';

type PrepareMPUUploadPayload = {
  fileName: string;
  totalChunks: number;
};

type PrepareMPUUploadResult = HttpResult<{
  isMultipart: true;
  key: string;
  uploadId: string;
  parts: {
    url: string;
    partNumber: number;
  }[];
}>;

type PrepareSingleUploadPayload = {
  fileName: string;
};

type PrepareSingleUploadResult = HttpResult<{
  key: string;
  uploadId: string;
  url: string;
}>;

export async function prepareMPUUpload({ fileName, totalChunks }: PrepareMPUUploadPayload) {
  const result = await axios.post<PrepareMPUUploadResult>(`${api.baseUrl}/prepare-upload`, {
    fileName,
    totalChunks,
  });

  return result.data?.data;
}

export async function prepareSingleUpload({ fileName }: PrepareSingleUploadPayload) {
  const result = await axios.post<PrepareSingleUploadResult>(`${api.baseUrl}/prepare-upload`, {
    fileName,
  });

  return result.data?.data;
}
