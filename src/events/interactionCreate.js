module.exports = async (client, interaction) => {
    //console.log(interaction);

	if(interaction.customId === 'apply_dept') {
		if(interaction.user.dmChannel === null) await interaction.user.createDM();
		for(const value of interaction.values) {
			switch (true) {
				case value === 'fhp': 
					interaction.user.dmChannel.send({
						embeds: [
							{
								title: `Florida Highway Patrol`,
								description: 'FHP is a ... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a consequat nulla. Maecenas at feugiat turpis, vitae aliquam eros. Suspendisse potenti. Pellentesque maximus turpis vestibulum feugiat bibendum. Sed imperdiet porttitor est vel ultricies. Donec euismod posuere nunc, quis dapibus augue lacinia eu. Donec ut nisi lectus. Vestibulum egestas nulla vel magna congue, sed aliquet nisi auctor.',
								fields: [
									{
										name: "Requirements",
										value: "-Must be atleast 23.5 years old \n-Must be able to grow a mustache \n-Must be able to drive very fast and very recklessly in the name of justice"
									}, 
									{
										name: "Application",
										value: "https://docs.vikingthe.dev"
									},
									{
										name: "Other info",
										value: "*very interesting fact*"
									}
								],
								footer: {
									text: "2021 © VikingTheDev",
									iconURL: "https://cdn.discordapp.com/attachments/562656258415525898/930163909409771530/officialssrplogo.png"
								},
								timestamp: Date.now()
							}
						]
					})
					break;

				case value === 'tpd':

					break;

				case value === 'hcso':

					break;

				case value === 'hcfr':

					break;

				case value === 'civ':

					break;

				case value === 'dev':

					break;

				case value === 'staff':

					break;
			}
		};

		await interaction.update({content: "Check your DMs!", components: []});
	};
};