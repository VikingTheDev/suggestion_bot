import { join } from 'path';
import { Low, JSONFile} from 'lowdb';

type Data = {
    posts: string[];
}

// Use JSON file for storage
const file = join(__dirname, 'db.json');
const adapter = new JSONFile<Data>(file);
const db = new Low<Data>(adapter);

// Read data from JSON file, this will set db.data content
await db.read();

// If file.json doesn't exist, db.data will be null
// Set default data
db.data ||= { posts: [] };

// Create and query items using plain JS
db.data.posts.push('hello world');
db.data.posts[0];

// You can also use this syntax if you prefer
const { posts } = db.data;
posts.push('hello world');

// write db.data content to db.json
await db.write();

interface dbObj {
    id: string;

}

class dbObj {
    /**
    * @param guildId Identifier of the guild the suggestion 
    * @param
    * 
    * 
    */
    constructor (guildId: string, ) {
        this.id = this.generateId();

    }
    generateId (): string {
        
    }
}

export default dbObj;