const { app } = require('../BE/server');

module.exports = (req, res) => {
	try {
		const originalUrl = req.url || req.path || '/';
		
		let expressPath = originalUrl;
		if (expressPath.startsWith('/api')) {
			expressPath = expressPath.replace(/^\/api/, '') || '/';
		}
		
		req.url = expressPath;
		req.path = expressPath;
		req.originalUrl = expressPath;
		
		return app(req, res);
	} catch (error) {
		console.error('Serverless function error:', error);
		if (!res.headersSent) {
			res.status(500).json({ error: 'Internal server error', message: error.message });
		}
	}
};
