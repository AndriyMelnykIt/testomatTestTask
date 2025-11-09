import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent } from '../ui/tabs';
import { request } from '../../lib/api-client';
import type { LogEntry } from '../../pages/index';

interface ApiTesterProps {
	onLog: (log: LogEntry) => void;
	onClearLogs?: () => void;
}

export function ApiTester({ onLog, onClearLogs }: ApiTesterProps) {
	const [url, setUrl] = useState('/api/pets');
	const [petName, setPetName] = useState('Fluffy');
	const [authToken, setAuthToken] = useState('1');
	const [loading, setLoading] = useState(false);

	const resetUser = async () => {
		setLoading(true);
		const start = Date.now();
		try {
			onLog({ method: 'DELETE', url: '/api/pets', status: 'pending', auth: authToken });
			const client = request.auth(authToken);
			await client('/api/pets', { method: 'DELETE' });
			onLog({ method: 'DELETE', url: '/api/pets', status: 'success', auth: authToken, duration: Date.now() - start, data: null });
		} catch (e: any) {
			onLog({ method: 'DELETE', url: '/api/pets', status: 'error', auth: authToken, duration: Date.now() - start, error: e?.message });
		} finally {
			setLoading(false);
		}
	};

	const makeRequest = async (method: 'GET' | 'POST', endpoint: string, useAuth = false, body?: unknown) => {
		setLoading(true);
		const start = Date.now();
		try {
			onLog({ method, url: endpoint, status: 'pending', auth: useAuth ? authToken : undefined });
			const client = useAuth && authToken ? request.auth(authToken) : request;
			let data: unknown;
			if (method === 'GET') {
				data = await client(endpoint);
			} else {
				data = await client(endpoint, { method: 'POST', body: JSON.stringify((body as any) || { name: petName }) });
			}
			onLog({ method, url: endpoint, status: 'success', auth: useAuth ? authToken : undefined, duration: Date.now() - start, data });
		} catch (e: any) {
			onLog({ method, url: endpoint, status: 'error', auth: useAuth ? authToken : undefined, duration: Date.now() - start, error: e?.message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Tabs defaultValue="auth" className="w-full">
			<TabsContent value="auth" className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="token">Auth Token (User ID)</Label>
					<Input id="token" value={authToken} onChange={(e) => setAuthToken(e.target.value)} placeholder="user123" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="pet-name">Pet Name</Label>
					<Input id="pet-name" value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="Fluffy" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="auth-url">Endpoint URL</Label>
					<Input id="auth-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/api/pets" />
				</div>
				<div className="flex gap-2">
					<Button onClick={() => makeRequest('GET', url, true)} disabled={loading || !authToken}>
						GET
					</Button>
					<Button onClick={() => makeRequest('POST', url, true)} disabled={loading || !authToken} variant="secondary">
						POST
					</Button>
					<Button onClick={resetUser} disabled={loading || !authToken} variant="destructive">
						Reset user data
					</Button>
				</div>
			</TabsContent>
		</Tabs>
	);
}
