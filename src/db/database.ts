import * as jsonfile from "jsonfile";
import * as neededforbuiling from "./db.json";
import * as neededforbuiling2 from "./channels.json";
import { interactionObj } from "../helpers/api";

const file = __dirname + '/db.json';
const channelFile = __dirname + '/channels.json';

interface dbObj {
        id: number;
        data: interactionObj;
        embed: object;
}

interface findCb {
    (callback: dbObj): void
}

interface readCb {
    (callback: { messages: Array<dbObj> }): void
}

// TODO: Consider changing dbRead() to return a promise instead of using callbacks,
// TODO  and rewrite .add(), .delete() and .findById() in accordance to this.

// ! Weird bug: Calling .delete() and .findById() at the same time for 
// ! the same ID will wipe the .json file if the entry does not exist.


/**
 * Contains methods for interacting with the local JSON database
 */

export const jsonDB = {


    /**
     * Method for adding an entry to the database
     * @param {dbObj} obj Object containing data to be added. Has to be a {@link dbObj} object.
     * @example jsonDB.add(dbObj);
     */

    add: (obj: dbObj) => {
        dbRead(data => {
            let array = data.messages, exists = false;
            array.map(entry => {
                if (entry.id === obj.id) {
                    exists = true;
                }
            })
            if (exists) {
                throw new Error(`Entry with id "${obj.id}" already exists!`)
            } else {
                array.push(obj);
            }

            jsonfile.writeFile(file, { messages: array }, { spaces: 1 }, (err) => {
                if (err) console.error(err);
            })
        })
    },


    /**
     * Method for deleting a method from the database.
     * @param {Number} id The id of the entry you want to delete.
     * @example jsonDB.delete(id);
     */

    delete: (id: number) => {
        dbRead(data => {
            let array = data.messages;
            array = array.filter(entry => entry.id != id);
            if (array === data.messages) {
                throw new Error(`Could not find entry with id "${id}"!`)
            } else {
                jsonfile.writeFile(file, { messages: array }, { spaces: 1 }, (err) => {
                    if (err) console.error(err);
                })
            }
        })
    },

    update: (obj: dbObj) => {
        dbRead(data => {
            let array = data.messages;
            for (let x in array) {
                if (obj.id === array[x].id) {
                    array[x] = obj;
                }
            }
            jsonfile.writeFile(file, { messages: array }, { spaces: 1 }, (err) => {
                if (err) console.error(err);
            });
        })
    },
 
    /**
     * Method for finding an entry using it's id.
     * @param {number} id The id of the entry you want to find.
     * @param cb Callback parameter containing the entry.
     * @example jsonDB.findById(id, obj => {
     *      console.dir(obj)
     * })
     */

    findById: (id: Number, cb: findCb) => {
        dbRead(data => {
            let array = data.messages, exists = false;
            array.map(entry => {
                if (entry.id === id) {
                    exists = true;
                    cb(entry);
                }
            })
            if (!exists) {
                throw new Error(`Could not find entry with id "${id}"!`);
            }
        })
    },


    /**
     * Method for finding the "length" or amount of entries in the database.
     * @returns {Number} A promise containing the length of the database (as a Number)
     * @example let length = await jsonDB.length();
     * console.log(length);
     */

    length: async () => {
        let res: number;
        await jsonfile.readFile(file)
            .then(obj => {res = obj.messages.length})
            .catch(error => console.error(error))
        return res;
    },

    /**
     * Method for updating the channelId for a interaction (Used for responses)
     * @param {('approve' | 'delete' | 'deny' | 'implemented' | 'inprogress')} interactionType Type of interaction to change channelId for.
     * @param {string} channelId The channelId you want to change to.
     * @example jsonDB.updateChannel('approve', channelId);
     */

    updateChannel: async (interactionType: string, channelId: string) => {
        let data;
        await jsonfile.readFile(channelFile)
            .then(obj => { data = obj })
            .catch(error => console.error(error));
        // @ts-expect-error
        data[interactionType] = channelId;
        jsonfile.writeFile(channelFile, data, { spaces: 1 }, (err) => {
            if (err) console.error(err);
        })
    },

    /**
     * 
     * @param {('approve' | 'delete' | 'deny' | 'implemented' | 'inprogress')} interactionType Type of interaction you want to get the channelId for
     * @returns a channelId
     */

    getChannel: async (interactionType: string) => {
        let data;
        await jsonfile.readFile(channelFile)
            .then(obj => { data = obj })
            .catch(error => console.error(error));
        // @ts-expect-error
        return data[interactionType];
    }
}




/**
 * Method for getting the contents of the database.
 * @param cb Callback object containing the contents of the database.
 * @example 
 *  dbRead(obj => {
 *      console.log(obj)
 *  })
 */

const dbRead = (cb: readCb) => {
    jsonfile.readFile(file, (err, obj) => {
        if (err) console.error(err);
        cb(obj);
    })
}