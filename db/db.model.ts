
import Dexie, {Table} from 'dexie';

export interface Candidate {
    candidate_id: string;
    lgu_id: string;
    province_id: string|undefined;
    ballot_number: number;
    ballot_name: string;
    position: string;
}

export class DB extends Dexie {
    candidates!: Table<Candidate>;

    constructor() {
        super('myDb');
        this.version(1).stores({
            candidates: 'candidate_id, lgu_id, province_id, ballot_number, ballot_name, position'
        })
    }
}

export const db = new DB();