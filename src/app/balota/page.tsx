"use client"

import { Partylist } from "@/models/partylist";
import {useState, useEffect} from "react";
import { db } from "../../../db/db.model";
import { Senator } from "@/models/senator";

export default function Page() {
    const [partylist, setPartylist] = useState<Partylist|null>(null);
    const [senators, setSenators] = useState<Senator[]>([]);
    const [isEditToggled, setIsEditToggled] = useState<boolean>(false);

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

    useEffect(() => {
        const getPartylist = async () => {
            const pl = await db.partylists.limit(1).first();
            setPartylist(pl ?? null);
        };

        const getSenators = async () => {
            const sns = await db.senators.limit(12).toArray();
            setSenators(sns ?? []);
        }

        getPartylist();
        getSenators();
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-start py-12">
            <div className="w-5/6 md:w-3/5 lg:w-1/2 xl:w-2/5 2xl:w-1/3">
                <div className="w-full flex justify-between items-end">
                    <h1 className="w-full text-4xl text-justify">Your Balota</h1>
                    <button onClick={() => setIsEditToggled(!isEditToggled)} type="button" className="opacity-60 text-lg">{isEditToggled ? "Back" : "Edit"}</button>
                </div>
                <div className="mt-3">
                    <h2 className="text-2xl">Senators</h2>
                    {
                        senators.length === 0 ?
                            <p>No senators selected. Add <a href="/senators" className="text-yellow-500">here</a>.</p> :
                            <div>
                                {
                                    senators.sort((a,b) => a.ballot_number - b.ballot_number).map((senator) => (
                                        <div className="flex text-lg justify-between items-center" key={senator.id}>
                                            <p>{senator?.ballot_name}</p>
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="font-bold">{senator?.ballot_number}</span>
                                                <button type="button" onClick={() => removeSenator(senator)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-5 opacity-60 ${isEditToggled ? "block" : "hidden"}`}>
                                                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                                </svg>
                                                </button>
                                            </div>
                                        </div>
                                        
                                    ))
                                }
                            </div>
                    }
                </div>
                <div className="mt-3">
                    <h2 className="text-2xl">Partylist</h2>
                    <div>
                        <p>{partylist?.ballot_name}</p>
                        {
                                partylist === null ? 
                                <p>No partylist selected. Add <a href="/partylists" className="text-yellow-500">here</a>.</p> :
                        
                                <div className="flex text-lg justify-between items-center">
                                    <span className="font-bold">{partylist?.ballot_number}</span>
                                    <button type="button" onClick={() => removePartylist()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-5 opacity-60 ${isEditToggled ? "block" : "hidden"}`}>
                                        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}