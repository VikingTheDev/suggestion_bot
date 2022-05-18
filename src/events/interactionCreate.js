module.exports = async (client, data) => {
	const interactionHandler = client.container.interactions.get(data.customId);

	if(!interactionHandler) return; 

	interactionHandler.run(client, data);
};