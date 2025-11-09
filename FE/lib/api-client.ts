const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const TIMEOUT_MS = 1000;

type Call = (path: string, init?: RequestInit) => Promise<any>;
type Client = Call & { auth: (token: string) => Client };

function make(headers: Record<string, string> = {}): Client {
	const call: any = async (path: string, init: RequestInit = {}) => {
		const urlPath = path.startsWith('/api/') ? path.slice(4) : path;
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
		try {
			const res = await fetch(`${BASE}${urlPath}`, {
				...init,
				signal: controller.signal,
				headers: {
					'Content-Type': 'application/json',
					...headers,
					...(init.headers || {})
				}
			});
			if (!res.ok) {
				const text = await res.text();
				throw new Error(`HTTP ${res.status}: ${text}`);
			}
			if (res.status === 204 || res.status === 205) return null;
			const contentType = res.headers.get('content-type') || '';
			if (contentType.includes('application/json')) return await res.json();
			const text = await res.text();
			return text ? text : null;
		} catch (e: any) {
			if (e.name === 'AbortError') throw new Error(`Timeout after ${TIMEOUT_MS}ms`);
			throw e;
		} finally {
			clearTimeout(timeoutId);
		}
	};
	call.auth = (token: string) => make({ ...headers, Authorization: `Bearer ${token}` });
	return call as Client;
}

export const request: Client = make();
