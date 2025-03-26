
export interface Partylist {
  id:string;
  ballot_number:number;
  name:string;
  ballot_name:string;
};

export interface PartylistsPayload {
  partylists: Partylist[];
  total: number;
}