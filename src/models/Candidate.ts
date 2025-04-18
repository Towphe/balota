export interface Candidate {
    candidate_id: string;
    lgu_id: string|null;
    province_id: string|null;
    ballot_number: number;
    ballot_name: string;
    position: string;
}