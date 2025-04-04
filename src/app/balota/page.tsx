"use client"

import { Partylist } from "@/models/partylist";
import {useState, useEffect} from "react";
import { db } from "../../../db/db.model";
import { Senator } from "@/models/senator";
import { LocalCandidate } from "@/models/LocalCandidate";
import { Separator } from "@/components/ui/separator";

interface CandidateRowProps {
    name: string;
    ballot_number: number;
    removeCandidate: () => void;
    isEditToggled: boolean;
}

function CandidateRow(props: CandidateRowProps) {
    const {name, ballot_number, removeCandidate, isEditToggled} = props;
    
    return ( 
        <div className="flex text-lg justify-between items-center">
            <p>{name}</p>
                <div className="flex items-center justify-center gap-2">
                    <span className="font-bold">{ballot_number}</span>
                        <button type="button" onClick={() => removeCandidate()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-5 opacity-60 ${isEditToggled ? "block" : "hidden"}`}>
                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                            </svg>
                        </button>
                </div>
        </div>
    )
}

interface LocationInfo {
    region: string|undefined;
    province: string|undefined;
    lgu: string|undefined;
    provincialDistrict: string|undefined;
    legislativeDistrict: string|undefined;
    councilorDistrict: string|undefined;
}

export default function Page() {
    const [partylist, setPartylist] = useState<Partylist|null>(null);
    const [senators, setSenators] = useState<Senator[]>([]);
    const [localCandidates, setLocalCandidates] = useState<LocalCandidate[]>([]);
    const [isEditToggled, setIsEditToggled] = useState<boolean>(false);
    const [location, setLocation] = useState<LocationInfo|undefined>();
    const [governor, setGovernor] = useState<LocalCandidate|undefined>(undefined);
    const [viceGovernor, setViceGovernor] = useState<LocalCandidate|undefined>(undefined);
    const [provincialBoardMembers, setProvincialBoardMembers] = useState<LocalCandidate[]>([]);
    const [mayor, setMayor] = useState<LocalCandidate|undefined>(undefined);
    const [viceMayor, setViceMayor] = useState<LocalCandidate|undefined>(undefined);
    const [councilors, setCouncilors] = useState<LocalCandidate[]>([]);
    const [representative, setRepresentative] = useState<LocalCandidate|undefined>(undefined);

    function removePartylist(){
        db.partylists.clear();
        setPartylist(null);
    }

    const removeSenator = async (senator:Senator) => {
        // check number of senators
        const count = await db.senators.count();
          
        if (count === 0) {
          // no senators in list
          // render notification that says you've already reached max partylist
          // or just show modal showing your current choice, and option to remove any
          return;
        }
      
        setSenators(senators.filter((sn) => sn.id !== senator.id));
        db.senators.delete(senator.id);
    }

    const retrieveLocation = () => {
        const l: LocationInfo = {
            region: localStorage.getItem("region") ?? "",
            province: localStorage.getItem("province") ?? undefined,
            lgu: localStorage.getItem("lgu") ?? "",
            provincialDistrict: localStorage.getItem("provincialDistrict") ?? undefined,
            legislativeDistrict: localStorage.getItem("legislativeDistrict") ?? "",
            councilorDistrict: localStorage.getItem("councilorDistrict") ?? "",
        };

        setLocation(l);
    }
    
    const removeLocalCandidate = async (id:string) => {
        const candidates = localCandidates.filter(lc => lc.id === id);

        // check if candidate is empty
        if (candidates.length === 0) {
            return;
        }

        // get first
        const candidate = candidates[0];
        console.log(candidate)

        switch (candidate.position) {
            case "GOVERNOR":
                setGovernor(undefined);
                break;
            case "VICE-GOVERNOR":
                setViceGovernor(undefined);
                break;
            case "PROVINCIAL BOARD MEMBER":
                setProvincialBoardMembers(provincialBoardMembers.filter(lc => lc.id !== id));
                break;
            case "MAYOR":
                setMayor(undefined);
                break;
            case "VICE-MAYOR":
                setViceMayor(undefined);
                break;
            case "COUNCILOR":
                setCouncilors(councilors.filter(lc => lc.id !== id));
                break;
            case "REPRESENTATIVE":
                setRepresentative(undefined);
                break;
        }

        setLocalCandidates(localCandidates.filter(lc => lc.id !== id));
        await db.localCandidates.delete(id);
    }


    useEffect(() => {
        const getPartylist = async () => {
            const pl = await db.partylists.limit(1).first();
            setPartylist(pl ?? null);
        };

        const getSenators = async () => {
            const sns = await db.senators.limit(12).toArray();
            setSenators(sns ?? []);
        }

        const getLocalCandidates = async () => {
            const lc = await db.localCandidates.toArray();
            setLocalCandidates(lc ?? []);
            setGovernor(lc.find(lc => lc.position === "GOVERNOR"));
            setViceGovernor(lc.find(lc => lc.position === "VICE-GOVERNOR"));
            setProvincialBoardMembers(lc.filter(lc => lc.position === "PROVINCIAL BOARD MEMBER" || lc.position === "PROVINCIAL_COUNCIL"));
            setMayor(lc.find(lc => lc.position === "MAYOR"));
            setViceMayor(lc.find(lc => lc.position === "VICE-MAYOR"));
            setCouncilors(lc.filter(lc => lc.position === "COUNCILOR"));
            setRepresentative(lc.find(lc => lc.position === "REPRESENTATIVE" || lc.position === "DISTRICT_REPRESENTATIVE"));
        }

        getPartylist();
        getSenators();
        retrieveLocation();
        getLocalCandidates();
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-start py-12">
            <div className="w-5/6 md:w-3/5 lg:w-1/2 xl:w-2/5 2xl:w-1/3">
                <div className="w-full flex justify-between items-end">
                    <h1 className="w-full text-4xl text-justify">Your Balota</h1>
                    <button onClick={() => setIsEditToggled(!isEditToggled)} type="button" className="opacity-60 text-lg">{isEditToggled ? "Back" : "Edit"}</button>
                </div>
                <div className="flex flex-col items-end">
                    <button type="button" className="bg-green-600 w-full py-1 mt-2 rounded-xl text-white font-semibold hover:cursor-not-allowed opacity-60" disabled>Download my Balota</button>
                    <span className="text-xs text-gray-500 mr-2">Feature coming soon</span>
                </div>
                <div className="mt-3">
                    <h2 className="text-2xl">Senators</h2>
                    {
                        senators.length === 0 ?
                            <p>No senators selected. Add <a href="/senators" className="text-yellow-500">here</a>.</p> :
                            <div>
                                {
                                    senators.sort((a,b) => a.ballot_number - b.ballot_number).map((senator) => (
                                        <CandidateRow 
                                            name={senator.ballot_name}
                                            ballot_number={senator.ballot_number}
                                            removeCandidate={() => removeSenator(senator)}
                                            isEditToggled={isEditToggled}
                                            key={senator.id}
                                        />
                                    ))
                                }
                            </div>
                    }
                    {
                        senators.length < 12 && senators.length > 0 && (
                            <p className="text-center mt-2">{12-senators.length} slot{12-senators.length === 11 ? "" : "s"} left. Add <a href="/senators" className="text-yellow-500">here</a>.</p>
                        )
                    }
                </div>
                <Separator className="mt-6 bg-gray-300" />
                <div className="mt-3">
                    <h2 className="text-2xl">Partylist</h2>
                    <div>
                        {
                                partylist === null ? 
                                <p>No partylist selected. Add <a href="/partylists" className="text-yellow-500">here</a>.</p> :
                        
                                <CandidateRow 
                                    name={partylist?.ballot_name}
                                    ballot_number={partylist?.ballot_number}
                                    removeCandidate={removePartylist}
                                    isEditToggled={isEditToggled}
                                />
                        }
                    </div>
                </div>
                <Separator className="mt-6 bg-gray-300" />
                <div className="mt-3">
                    <h2 className="text-2xl">Local Positions</h2>
                    {
                        location?.province && (
                            <>
                                <div className="mt-2">
                                    <h3 className="text-xl">Governor</h3>
                                    {
                                        governor !== undefined ?
                                        <CandidateRow 
                                            name={governor.ballot_name}
                                            ballot_number={governor.ballot_number}
                                            removeCandidate={() => removeLocalCandidate(governor.id)}
                                            isEditToggled={isEditToggled}
                                            key={governor.id}
                                        />
                                        :
                                        <p>No governor selected. Add <a href="/local-candidates" className="text-yellow-500">here</a>.</p>
                                        
                                    }
                                </div>
                                <div className="mt-2">
                                    <h3 className="text-xl">Vice-Governor</h3>
                                    {
                                        viceGovernor !== undefined ?
                                            <CandidateRow 
                                                name={viceGovernor.ballot_name}
                                                ballot_number={viceGovernor.ballot_number}
                                                removeCandidate={() => removeLocalCandidate(viceGovernor.id)}
                                                isEditToggled={isEditToggled}
                                                key={viceGovernor.id}
                                            />
                                        :
                                        <p>No vice governor selected. Add <a href="/local-candidates" className="text-yellow-500">here</a>.</p>
                                    }
                                </div>
                                <div className="mt-2">
                                    <h3 className="text-xl">Provincial Board</h3>
                                    {
                                        provincialBoardMembers.length > 0 ?
                                        provincialBoardMembers.map((localCandidate) => (
                                            <CandidateRow 
                                            name={localCandidate.ballot_name}
                                                ballot_number={localCandidate.ballot_number}
                                                removeCandidate={() => removeLocalCandidate(localCandidate.id)}
                                                isEditToggled={isEditToggled}
                                                key={localCandidate.id}
                                            />
                                            )
                                        )
                                        :
                                        <p>No provincial members selected. Add <a href="/local-candidates" className="text-yellow-500">here</a>.</p>
                                    }
                                </div>
                            </>
                        )
                    }
                    <div className="mt-2">
                        <h3 className="text-xl">Mayor</h3>
                            {
                                mayor !== undefined ?
                                    <CandidateRow 
                                        name={mayor.ballot_name}
                                        ballot_number={mayor.ballot_number}
                                        removeCandidate={() => removeLocalCandidate(mayor.id)}
                                        isEditToggled={isEditToggled}
                                                key={mayor.id}
                                    />
                                    :
                                    <p>No mayor selected. Add <a href="/local-candidates" className="text-yellow-500">here</a>.</p>
                        }
                    </div>
                    <div className="mt-2">
                        <h3 className="text-xl">Vice-Mayor</h3>
                            {
                                viceMayor !== undefined ?
                                    <CandidateRow 
                                        name={viceMayor.ballot_name}
                                        ballot_number={viceMayor.ballot_number}
                                        removeCandidate={() => removeLocalCandidate(viceMayor.id)}
                                        isEditToggled={isEditToggled}
                                                key={viceMayor.id}
                                    />
                                    :
                                    <p>No vice mayor selected. Add <a href="/local-candidates" className="text-yellow-500">here</a>.</p>
                        }
                    </div>
                    <div className="mt-2">
                        <h3 className="text-xl">Representative</h3>
                            {
                                representative !== undefined ?
                                    <CandidateRow 
                                        name={representative.ballot_name}
                                        ballot_number={representative.ballot_number}
                                        removeCandidate={() => removeLocalCandidate(representative.id)}
                                        isEditToggled={isEditToggled}
                                                key={representative.id}
                                    />
                                    :
                                    <p>No representative selected. Add <a href="/local-candidates" className="text-yellow-500">here</a>.</p>
                        }
                    </div>
                    <div className="mt-2">
                        <h3 className="text-xl">Councilors</h3>
                            {
                                councilors.length > 0 ?
                                councilors.map((localCandidate) => (
                                    <CandidateRow 
                                        name={localCandidate.ballot_name}
                                        ballot_number={localCandidate.ballot_number}
                                        removeCandidate={() => removeLocalCandidate(localCandidate.id)}
                                        isEditToggled={isEditToggled}
                                        key={localCandidate.id}
                                    />
                                    )
                                )
                                :
                                <p>No councilors selected. Add <a href="/local-candidates" className="text-yellow-500">here</a>.</p>
                            }
                    </div>
                </div>
            </div>
        </div>
    )
}