import * as jsonfile from "jsonfile";

const file = './db.json'

export interface dbObj {
    id: string;
    appId: string;
    token: string;
}

export class dbObj {
    /**
    * @param {String} application_id Application ID of the command used
    * @param {String} message_token 
    */
    constructor (application_id:string, message_token:string) {
        this.id = this.generateId();
        this.appId = application_id;
        this.token = message_token;
    }
    generateId (): string {
        return
    }
}