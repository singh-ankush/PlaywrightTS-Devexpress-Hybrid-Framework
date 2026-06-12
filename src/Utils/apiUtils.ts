import { APIRequestContext, APIResponse } from '@playwright/test';

type ReqOptions = {
    headers?: Record<string, string>;
    params?: Record<string, string | number>;
    body?: any;
    retry?: number;
    timeoutMs?: number;
};

export function createApiClient(
    request: APIRequestContext,
    opts?: { baseURL?: string; headers?: Record<string, string>; timeoutMs?: number; retry?: number }
) {
    const baseURL = opts?.baseURL ?? '';
    const defaultHeaders = opts?.headers ?? {};
    const defaultRetry = opts?.retry ?? 0;
    const defaultTimeout = opts?.timeoutMs ?? 30_000;

    const buildUrl = (path: string) =>
        path.startsWith('http') ? path : `${baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

    async function fetchWithRetry(method: string, path: string, options?: ReqOptions): Promise<APIResponse> {
        const url = buildUrl(path);
        const headers = { ...defaultHeaders, ...(options?.headers ?? {}) };
        const maxRetries = options?.retry ?? defaultRetry;
        let attempt = 0;

        while (true) {
            attempt++;
            const res = await request.fetch(url, {
                method,
                headers,
                params: options?.params,
                data: options?.body,
                timeout: options?.timeoutMs ?? defaultTimeout,
            });

            if (res.ok() || attempt > maxRetries) return res;

            const backoffMs = 100 * attempt;
            await new Promise((r) => setTimeout(r, backoffMs));
        }
    }

    async function parseJsonSafe(res: APIResponse) {
        const text = await res.text();
        if (!text) return null;
        try {
            return JSON.parse(text);
        } catch (e: any) {
            throw new Error(`Invalid JSON response: ${e?.message}\nBody: ${text}`);
        }
    }

    return {
        get: (path: string, options?: ReqOptions) => fetchWithRetry('GET', path, options),
        post: (path: string, options?: ReqOptions) => fetchWithRetry('POST', path, options),
        put: (path: string, options?: ReqOptions) => fetchWithRetry('PUT', path, options),
        patch: (path: string, options?: ReqOptions) => fetchWithRetry('PATCH', path, options),
        del: (path: string, options?: ReqOptions) => fetchWithRetry('DELETE', path, options),
        json: parseJsonSafe,
        expectStatus: (res: APIResponse, expected: number) => {
            if (res.status() !== expected) {
                throw new Error(`Expected status ${expected} but got ${res.status()}`);
            }
        },
    };
}