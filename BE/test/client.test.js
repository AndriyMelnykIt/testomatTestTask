const { start, stop } = require('../server');

describe('Client library', () => {
	let client;
	let baseUrl;

	beforeAll(async () => {
		process.env.NO_RANDOM = '1';
		const srv = await start(0);
		const address = srv.address();
		baseUrl = `http://127.0.0.1:${address.port}`;
		process.env.API_BASE_URL = baseUrl;
		client = require('../client/index.js');
	}, 20000);

	afterAll(async () => {
		await stop();
	});

	test('sync-like chaining without await between calls', async () => {
		const { request } = client;
		request.auth = 101;

		const init = await request('GET', '/pets');
		expect(Array.isArray(init)).toBe(true);
		expect(init.length).toBe(0);

		request('POST', '/pets', { name: 'cat' });
		request('POST', '/pets', { name: 'dog' });

		const list = await request('GET', '/pets');
		const names = list.map(p => p.name).sort();
		expect(names).toEqual(['cat', 'dog']);
	}, 10000);

	test('GET pet by id after creation', async () => {
		const { request } = client;
		request.auth = 102;

		const pet = await request('POST', '/pets', { name: 'bird' });
		expect(pet && pet.id).toBeGreaterThan(0);
		const fetched = await request('GET', `/pets/${pet.id}`);
		expect(fetched.name).toBe('bird');
	}, 10000);

	test('requestSession isolates auth and returns values', async () => {
		const { request, requestSession } = client;
		request.auth = 201;

		request('POST', '/pets', { name: 'cat' });
		request('POST', '/pets', { name: 'dog' });

		const otherPet = await requestSession(() => {
			request.auth = 202;
			return request('POST', '/pets', { name: 'jaguar' });
		});

		const myPets = await request('GET', '/pets');
		const myNames = myPets.map(p => p.name);
		expect(myNames).toEqual(expect.arrayContaining(['cat', 'dog']));
		expect(myNames).not.toContain(otherPet.name);
		expect(otherPet.name).toBe('jaguar');
	}, 10000);

	test('retry on single 500 works', async () => {
		const { request } = client;
		request.auth = 301;
		const data = await request('GET', '/pets?simulate=500_once:case500');
		expect(Array.isArray(data)).toBe(true);
	}, 10000);

	test('retry on single 401 works', async () => {
		const { request } = client;
		request.auth = 302;
		const data = await request('GET', '/pets?simulate=401_once:case401');
		expect(Array.isArray(data)).toBe(true);
	}, 10000);

	test('timeout after ~1s on hanging requests', async () => {
		const { request } = client;
		request.auth = 303;
		const startAt = Date.now();
		let timedOut = false;
		try {
			await request('GET', '/pets?simulate=timeout');
		} catch (e) {
			timedOut = e && (e.code === 'ECONNABORTED' || /timeout/i.test(e.message));
		}
		const elapsed = Date.now() - startAt;
		expect(timedOut).toBe(true);
		expect(elapsed).toBeLessThan(1600);
	}, 10000);
});
