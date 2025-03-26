
export interface Senator {
  id:string;
  ballot_number:number;
  name:string;
  ballot_name:string;
  sex:string;
  partylist:string;
};

export interface SenatorsPayload {
  senators: Senator[];
  total: number;
}