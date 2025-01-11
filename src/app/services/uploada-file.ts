import axios from 'axios';

type UploadPayload = {
  blob: Blob;
  url: string;
};

export async function uploadFile({ url, blob }: UploadPayload) {
  const result = await axios.put<null, { headers: { etag: string } }>(url, blob);

  return { entityTag: result.headers['etag'] };
}
