api.net.onLoad(() => {
	const beforeUnload = () => {
		if (api.stores.session.gameSession.phase !== 'game') return;
		api.net.send('KICK_PLAYER', {
			characterId: api.stores.network.authId
		});
	};

	window.addEventListener('beforeunload', beforeUnload);

	api.onStop(() => {
		window.removeEventListener('beforeunload', beforeUnload);
	});
});
