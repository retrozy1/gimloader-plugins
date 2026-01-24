interface Item {
	id: string;
	seasonTicketRequired?: boolean;
}

api.net.onLoad(() => {
	function removeSeasonTicket(items: Item[], destination = items) {
		for (const item of items) {
			if (!item.seasonTicketRequired) continue;
			item.seasonTicketRequired = false;

			api.onStop(() => {
				const destinationItem = destination.find((p) => p.id === item.id);
				if (!destinationItem) return;
				destinationItem.seasonTicketRequired = true;
			});
		}
	}

	const { worldOptions } = api.stores;
	if (worldOptions.hasAllProps) {
		removeSeasonTicket(worldOptions.propsOptions);
	} else {
		api.net.on('ALL_PROPS', (props: Gimloader.Stores.PropOption[]) =>
			removeSeasonTicket(props, worldOptions.propsOptions)
		);
	}

	removeSeasonTicket(worldOptions.terrainOptions);
	removeSeasonTicket(worldOptions.deviceOptions);
});

api.net.modifyFetchResponse('/api/created-map/basics', (options) => {
	options.mapLimit = 25;
});
