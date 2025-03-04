
import { Partylist } from '@/models/partylist';
import { Senator } from '@/models/senator';
import Dexie, {Table} from 'dexie';

export interface SenatorLoc {
    id:string;
    ballot_number:number;
    name:string;
    ballot_name:string;
    sex:string;
    partylist:string;
};

export interface PartylistLoc {
    id:string;
    ballot_number:number;
    name:string;
    ballot_name:string;
};

export interface LocalCandidateLoc {
    id:string;
    ballot_number:number;
    name:string;
    ballot_name:string;
    sex:string;
    partylist:string;
    lgu?: string;
    province?: string;
    position?: string;
}

export class DB extends Dexie {
    senators!: Table<Senator>;
    partylists!: Table<Partylist>;

    constructor() {
        super('myDb');
        this.version(1).stores({
            senators: 'id, ballot_number, name, ballot_name, sex, partylist',
            partylists: 'id, ballot_number, name, ballot_name'
        })
    }
}

export const db = new DB();