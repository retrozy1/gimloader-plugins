api.net.onLoad(() => {
	if (!api.net.isHost) return;

	const beforeUnload = () => {
		api.net.colyseus.send('KICK_PLAYER', {
			characterId: api.stores.network.authId
		});
	};

	window.addEventListener('beforeunload', beforeUnload);

	api.onStop(() => {
		window.removeEventListener('beforeunload', beforeUnload);
	});
});
