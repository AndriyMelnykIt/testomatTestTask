import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ApiTester } from '../components/widgets/ApiTester';
import { RequestLog } from '../components/widgets/RequestLog';
import TEXTS from '../constants/texts';

export interface LogEntry {
	id?: string;
	method: string;
	url: string;
	status: 'pending' | 'success' | 'error';
	auth?: string;
	duration?: number;
	error?: string;
	data?: unknown;
	timestamp?: Date | string;
}

const {API_TESTER_TITLE, REQUEST_LOG_TITLE, CLEAR} = TEXTS;

export default function Home() {
	const [logs, setLogs] = useState<LogEntry[]>([]);
	const addLog = (log: LogEntry) =>
		setLogs((prev) => {
			if (log.id) {
				const idx = prev.findIndex((l) => l.id === log.id);
				if (idx !== -1) {
					const copy = [...prev];
					copy[idx] = { ...copy[idx], ...log };
					return copy;
				}
			}
			return [{ ...log, timestamp: new Date() }, ...prev].slice(0, 50);
		});

	return (
		<div className="min-h-screen bg-background">
			<main className="container mx-auto px-6 py-8">
				<div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>{API_TESTER_TITLE}</CardTitle>
							</CardHeader>
							<CardContent>
								<ApiTester onLog={addLog} onClearLogs={() => setLogs([])} />
							</CardContent>
						</Card>
					</div>
					<div className="space-y-6">
						<Card className="lg:sticky lg:top-6">
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle>{REQUEST_LOG_TITLE}</CardTitle>
									<Button
										variant="outline"
										className="px-2 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
										onClick={() => setLogs([])}
									>
										{CLEAR}
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<RequestLog logs={logs} />
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	);
}
