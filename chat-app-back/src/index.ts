import express from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import path from 'path';

import { EnvironmentConfig } from '@/class/EnviromentConfig';
import { CRUD_ICONS, log } from '@/utils/logs';
import routes from '@/routes/index.routes';
import { HOST } from '@/utils/serverIP';
import { connectDB } from './lib/db';
import { app, server } from './lib/socket';
import { seedDatabase } from './seeds/user.seed';

const config = new EnvironmentConfig();

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(cors({
	origin: true,
	credentials: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../chat-app-front/dist')));

app.use((req, _res, next) => {
	log(`${CRUD_ICONS[req.method as keyof typeof CRUD_ICONS]} ${req.method} ${req.path}`, 'info', __filename);
	next();
});

const isPortAvailable = async (port: number): Promise<boolean> => {
	return await new Promise((resolve) => {
		const testServer = http.createServer();

		testServer.once('error', (err) => {
			if ((err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
				resolve(false);
			}
		});

		testServer.once('listening', () => {
			testServer.close();
			resolve(true);
		});

		testServer.listen(port);
	});
};

const getAvailablePort = async (startPort: number): Promise<number> => {
	let port = startPort;
	while (!(await isPortAvailable(port))) {
		log(`Port ${port} is in use, trying ${port + 1}`, 'warning', __filename);
		port++;
	}
	return port;
};

app.get('/', (_req, res) => {
	seedDatabase();
	log('Database seeded successfully', 'info', __filename);
	res.send('Server connected');
});

app.use('/api/', routes);
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../chat-app-front/dist/index.html'));
});

const startServer = async (): Promise<void> => {
	try {
		const availablePort = await getAvailablePort(parseInt(config.serverPort));

		server
			.listen(availablePort, () => {
				log(`📡 Server running at http://${HOST}:${availablePort}/`, 'success', __filename);
				connectDB();
			})
			.on('error', (err) => {
				const errorMessage = err instanceof Error ? err.message : 'Unknown error';
				log(`Error al iniciar el servidor: ${errorMessage}`, 'error', 'server');
				process.exit(1);
			});

	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Unknown error';
		log(`Failed to initialize services: ${errorMessage}`, 'error', 'server');
		process.exit(1);
	}
};

void startServer();