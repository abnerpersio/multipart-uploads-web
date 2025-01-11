import axios from 'axios';
import { sleep } from '../lib/sleep';

type UploadPartPayload = {
  blob: Blob;
  url: string;
  maxRetries?: number;
};

const RETRY_TIME_IN_SECONDS = 1_00;

export async function uploadFilePart(payload: UploadPartPayload, retryCount: number = 0) {
  const { url, blob, maxRetries = 3 } = payload;

  try {
    const result = await axios.put<null, { headers: { etag: string } }>(url, blob);
    const entityTag = (result.headers['etag'] ?? '').replace(/"/g, '');

    return { entityTag };
  } catch (error) {
    if (retryCount >= maxRetries) {
      throw error;
    }

    await sleep(RETRY_TIME_IN_SECONDS);

    const nextRetryCount = retryCount + 1;
    return uploadFilePart(payload, nextRetryCount);
  }
}

export async function uploadFile({ url, blob }: UploadPartPayload) {
  await axios.put<null>(url, blob);
}
