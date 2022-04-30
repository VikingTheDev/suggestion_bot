exports.run = async (client, interaction) => {
    await client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
              content: "Your application has been recieved and will be reviewed soon, please allow up to 48hrs before enquiring about the status of your application."
          }
        },
        auth: false,
    });
};