const jsonfile = require("jsonfile");

// Super simple local database solution
class DB {
    constructor(filename) {
        this.file = __dirname.replace("modules", `data/${filename}`);
    };

    async write(obj) {
        jsonfile.writeFile(this.file, obj, { spaces: 1 }, (err) => {
            if (err) console.log(err);
        });
    };

    async set(arg1, arg2, arg3) {
        if(arg1 && arg2) {
            this.data.set(arg1, { channelId: arg2, messageId: arg3});
            const obj = Object.fromEntries(this.data);
            await this.write(obj);
        } else {
            const obj = Object.fromEntries(this.data);
            await this.write(obj);
        };
    };

    async read() {
        jsonfile.readFile(this.file, (err, obj) => {
            if (err) console.log(err);
            let map;
            if (obj) {
                map = new Map(Object.entries(obj)) 
                this.data = map;
            } else {
                map = new Map();
                this.data = map
                this.set();
            }
        });
    };
};

module.exports = DB;