import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent } from '../ui/tabs';
import { request } from '../../lib/api-client';
import TEXTS from '../../constants/texts';
import type { LogEntry } from '../../pages/index';

interface ApiTesterProps {
	onLog: (log: LogEntry) => void;
	onClearLogs?: () => void;
}

const {
    AUTH_TOKEN_LABEL,
    PET_NAME_LABEL,
    PLACEHOLDER_PET_NAME,
    ENDPOINT_URL_LABEL,
    PLACEHOLDER_ENDPOINT,
    BTN_GET,
    BTN_POST,
    BTN_RESET_USER
} = TEXTS

export function ApiTester({ onLog }: ApiTesterProps) {
	const [url, setUrl] = useState<string>('/pets');
	const [petName, setPetName] = useState<string>('Jerry');
	const [authToken, setAuthToken] = useState<string>('1');
	const [loading, setLoading] = useState<boolean>(false);

	const resetUser = async () => {
		setLoading(true);
		const reqId = `${Date.now()}-${Math.random()}`;
		const start = Date.now();
		try {
			onLog({ id: reqId, method: 'DELETE', url: '/api/pets', status: 'pending', auth: authToken });
			const client = request.auth(authToken);
			await client('/api/pets', { method: 'DELETE' });
			onLog({ id: reqId, method: 'DELETE', url: '/api/pets', status: 'success', auth: authToken, duration: Date.now() - start, data: null });
		} catch (e: any) {
			onLog({ id: reqId, method: 'DELETE', url: '/api/pets', status: 'error', auth: authToken, duration: Date.now() - start, error: e?.message });
		} finally {
			setLoading(false);
		}
	};

	const makeRequest = async (method: 'GET' | 'POST', endpoint: string, useAuth = false, body?: unknown) => {
		setLoading(true);
		const reqId = `${Date.now()}-${Math.random()}`;
		const start = Date.now();
		try {
			onLog({ id: reqId, method, url: endpoint, status: 'pending', auth: useAuth ? authToken : undefined });
			const client = useAuth && authToken ? request.auth(authToken) : request;
			let data: unknown;
			if (method === 'GET') {
				data = await client(endpoint);
			} else {
				data = await client(endpoint, { method: 'POST', body: JSON.stringify((body as any) || { name: petName }) });
			}
			onLog({ id: reqId, method, url: endpoint, status: 'success', auth: useAuth ? authToken : undefined, duration: Date.now() - start, data });
		} catch (e: any) {
			onLog({ id: reqId, method, url: endpoint, status: 'error', auth: useAuth ? authToken : undefined, duration: Date.now() - start, error: e?.message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Tabs defaultValue="auth" className="w-full">
			<TabsContent value="auth" className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="token">{AUTH_TOKEN_LABEL}</Label>
					<Input id="token" value={authToken} onChange={(e) => setAuthToken(e.target.value)} placeholder="user123" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="pet-name">{PET_NAME_LABEL}</Label>
					<Input id="pet-name" value={petName} onChange={(e) => setPetName(e.target.value)} placeholder={PLACEHOLDER_PET_NAME} />
				</div>
				<div className="space-y-2">
					<Label htmlFor="auth-url">{ENDPOINT_URL_LABEL}</Label>
					<Input id="auth-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={PLACEHOLDER_ENDPOINT} />
				</div>
				<div className="flex gap-2">
					<Button onClick={() => makeRequest('GET', url, true)} disabled={loading || !authToken}>
						{BTN_GET}
					</Button>
					<Button onClick={() => makeRequest('POST', url, true)} disabled={loading || !authToken} variant="secondary">
						{BTN_POST}
					</Button>
					<Button onClick={resetUser} disabled={loading || !authToken} variant="destructive">
						{BTN_RESET_USER}
					</Button>
				</div>
			</TabsContent>
		</Tabs>
	);
}
