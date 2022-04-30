module.exports = async (client, data) => {
	const interaction = client.container.interactions.get(data.customId);

	if(!interaction) return; 

	interaction.run(client, data);
};