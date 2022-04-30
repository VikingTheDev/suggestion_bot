exports.run = async (client, interaction) => {
    let modal = {
        "data": {
            "type": 9,
            "data": {
              "title": "Application Form",
              "custom_id": "fhp_form",
              "components": [{
                "type": 1,
                "components": [{
                  "type": 4,
                  "custom_id": "name",
                  "label": "Name",
                  "style": 1,
                  "min_length": 1,
                  "max_length": 4000,
                  "placeholder": "John",
                  "required": true
                }]
              }]
            }
          }
        };

    client.api.interactions(interaction.id, interaction.token).callback.post(modal);
};