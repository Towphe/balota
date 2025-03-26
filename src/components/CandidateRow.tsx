import { LocalCandidate } from "@/models/LocalCandidate";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import { CandidateDescription } from "@/models/candidateDescription";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { LoadingSpinner } from "./LoadingSpinner";

export interface CandidateRowProps {
    details: LocalCandidate;
    isSelected: boolean;
    add:(localCandidate: LocalCandidate) => void;
    remove:(localCandidate: LocalCandidate) => void;
}

export function CandidateRow(props: CandidateRowProps) {
    const {details, isSelected, add, remove} = props;

    const [background, setBackground] = useState<CandidateDescription|undefined>();
    const [isBackgroundRendered, setIsBackgroundRendered] = useState<boolean>(false);

    const retrieveCandidateBackground = async (id:string) => {
        setBackground(undefined);
    
        const req = await fetch(`/api/local-candidates/background/${id}`);
        
        if (!req.ok) {
          // handle 
          setIsBackgroundRendered(true);
          return;
        }
    
        const data:CandidateDescription = await req.json();
    
        setBackground(data);
        setIsBackgroundRendered(true);
        
        return;
      }
    
    return (
        <div key={details.id} className="flex justify-between items-center">
                <div className="flex gap-3">
                <span>{details.ballot_number}</span>
                <Dialog>
                    <DialogTrigger onClick={() => retrieveCandidateBackground(details.id)}>
                        <h2 className="text-blue-500 hover:cursor-pointer !text-justify">{details.ballot_name}</h2>
                    </DialogTrigger>
                    <DialogContent className="w-11/12">
                        <DialogTitle>{details.ballot_name} - #{details.ballot_number}</DialogTitle>
                        <DialogDescription>{details.partylist}</DialogDescription>
                        {
                            !isBackgroundRendered ?
                                <div className="flex flex-col items-center justify-center w-full h-[10vh]">
                                    <LoadingSpinner className="size-12"></LoadingSpinner>
                                </div> :
                                (
                                    <>
                                        <div className="flex flex-col items-center gap-1.5 text-[0.85rem] w-full">
                                            <h3 className="font-semibold opacity-90 w-full">Background</h3>
                                            {
                                                background && (
                                                <p>{background.summary}</p>
                                            )
                                            }
                                            {
                                                !background && (
                                                <p>No relevant information found.</p>
                                            )
                                            }
                                        </div>
                                    <Accordion type="single" collapsible className="w-full overflow-x-hidden">
                                        <AccordionItem value="sources">
                                            <AccordionTrigger>Sources</AccordionTrigger>
                                            <AccordionContent className="flex flex-col gap-1.5 !w-max-full">
                                            {
                                                !isBackgroundRendered ?
                                                <div className="flex flex-col items-center justify-center py-6">
                                                <LoadingSpinner className="size-12"></LoadingSpinner>
                                                </div> :
                                                (
                                                <>
                                                    {
                                                    background && (
                                                          background.sources.map((source,i) => (
                                                            <p key={i}>{source}</p>
                                                          ))
                                                        )
                                                        }
                                                        {
                                                          !background && (
                                                            <p>No relevant sources found.</p>
                                                        )
                                                    }
                                                    </>)
                                                }
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </>
                            )
                        }
                        {
                            !isSelected ?
                            <Button onClick={() => add(details)} className="!rounded-xl !bg-yellow-500 hover:opacity-80 hover:cursor-pointer">Iboto!</Button> :
                            <Button onClick={() => remove(details)} className="!rounded-xl !bg-white !border-red-600 border-2 !text-red-600 hover:opacity-80 hover:cursor-pointer">Remove vote</Button>
                        }
                    </DialogContent>
                </Dialog>
                
            </div>
            {
                isSelected ?
                <Button onClick={() => remove(details)} className="!rounded-xl !bg-white !border-red-600 border-2 !text-red-600 px-2 hover:opacity-80 hover:cursor-pointer">Remove</Button>
                    :
                <Button onClick={() => add(details)} className="!rounded-xl !bg-yellow-500 hover:opacity-80 hover:cursor-pointer">Iboto!</Button>
            }
        </div>
    )
}