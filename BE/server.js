const express = require('express');
const debug = require('debug')('server');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const users = new Map();

function getUserFromAuthHeader(req) {
	const auth = req.headers['authorization'] || '';
	const match = auth.match(/^Bearer\s+(.+)$/i);
	if (!match) return null;
	return String(match[1]).trim();
}

function getOrCreateUser(userId) {
	if (!users.has(userId)) {
		users.set(userId, { nextId: 1, pets: [] });
	}

	return users.get(userId);
}

const flakyOnceCounters = {
	'500': new Map(),
	'401': new Map()
};

function maybeSimulate(req, res, next) {
	const q = req.query || {};

	if (q.simulate === 'timeout') {
		debug('Simulating timeout (hang) for %s %s', req.method, req.path);
		return;
	}

	if (typeof q.simulate === 'string' && (q.simulate.startsWith('500_once:') || q.simulate.startsWith('401_once:'))) {
		const [code, key] = q.simulate.split(':');
		const map = flakyOnceCounters[code];
		const count = (map.get(key) || 0) + 1;
		map.set(key, count);
		if (count === 1) {
			const status = parseInt(code, 10);
			debug('Simulating single %d for key=%s', status, key);
			return res.status(status).json({ error: `Simulated ${status} once` });
		}
	}

	if (process.env.NO_RANDOM === '1') {
		return next();
	}

	const r = Math.random();

	if (r < 0.05) {
		debug('Randomly returning 401');
		return res.status(401).json({ error: 'Random unauthorized' });
	}

	if (r < 0.10) {
		debug('Randomly returning 500');
		return res.status(500).json({ error: 'Random server error' });
	}

	if (r < 0.15) {
		debug('Randomly hanging request');
		return;
	}
	next();
}

app.use((req, res, next) => {
	const userId = getUserFromAuthHeader(req);
	if (!userId) {
		return res.status(401).json({ error: 'Missing or invalid Authorization header' });
	}
	req.userId = userId;
	next();
});

app.use(maybeSimulate);

app.get('/pets', (req, res) => {
	const store = getOrCreateUser(req.userId);
	// Return shallow copy
	res.json(store.pets.map(p => ({ id: p.id, name: p.name })));
});

app.get('/pets/:id', (req, res) => {
	const store = getOrCreateUser(req.userId);
	const id = parseInt(req.params.id, 10);
	const pet = store.pets.find(p => p.id === id);
	if (!pet) return res.status(404).json({ error: 'Not found' });
	res.json({ id: pet.id, name: pet.name });
});

function createPetHandler(req, res) {
	const store = getOrCreateUser(req.userId);
	const name = req.body && req.body.name;
	if (!name) return res.status(400).json({ error: 'name is required' });
	const pet = { id: store.nextId++, name };
	store.pets.push(pet);
	res.status(201).json(pet);
}

app.post('/pets', createPetHandler);
app.post('/pet', createPetHandler);

app.delete('/pets', (req, res) => {
	const store = getOrCreateUser(req.userId);
	store.pets = [];
	store.nextId = 1;
	return res.status(204).end();
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
let server = null;

function start(port = PORT) {
	return new Promise(resolve => {
		server = app.listen(port, () => {
			debug('Server listening on http://localhost:%d', port);
			resolve(server);
		});
	});
}

function stop() {
	return new Promise(resolve => {
		if (!server) return resolve();
		server.close(() => resolve());
	});
}

if (require.main === module) {
	start();
}

module.exports = { app, start, stop };
