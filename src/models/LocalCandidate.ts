
export interface LocalCandidate {
    id: string;
    ballot_number: number
    name: string;
    ballot_name: string;
    sex: string|undefined;
    position: string;
    partylist: string;
    lgu: string | undefined;
    district: string | undefined;
    province: string | undefined;
}