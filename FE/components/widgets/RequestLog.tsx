import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';
import TEXTS from '../../constants/texts';
import type { LogEntry } from '../../pages/index';

interface RequestLogProps {
	logs: LogEntry[];
}

const {
    NO_REQUESTS,
    LOADING,
    SUCCESS,
    ERROR,
    AUTH_BADGE,
    VIEW_RESPONSE
} = TEXTS;

export function RequestLog({ logs }: RequestLogProps) {
	if (!logs || logs.length === 0) {
		return (
			<div className="flex items-center justify-center h-[400px] text-sm text-muted-foreground">
				{NO_REQUESTS}
			</div>
		);
	}

	return (
		<ScrollArea className="h-[600px] pr-2">
			<div className="space-y-3">
				{logs.map((log, idx) => (
					<div
						key={idx}
						className={cn(
							'p-3 rounded-lg border text-xs space-y-2',
							log.status === 'pending' && 'border-chart-3 bg-chart-3/5',
							log.status === 'success' && 'border-chart-2 bg-chart-2/5',
							log.status === 'error' && 'border-destructive bg-destructive/5'
						)}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Badge className="font-mono">{log.method}</Badge>
								{log.status === 'pending' && <Badge className="animate-pulse" variant="outline">{LOADING}</Badge>}
								{log.status === 'success' && <Badge className="bg-chart-2 text-white border-chart-2" variant="outline">{SUCCESS}</Badge>}
								{log.status === 'error' && <Badge variant="destructive">{ERROR}</Badge>}
							</div>
							{log.duration ? <span className="text-muted-foreground">{log.duration}ms</span> : null}
						</div>
						<div className="font-mono text-muted-foreground break-all">{log.url}</div>
						{log.auth ? (
							<div className="flex items-center gap-2">
								<Badge variant="secondary" className="text-[10px]">🔐 {AUTH_BADGE}</Badge>
								<span className="font-mono text-muted-foreground truncate">{String(log.auth).slice(0, 20)}...</span>
							</div>
						) : null}
					{log.error ? <div className="text-destructive font-mono">Error: {log.error}</div> : null}
					{'data' in log && log.data ? (
						<details className="cursor-pointer" open>
							<summary className="text-muted-foreground hover:text-foreground">{VIEW_RESPONSE}</summary>
							<pre className="mt-2 p-2 bg-muted rounded text-[10px] overflow-x-auto">
								{JSON.stringify(log.data, null, 2)}
							</pre>
						</details>
					) : null}
						{log.timestamp ? (
							<div className="text-muted-foreground text-[10px]">
								{new Date(log.timestamp).toLocaleTimeString()}
							</div>
						) : null}
					</div>
				))}
			</div>
		</ScrollArea>
	);
}
