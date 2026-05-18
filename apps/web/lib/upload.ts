import { apiFetch } from './api-client';
import type { ApiResult } from '@chohee/shared';

interface PresignResponse {
  key: string;
  url: string;
  method: 'PUT';
  headers: Record<string, string>;
  expiresAt: string;
  maxBytes: number;
}

interface PresignArgs {
  kind: 'audio' | 'image';
  contentType: string;
  contentLength: number;
  scope: 'track' | 'cover' | 'waveform' | 'lyrics-attachment';
  resourceId?: string;
  filenameHint?: string;
}

export async function requestPresignedUrl(args: PresignArgs): Promise<ApiResult<PresignResponse>> {
  return apiFetch<PresignResponse>('/uploads/sign', {
    method: 'POST',
    body: args,
  });
}

export async function uploadBlobToPresignedUrl(
  presign: PresignResponse,
  blob: Blob,
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(presign.method, presign.url);
    for (const [k, v] of Object.entries(presign.headers)) {
      xhr.setRequestHeader(k, v);
    }
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded, e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`업로드 실패: ${xhr.status} ${xhr.responseText}`));
    };
    xhr.onerror = () => reject(new Error('네트워크 오류'));
    xhr.send(blob);
  });
}
