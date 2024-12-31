import os from 'os';

function getServerIP(): string {
	const networkInterfaces = os.networkInterfaces();
	for (const interfaceName in networkInterfaces) {
		const interfaces = networkInterfaces[interfaceName];
		if (interfaces) {
			for (const interface_ of interfaces) {
				if (interface_.family === 'IPv4' && !interface_.internal) {
					return interface_.address;
				}
			}
		}
	}
	return 'localhost';
}

export const HOST: string = getServerIP();