const axios = require('axios');
const createDebug = require('debug');

const debug = createDebug('client:request');

const DEFAULT_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const DEFAULT_TIMEOUT_MS = 1000;
const MAX_RETRIES = 2;

const sessionStack = [
	{ last: Promise.resolve() }
];

function makeHttpExecutor() {
	const instance = axios.create({
		baseURL: DEFAULT_BASE_URL,
		validateStatus: () => true
	});

	return async function httpCall(method, path, body, headers) {
		let attempt = 0;
		let lastError = null;
		while (attempt <= MAX_RETRIES) {
			attempt += 1;
			try {
				debug('HTTP %s %s attempt=%d auth=%s', method, path, attempt, request.auth);
				const response = await instance.request({
					method,
					url: path,
					data: body,
					headers: {
						'Authorization': `Bearer ${request.auth}`,
						'Content-Type': 'application/json',
						...(headers || {})
					},
					timeout: DEFAULT_TIMEOUT_MS
				});
				debug('Response %s %s -> %d', method, path, response.status);
				if (response.status >= 200 && response.status < 300) {
					return response.data;
				}
				if (response.status === 401 || response.status === 500) {
					if (attempt <= MAX_RETRIES) {
						const backoff = Math.min(100 * attempt, 300);
						debug('Retrying due to %d after %dms', response.status, backoff);
						await new Promise(r => setTimeout(r, backoff));
						continue;
					}
				}
				const err = new Error(`HTTP ${response.status}: ${JSON.stringify(response.data)}`);
				err.status = response.status;
				throw err;
			} catch (err) {
				if (err.code === 'ECONNABORTED') {
					debug('Timeout after %dms for %s %s', DEFAULT_TIMEOUT_MS, method, path);
					throw err;
				}
				lastError = err;
				if (attempt > MAX_RETRIES) {
					break;
				}
				const backoff = Math.min(100 * attempt, 300);
				debug('Network error, retrying after %dms: %s', backoff, err.message);
				await new Promise(r => setTimeout(r, backoff));
			}
		}
		throw lastError || new Error('Request failed');
	};
}

const httpExecute = makeHttpExecutor();

function request(method, path, body, headers) {
	const ctx = sessionStack[sessionStack.length - 1];
	let resultPromise;
	ctx.last = ctx.last.then(async () => {
		resultPromise = httpExecute(method, path, body, headers);
		await resultPromise;
	}).catch(err => {
		debug('Queue step error (ignored for queue continuity): %s', err && err.message);
	});
	return new Promise((resolve, reject) => {
		Promise.resolve()
			.then(() => resultPromise)
			.then(resolve, reject);
	});
}

request.auth = 1;

async function requestSession(fn) {
	sessionStack.push({ last: Promise.resolve() });
	try {
		const ret = fn();
		return await ret;
	} finally {
		sessionStack.pop();
	}
}

module.exports = { request, requestSession };
