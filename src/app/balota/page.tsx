"use client"

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Dialog } from "@radix-ui/react-dialog";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { db } from "../../../db/db.model";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toPng } from "html-to-image";

interface Province {
    province_id: string;
    name: string;
    region: string;
}

interface LGU {
    lgu_id: string;
    lgu: string;
    province_name: string|undefined;
    region: string|undefined;
    max_provincial_board: number|undefined;
    max_lgu_council: number|undefined;
}

interface Candidate {
    lgu_id:string;
    province_id:string|undefined;
    candidate_id: string;
    ballot_number: number;
    ballot_name: string;
    position: string;
}

interface CandidatesDto {
    governors: Candidate[];
    viceGovernors: Candidate[];
    provincialBoardMembers: Candidate[];
    representatives: Candidate[];
    mayors: Candidate[];
    viceMayors: Candidate[];
    lguCouncil: Candidate[];
    barmmRep: Candidate[];
    barmmParliament: Candidate[];
}

const regions = [
    "NCR", "CAR", "NIR", "I", "II", "III", "IV-A", "IV-B", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "BARMM", "CARAGA"
]

interface CandiatePopupProps {
    details: Candidate;
    onAdd: () => void;
    onRemove: () => void;
    isVoted: boolean;
}

function CandidatePopup(props: CandiatePopupProps) {
    const {details, onAdd, onRemove, isVoted} = props;

    return (
        <Dialog>
            <DialogTrigger onClick={() => console.log(details.ballot_name)} asChild>
                <button type="button" className="text-start text-blue-500 hover:opacity-80">{details.ballot_number}. {details.ballot_name}</button>
            </DialogTrigger>
            <DialogContent className="w-11/12">
                <DialogTitle>{details.ballot_name} - #{details.ballot_number}</DialogTitle>
                <p>AI-generated summaries coming back soon.</p>
                {
                    !isVoted ? <Button onClick={() => onAdd()} className="!rounded-xl !bg-yellow-500 hover:opacity-80 hover:cursor-pointer">Iboto!</Button> :
                    <Button onClick={() => onRemove()} className="!rounded-xl !bg-white !border-red-600 border-2 !text-red-600 hover:opacity-80 hover:cursor-pointer">Remove vote</Button>
                }
            </DialogContent>
        </Dialog>
    );
}

export default function Page() {
    const [selectedRegion, setSelectedRegion] = useState<string|undefined>(undefined);
    const [selectedProvince, setSelectedProvince] = useState<Province|undefined>(undefined);
    const [selectedLgu,setSelectedLgu] = useState<LGU|undefined>(undefined);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [lgus, setLgus] = useState<LGU[]>([]);
    const [isOverseas, setIsOverseas] = useState<boolean>(false);

    const [partylists, setPartylists] = useState<Candidate[]>([]);
    const [senators, setSenators] = useState<Candidate[]>([]);
    const [representatives, setRepresentatives] = useState<Candidate[]>([]);
    const [governors, setGovernors] = useState<Candidate[]>([]);
    const [viceGovernors, setViceGovernors] = useState<Candidate[]>([]);
    const [provincialBoardMembers, setProvincialBoardMembers] = useState<Candidate[]>([]);
    const [mayors, setMayors] = useState<Candidate[]>([]);
    const [viceMayors, setViceMayors] = useState<Candidate[]>([]);
    const [councilors, setCouncilors] = useState<Candidate[]>([]);
    const [barmmPartyMembers, setBarmmPartyMembers] = useState<Candidate[]>([]);
    const [barmmParliamentMembers, setBarmmParliamentMembers] = useState<Candidate[]>([]);
    
    // user selected values
    const [selectedSenators, setSelectedSenators] = useState<Candidate[]>([]);
    const [selectedPartylist, setSelectedPartylist] = useState<Candidate|undefined>(undefined);
    const [selectedRepresentative, setSelectedRepresentative] = useState<Candidate|undefined>(undefined);
    const [selectedGovernor, setSelectedGovernor] = useState<Candidate|undefined>(undefined);
    const [selectedViceGovernor, setSelectedViceGovernor] = useState<Candidate|undefined>(undefined);
    const [selectedProvincialBoardMembers, setSelectedProvincialBoardMembers] = useState<Candidate[]>([]);
    const [selectedMayor, setSelectedMayor] = useState<Candidate|undefined>(undefined);
    const [selectedViceMayor, setSelectedViceMayor] = useState<Candidate|undefined>(undefined);
    const [selectedCouncilors, setSelectedCouncilors] = useState<Candidate[]>([]);
    const [selectedBarmmParty, setSelectedBarmmParty] = useState<Candidate|undefined>(undefined);
    const [selectedBarmmBoardMember, setSelectedBarmmBoardMember] = useState<Candidate|undefined>(undefined);

    // loading markers
    const [isProvincesLoaded, setProvincesLoaded] = useState<boolean>(true);
    const [isLGUsLoaded, setLGUsLoaded] = useState<boolean>(true);
    const [isNationalPositionsLoaded, setNationalPositionsLoaded] = useState<boolean>(false);
    const [isLocalPositionsLoaded, setLocalPositionsLoaded] = useState<boolean>(true);

    // state for search
    const [partylistSearch, setPartylistSearch] = useState<string>("");
    const [senatorSearch, setSenatorSearch] = useState<string>("");

    const retrieveNationalPositions = async () => {
        const res = await fetch("/api/candidates");

        if (!res.ok) return;

        const data = await res.json();

        setPartylists(data["partylists"]);
        setSenators(data["senators"]);
    }

    const loadSavedLocalPositions = async (lguId:string) => {
        setLocalPositionsLoaded(false);

        const res = await fetch(`/api/candidates?lgu_id=${lguId}`);

        if (!res.ok) return;

        const data:CandidatesDto = await res.json();

        // setCandidates(data);
        setRepresentatives(data.representatives);
        setGovernors(data.governors);
        setViceGovernors(data.viceGovernors);
        setMayors(data.mayors);
        setViceMayors(data.viceMayors);
        setCouncilors(data.lguCouncil);
        setProvincialBoardMembers(data.provincialBoardMembers);
        setBarmmPartyMembers(data.barmmRep);
        setBarmmParliamentMembers(data.barmmParliament);
        setLocalPositionsLoaded(true);
    }

    const loadSavedNationalCandidates = async () => {
        const candidates = await db.candidates.toArray();

        setSelectedSenators(candidates.filter(c => c.position === "SENATOR"));
        
        const partylists = candidates.filter(c => c.position === "PARTYLIST");
        if (partylists.length === 0) return;

        setSelectedPartylist(partylists[0]);
    }

    const loadSavedLocalCandidates = async () => {
        const candidates = await db.candidates.toArray();

        setSelectedRepresentative(candidates.find(c => c.position === "MEMBER, HOUSE OF REPRESENTATIVES") as Candidate);
        setSelectedGovernor(candidates.find(c => c.position === "PROVINCIAL GOVERNOR"));
        setSelectedViceGovernor(candidates.find(c => c.position === "PROVINCIAL VICE-GOVERNOR"));
        setSelectedMayor(candidates.find(c => c.position === "MAYOR"));
        setSelectedViceMayor(candidates.find(c => c.position === "VICE-MAYOR"));
        setSelectedProvincialBoardMembers(candidates.filter(c => c.position === "MEMBER, SANGGUNIANG PANLALAWIGAN"));
        setSelectedCouncilors(candidates.filter(c => c.position === "LGU_COUNCIL"));
        setSelectedBarmmBoardMember(candidates.find(c => c.position === "BARMM MEMBERS OF THE PARLIAMENT"));
        setSelectedBarmmParty(candidates.find(c => c.position === "BARMM PARTY REPRESENTATIVES"));
    }

    useEffect(() => {
        const region = localStorage.getItem("region");
        const province = localStorage.getItem("province");
        const lguId = localStorage.getItem("lguId");

        retrieveNationalPositions();
        setNationalPositionsLoaded(true);

        loadSavedNationalCandidates();

        if (!region || !lguId) return; // short circuit
        
        loadSavedLocalCandidates();

        loadLocationOptions(region, province, lguId);
            
        // retrieve local candidates
        loadSavedLocalPositions(lguId);
    }, []);

    const loadLocationOptions = async (savedRegion: string, savedProvince: string|null, savedLguId:string|null) => {
        setProvinces([]);
        setLgus([]);

        if (savedRegion === "NCR") {
            // retrieve LGUs
            setLGUsLoaded(false);
            const res = await fetch(`api/lgus?region=NCR`);
            
            if (!res.ok) {
                // error in retrieval
                return;
            }

            const data = await res.json();
            setLgus(data.lgus);

            const selectedLgu = (data.lgus as LGU[]).find(l => l.lgu_id === savedLguId);
            if (!selectedLgu) return;   // pop error

            setSelectedLgu(selectedLgu);
            setLGUsLoaded(true);
        } else {
            setProvincesLoaded(false);
            setLGUsLoaded(false);
            // retrieve
            const res = await fetch(`api/provinces?region=${savedRegion}`)
            
            if (!res.ok) {
                // error in retrieval
                return;
            }

            let data = await res.json();
            
            setProvinces(data.provinces);
            
            const selected = (data.provinces as Province[]).find(p => p.name === savedProvince);
            if (selected) setSelectedProvince(selected);

            // if (savedProvince) setSelectedProvince(data.provinces.find)
            setProvincesLoaded(true);

            const lguRes = await fetch(`api/lgus?region=${savedRegion}&province=${savedProvince}`);
            
            if (!lguRes.ok) {
                // error in retrieval
                return;
            }

            data = await lguRes.json();
            setLgus(data.lgus);

            const selectedLgu = (data.lgus as LGU[]).find(l => l.lgu_id === savedLguId);
            if (!selectedLgu) return;   // pop error

            setSelectedLgu(selectedLgu);
            setLGUsLoaded(true);
        }
        setSelectedRegion(savedRegion);
    }

    const onRegionChange = async (newRegion: string) => {
        setProvinces([]);
        setLgus([]);

        if (newRegion === "NCR") {
            // retrieve LGUs
            const res = await fetch(`api/lgus?region=NCR`);
            
            if (!res.ok) {
                // error in retrieval
                return;
            }

            const data = await res.json();
            setLgus(data.lgus);
        } else {
            setProvincesLoaded(false);
            // retrieve
            const res = await fetch(`api/provinces?region=${newRegion}`)
            
            if (!res.ok) {
                // error in retrieval
                return;
            }

            const data = await res.json();
            console.log(data.provinces)
            setProvinces(data.provinces);
            setProvincesLoaded(true);
        }
        setSelectedRegion(newRegion);
    }

    const onProvinceChange = async (newProvinceName: string) => {
        setLGUsLoaded(false);
        setLgus([]);

        const selected = provinces.find(p => p.name === newProvinceName);
        if (!selected) return;  // pop error

        setSelectedProvince(selected);

        // const
        const res = await fetch(`api/lgus?region=${selectedRegion}&province=${newProvinceName}`);
            
        if (!res.ok) {
            // error in retrieval
            setProvincesLoaded(true);
            return;
        }

        const data = await res.json();
        setLgus(data.lgus);
        setLGUsLoaded(true);
        localStorage.setItem("province", selected.name);
    }

    const onLGUChange = async (newLguId: string) => {
        setSelectedLgu(lgus.find(lgu => lgu.lgu_id === newLguId));
    }

    const clearLocalPositions = async () => {
        const candidates = await db.candidates.toArray();

        const filteredCandidates = candidates.filter(c => c.position !== "SENATOR" && c.position !== "PARTYLIST");

        for (const candidate of filteredCandidates) {
            db.candidates.delete(candidate.candidate_id);
        }
    }

    const onClear = () => {
        setLgus([]);
        setProvinces([]);
        setSelectedRegion(undefined);

        // remove local candidates
        setRepresentatives([]);
        setGovernors([]);
        setViceGovernors([]);
        setMayors([]);
        setViceMayors([]);
        setCouncilors([]);
        setBarmmPartyMembers([]);
        setBarmmParliamentMembers([]);
        setProvincialBoardMembers([]);

        clearLocalPositions();

        // remove options saved in localStorage
        localStorage.removeItem("region");
        localStorage.removeItem("province");
        localStorage.removeItem("lguId");
    }

    const onGenerate = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        setLocalPositionsLoaded(false);

        let res;

        if (isOverseas) {
            res = await fetch("/api/candidates");
        } else {
            clearLocalPositions();
            if (!selectedLgu) {
                // show warning
                return;
            }

            res = await fetch(`/api/candidates?lgu_id=${selectedLgu?.lgu_id}`);
        }

        if (!res.ok) return;

        const data:CandidatesDto = await res.json();

        // setCandidates(data);
        setRepresentatives(data.representatives);
        setGovernors(data.governors);
        setViceGovernors(data.viceGovernors);
        setMayors(data.mayors);
        setViceMayors(data.viceMayors);
        setCouncilors(data.lguCouncil);
        setProvincialBoardMembers(data.provincialBoardMembers);
        setBarmmPartyMembers(data.barmmRep);
        setBarmmParliamentMembers(data.barmmParliament);
        if (!isOverseas) setLocalPositionsLoaded(true);

        // save location info into local storage
        if (selectedRegion) localStorage.setItem("region", selectedRegion);
        if (selectedProvince) localStorage.setItem("province", selectedProvince.name);
        if (selectedLgu) localStorage.setItem("lguId", selectedLgu.lgu_id);
    }

    const onSenatorSelect = (event: React.MouseEvent<HTMLInputElement>, senator: Candidate) => {
        if (selectedSenators.length === 12 && !selectedSenators.find(s => s.candidate_id === senator.candidate_id)) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        
        if (selectedSenators.find(s => s.candidate_id === senator.candidate_id) !== undefined) {
            setSelectedSenators(selectedSenators.filter(s => s.candidate_id != senator.candidate_id));
            db.candidates.delete(senator.candidate_id);
            return;
        }
        
        setSelectedSenators([...selectedSenators, senator]);
        db.candidates.add(senator as Candidate, senator.candidate_id);
    }

    const onPartylistSelect = (event: React.MouseEvent<HTMLInputElement>, partylist:Candidate) => {
        // console.log(event.target.checked);
        // console.log(selectedPartylist);

        if (selectedPartylist !== undefined && partylist.candidate_id !== selectedPartylist.candidate_id){
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (selectedPartylist) {
            setSelectedPartylist(undefined);
            db.candidates.delete(partylist.candidate_id);
            return;
        }

        setSelectedPartylist(partylist);
        db.candidates.add(partylist as Candidate, partylist.candidate_id);
    }

    const onRepresentativeSelect = (event: React.MouseEvent<HTMLInputElement>, representative:Candidate) => {
        if (selectedRepresentative !== undefined && selectedRepresentative.candidate_id !== representative.candidate_id){
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (selectedRepresentative) {
            setSelectedRepresentative(undefined);
            db.candidates.delete(representative.candidate_id);
            return;
        }

        db.candidates.add(representative, representative.candidate_id);
        setSelectedRepresentative(representative);
    }

    const onGovernorSelect = (event: React.MouseEvent<HTMLInputElement>, governor:Candidate) => {
        if (selectedGovernor !== undefined && selectedGovernor.candidate_id !== governor.candidate_id){
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (selectedGovernor) {
            setSelectedGovernor(undefined);
            db.candidates.delete(governor.candidate_id);
            return;
        }

        db.candidates.add(governor, governor.candidate_id);
        setSelectedGovernor(governor);
    }

    const onViceGovernorSelect = (event: React.MouseEvent<HTMLInputElement>, viceGovernor:Candidate) => {
        if (selectedViceGovernor !== undefined && selectedViceGovernor.candidate_id !== viceGovernor.candidate_id){
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (selectedViceGovernor) {
            setSelectedViceGovernor(undefined);
            db.candidates.delete(viceGovernor.candidate_id);
            return;
        }

        db.candidates.add(viceGovernor, viceGovernor.candidate_id);
        setSelectedViceGovernor(viceGovernor);
    }

    const onMayorSelect = (event: React.MouseEvent<HTMLInputElement>, mayor:Candidate) => {
        if (selectedMayor !== undefined && selectedMayor.candidate_id !== mayor.candidate_id){
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (selectedMayor) {
            setSelectedMayor(undefined);
            db.candidates.delete(mayor.candidate_id);
            return;
        }

        db.candidates.add(mayor, mayor.candidate_id);
        setSelectedMayor(mayor);
    }

    const onViceMayorSelect = (event: React.MouseEvent<HTMLInputElement>, viceMayor:Candidate) => {
        if (selectedViceMayor !== undefined && selectedViceMayor.candidate_id !== viceMayor.candidate_id){
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (selectedViceMayor) {
            setSelectedViceMayor(undefined);
            db.candidates.delete(viceMayor.candidate_id);
            return;
        }

        db.candidates.add(viceMayor, viceMayor.candidate_id);
        setSelectedViceMayor(viceMayor);
    }

    const onCouncilorSelect = (event: React.MouseEvent<HTMLInputElement>, councilor: Candidate) => {
        if (selectedCouncilors.length === selectedLgu?.max_lgu_council && !selectedCouncilors.find(s => s.candidate_id === councilor.candidate_id)) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (selectedCouncilors.find(s => s.candidate_id === councilor.candidate_id) !== undefined) {
            setSelectedCouncilors(selectedCouncilors.filter(s => s.candidate_id != councilor.candidate_id));
            db.candidates.delete(councilor.candidate_id);
            return;
        }

        db.candidates.add(councilor, councilor.candidate_id);
        setSelectedCouncilors([...selectedCouncilors, councilor]);
    };

    const onProvincialBoardSelect = (event: React.MouseEvent<HTMLInputElement>, provincialBoardMember: Candidate) => {
        if (selectedProvincialBoardMembers.length === selectedLgu?.max_provincial_board && !selectedProvincialBoardMembers.find(s => s.candidate_id === provincialBoardMember.candidate_id)) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (selectedProvincialBoardMembers.find(s => s.candidate_id === provincialBoardMember.candidate_id)) {
            setSelectedProvincialBoardMembers(selectedProvincialBoardMembers.filter(s => s.candidate_id != provincialBoardMember.candidate_id));
            db.candidates.delete(provincialBoardMember.candidate_id);
            return;
        }

        db.candidates.add(provincialBoardMember, provincialBoardMember.candidate_id);
        setSelectedProvincialBoardMembers([...selectedProvincialBoardMembers, provincialBoardMember]);
    };

    const onBarmmPartylistSelect = (event: React.MouseEvent<HTMLInputElement>, barmmPartylist:Candidate) => {
        if (selectedBarmmParty !== undefined && selectedBarmmParty.candidate_id !== barmmPartylist.candidate_id){
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (selectedBarmmParty) {
            setSelectedBarmmParty(undefined);
            db.candidates.delete(barmmPartylist.candidate_id);
            return;
        }

        db.candidates.add(barmmPartylist, barmmPartylist.candidate_id);
        setSelectedBarmmParty(barmmPartylist);
    }

    const onBarmmParliamentMemberSelect = (event: React.MouseEvent<HTMLInputElement>, barmmParliamentMember:Candidate) => {
        if (selectedBarmmBoardMember !== undefined && selectedBarmmBoardMember.candidate_id !== barmmParliamentMember.candidate_id){
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (selectedBarmmBoardMember) {
            setSelectedBarmmBoardMember(undefined);
            db.candidates.delete(barmmParliamentMember.candidate_id);
            return;
        }

        db.candidates.add(barmmParliamentMember, barmmParliamentMember.candidate_id);
        setSelectedBarmmBoardMember(barmmParliamentMember);
    }

    const hiddenRef = useRef<HTMLDivElement>(null);

    const handleExport = async () => {
      if (!hiddenRef.current) return;
  
      try {
        const dataUrl = await toPng(hiddenRef.current, {skipFonts: true});
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'balota.png';
        link.click();
      } catch (err) {
        console.error('Export failed', err);
      }
    };

    return (
        <div className="h-full flex flex-col items-center justify-start py-6 overflow-x-hidden">
            <div className="w-5/6 md:w-4/5 lg:w-1/2 xl:w-2/5 2xl:w-1/3">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl">Generate Ballot</h1>
                </div>
                <div>
                    <div className="flex justify-between items-center text-lg">
                        <p>Select Location</p>
                        <button onClick={() => onClear()} type="button" className="opacity-50">Clear</button>
                    </div>
                    <div className="flex justify-between items-end flex-col md:flex-row gap-2">
                        <div className="w-full md:w-[24%]">
                            <label className="text-xs text-gray-600">Region</label>
                            <Select onValueChange={onRegionChange} value={selectedRegion} disabled={isOverseas}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Regions</SelectLabel>
                                        {
                                            regions.map(region =>
                                                <SelectItem key={region} value={region} className="hover:opacity-40 py-1 px-2 hover:cursor-pointer">{region}</SelectItem>
                                            )
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-[24%]">
                            <label className="text-xs text-gray-600">Province</label>
                            <div className="flex items-center">
                                <Select onValueChange={onProvinceChange} value={selectedProvince?.name} disabled={provinces.length === 0 || isOverseas}>
                                    {/* <SelectTrigger className="w-full"> */}
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select province" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Provinces</SelectLabel>
                                            {
                                                provinces.map(province =>
                                                    <SelectItem key={province.province_id} value={province.name} className="hover:opacity-40 py-1 px-2 hover:cursor-pointer">{province.name}</SelectItem>
                                                )
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {
                                    isProvincesLoaded ? 
                                    <></>
                                        :
                                    <LoadingSpinner className="size-4" />
                                }
                            </div>
                        </div>
                        <div className="w-full md:w-[24%]">
                            <label className="text-xs text-gray-600">LGU</label>
                            <div className="flex items-center">
                                <Select onValueChange={onLGUChange} value={selectedLgu?.lgu_id} disabled={lgus.length === 0 || isOverseas}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select LGU" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>LGUs</SelectLabel>
                                        {
                                            lgus.map(lgu =>
                                                <SelectItem key={lgu.lgu_id} value={lgu.lgu_id} className="hover:opacity-40 py-1 px-2 hover:cursor-pointer">{lgu.lgu}</SelectItem>
                                            )
                                        }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {
                                    isLGUsLoaded ? 
                                    <></> :
                                    <LoadingSpinner className="size-4" />
                                }
                            </div>
                        </div>
                        <div className="w-full md:w-[24%]">
                            <Button disabled={isOverseas} onClick={onGenerate} type="button" className={` w-full ${isOverseas && "opacity-85 hover:cursor-not-allowed"}` }>Set Location</Button>
                        </div>
                    </div>
                    <div className="w-full px-1 mb-2">
                        <input checked={isOverseas} onChange={(e) => setIsOverseas(e.target.checked)} className="mr-2" type="checkbox" />
                        <label className="text-sm">Overseas?</label>
                    </div>
                </div>

                <Accordion type="multiple" defaultValue={["senators", "partylists", "representative", "governor", "vice-governor", "mayor", "vice-mayor", "councilors", "provincial-boardd", "barmm-partylist", "barmm-parliament"]} >
                    {
                        isNationalPositionsLoaded ?
                        (
                            <>
                            <AccordionItem value="senators">
                                <AccordionTrigger className="text-lg" >Senators (12)</AccordionTrigger>
                                <AccordionContent className="w-full">
                                    <div className="w-full relative">
                                        <Input type="text" placeholder="Enter senator name" onChange={(e:ChangeEvent<HTMLInputElement>) => setSenatorSearch(e.target.value)} />
                                        <Search className="absolute right-3 top-1.5" />
                                    </div>
                                    <div className="w-full grid grid-cols-2 py-3 lg:grid-cols-3 h-72 md:h-40 overflow-y-scroll">
                                    {
                                        senators.filter(s => s.ballot_name.includes(senatorSearch.toLocaleUpperCase())).map(candidate => 
                                            <div className="flex justify-start items-start gap-1" key={candidate.candidate_id}>
                                                <input disabled={selectedSenators.length > 12 && !selectedSenators.includes(candidate)} className="mt-1 rounded-full" type="checkbox" onClick={(e) => onSenatorSelect(e, candidate)} defaultChecked={selectedSenators.filter(c => c.candidate_id === candidate.candidate_id).length > 0}/> 
                                                <CandidatePopup details={candidate} onAdd={() => {}} onRemove={() => {}} isVoted={selectedSenators.includes(candidate)} />
                                            </div>
                                        )
                                    }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="partylists">
                                <AccordionTrigger className="text-lg" >Partylists</AccordionTrigger>
                                <AccordionContent className="w-full">
                                    <div className="w-full relative">
                                        <Input type="text" placeholder="Enter partylist name" onChange={(e:ChangeEvent<HTMLInputElement>) => setPartylistSearch(e.target.value)} />
                                        <Search className="absolute right-3 top-1.5" />
                                    </div>
                                    <div className="w-full grid grid-cols-2 py-3 lg:grid-cols-3 h-72 md:h-40 overflow-y-scroll">
                                    {
                                        partylists.filter(p => p.ballot_name.includes(partylistSearch.toLocaleUpperCase())).map(candidate => 
                                            <div className="flex justify-start items-start gap-1" key={candidate.candidate_id}>
                                                <input className="mt-1" type="checkbox" onClick={(e) => onPartylistSelect(e, candidate)} defaultChecked={selectedPartylist && selectedPartylist.candidate_id === candidate.candidate_id} />
                                                <CandidatePopup details={candidate} onAdd={() => {}} onRemove={() => {}} isVoted={selectedPartylist?.candidate_id === candidate.candidate_id} />
                                            </div>
                                        )
                                    }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            </>
                        ) :
                        (
                            <div className="w-full flex justify-center py-8">
                                <LoadingSpinner className="size-8" />
                            </div>
                        )
                    }
                    
                    {
                        isLocalPositionsLoaded ? 
                        (
                            <>
                            {
                                (representatives.length > 0 && !isOverseas) && (<AccordionItem value="representative">
                                <AccordionTrigger className="text-lg" >Member, House of Representatives</AccordionTrigger>
                                <AccordionContent className="w-full">
                                    <div className="w-full grid grid-cols-2 py-3 lg:grid-cols-3">
                                    {
                                        representatives.map(candidate => 
                                            <div className="flex justify-start items-start gap-1" key={candidate.candidate_id}>
                                                <input className="mt-1" type="checkbox" onClick={(e) => onRepresentativeSelect(e, candidate)} defaultChecked={selectedRepresentative && selectedRepresentative.candidate_id === candidate.candidate_id} />
                                                <CandidatePopup details={candidate} onAdd={() => {}} onRemove={() => {}} isVoted={selectedRepresentative?.candidate_id === candidate.candidate_id} />
                                                {/* <label className="text-sm">{candidate.ballot_number}. {candidate.ballot_name}</label> */}
                                            </div>
                                        )
                                    }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>)
                            }
                            {
                                (governors.length > 0 && !isOverseas) && (<AccordionItem value="governor">
                                <AccordionTrigger className="text-lg" >Governor</AccordionTrigger>
                                <AccordionContent className="w-full">
                                    <div className="w-full grid grid-cols-2 py-3 lg:grid-cols-3">
                                    {
                                        governors.map((candidate:Candidate) => 
                                            <div className="flex justify-start items-start gap-1" key={candidate.candidate_id}>
                                                <input className="mt-1" type="checkbox" onClick={(e) => onGovernorSelect(e, candidate)} defaultChecked={selectedGovernor && selectedGovernor.candidate_id === candidate.candidate_id} />
                                                <CandidatePopup details={candidate} onAdd={() => {}} onRemove={() => {}} isVoted={selectedGovernor?.candidate_id === candidate.candidate_id}  />
                                                {/* <label className="text-sm">{candidate.ballot_number}. {candidate.ballot_name}</label> */}
                                            </div>
                                        )
                                    }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>)
                            }
                            {
                                (viceGovernors.length > 0 && !isOverseas) && (<AccordionItem value="vice-governor">
                                <AccordionTrigger className="text-lg" >Vice Governor</AccordionTrigger>
                                <AccordionContent className="w-full">
                                    <div className="w-full grid grid-cols-2 py-3 lg:grid-cols-3">
                                    {
                                        viceGovernors.map(candidate => 
                                            <div className="flex justify-start items-start gap-1" key={candidate.candidate_id}>
                                                <input className="mt-1" type="checkbox" onClick={(e) => onViceGovernorSelect(e, candidate)} defaultChecked={selectedViceGovernor && selectedViceGovernor.candidate_id === candidate.candidate_id} />
                                                <CandidatePopup details={candidate} onAdd={() => {}} onRemove={() => {}} isVoted={selectedViceGovernor?.candidate_id === candidate.candidate_id} />
                                                {/* <label className="text-sm">{candidate.ballot_number}. {candidate.ballot_name}</label> */}
                                            </div>
                                        )
                                    }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>)
                            }
                            {
                                (provincialBoardMembers.length > 0 && !isOverseas) && (
                                    <AccordionItem value="provincial-boardd">
                                        <AccordionTrigger className="text-lg" >Provincial Board Members ({selectedLgu?.max_provincial_board})</AccordionTrigger>
                                        <AccordionContent className="w-full">
                                            <div className="w-full grid grid-cols-2 py-3 lg:grid-cols-3">
                                            {
                                                provincialBoardMembers.map(candidate => 
                                                    <div className="flex justify-start items-start gap-1" key={candidate.candidate_id}>
                                                        <input disabled={selectedProvincialBoardMembers.length > 12 && !selectedProvincialBoardMembers.includes(candidate)} className="mt-1 rounded-full" type="checkbox" onClick={(e) => onProvincialBoardSelect(e, candidate)} defaultChecked={selectedProvincialBoardMembers.filter(pb => pb.candidate_id === candidate.candidate_id).length > 0}/> 
                                                        <CandidatePopup details={candidate} onAdd={() => {}} onRemove={() => {}} isVoted={selectedProvincialBoardMembers.includes(candidate)} />
                                                    </div>
                                                )
                                            }
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            }
                            {
                                (mayors.length > 0 && !isOverseas) && (<AccordionItem value="mayor">
                                <AccordionTrigger className="text-lg" >Mayors</AccordionTrigger>
                                <AccordionContent className="w-full">
                                    <div className="w-full grid grid-cols-2 py-3 lg:grid-cols-3">
                                    {
                                        mayors.map(candidate => 
                                            <div className="flex justify-start items-start gap-1" key={candidate.candidate_id}>
                                                <input className="mt-1" type="checkbox" onClick={(e) => onMayorSelect(e, candidate)} defaultChecked={selectedMayor && selectedMayor.candidate_id === candidate.candidate_id} />
                                                <CandidatePopup details={candidate} onAdd={() => {}} onRemove={() => {}} isVoted={selectedMayor?.candidate_id === candidate.candidate_id} />
                                                {/* <label className="text-sm">{candidate.ballot_number}. {candidate.ballot_name}</label> */}
                                            </div>
                                        )
                                    }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>)
                            }
                            {
                                (viceMayors.length > 0 && !isOverseas) && (<AccordionItem value="vice-mayor">
                                <AccordionTrigger className="text-lg" >Vice Mayors</AccordionTrigger>
                                <AccordionContent className="w-full">
                                    <div className="w-full grid grid-cols-2 py-3 lg:grid-cols-3">
                                    {
                                        viceMayors.map(candidate => 
                                            <div className="flex justify-start items-start gap-1" key={candidate.candidate_id}>
                                                <input className="mt-1" type="checkbox" onClick={(e) => onViceMayorSelect(e, candidate)} defaultChecked={selectedViceMayor && selectedViceMayor.candidate_id === candidate.candidate_id} />
                                                <CandidatePopup details={candidate} onAdd={() => {}} onRemove={() => {}} isVoted={selectedViceMayor?.candidate_id === candidate.candidate_id} />
                                            </div>
                                        )
                                    }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>)
                            }
                            {
                                (councilors.length > 0 && !isOverseas) && (
                                    <AccordionItem value="councilors">
                                        <AccordionTrigger className="text-lg" >Councilors ({selectedLgu?.max_lgu_council})</AccordionTrigger>
                                        <AccordionContent className="w-full">
                                            <div className="w-full grid grid-cols-2 py-3 lg:grid-cols-3">
                                            {
                                                councilors.map(candidate => 
                                                    <div className="flex justify-start items-start gap-1" key={candidate.candidate_id}>
                                                        <input disabled={selectedCouncilors.length > 12 && !selectedCouncilors.includes(candidate)} className="mt-1 rounded-full" type="checkbox" onClick={(e) => onCouncilorSelect(e, candidate)} defaultChecked={selectedCouncilors.filter(c => c.candidate_id === candidate.candidate_id).length > 0}/> 
                                                        <CandidatePopup details={candidate} onAdd={() => {}} onRemove={() => {}} isVoted={selectedCouncilors.includes(candidate)} />
                                                    </div>
                                                )
                                            }
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            }
                            {
                                (barmmPartyMembers.length > 0 && !isOverseas) && (
                                    <AccordionItem value="barmm-partylist">
                                        <AccordionTrigger className="text-lg" >Partylist, Bangsamoro Parliament</AccordionTrigger>
                                        <AccordionContent className="w-full">
                                            <div className="w-full grid grid-cols-2 py-3 lg:grid-cols-3">
                                            {
                                                barmmPartyMembers.map(candidate => 
                                                    <div className="flex justify-start items-start gap-1" key={candidate.candidate_id}>
                                                        <input disabled={selectedCouncilors.length > 12 && !selectedCouncilors.includes(candidate)} className="mt-1 rounded-full" type="checkbox" onClick={(e) => onBarmmPartylistSelect(e, candidate)} defaultChecked={selectedBarmmParty && selectedBarmmParty.candidate_id === candidate.candidate_id}/> 
                                                        <CandidatePopup details={candidate} onAdd={() => {}} onRemove={() => {}} isVoted={selectedBarmmParty?.candidate_id === candidate.candidate_id} />
                                                    </div>
                                                )
                                            }
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            }
                            {
                                (barmmParliamentMembers.length > 0 && !isOverseas) && (
                                    <AccordionItem value="barmm-parliament">
                                        <AccordionTrigger className="text-lg" >Member, Bangsamoro Parliament</AccordionTrigger>
                                        <AccordionContent className="w-full">
                                            <div className="w-full grid grid-cols-2 py-3 lg:grid-cols-3">
                                            {
                                                barmmParliamentMembers.map(candidate => 
                                                    <div className="flex justify-start items-start gap-1" key={candidate.candidate_id}>
                                                        <input disabled={selectedCouncilors.length > 12 && !selectedCouncilors.includes(candidate)} className="mt-1 rounded-full" type="checkbox" onClick={(e) => onBarmmParliamentMemberSelect(e, candidate)} defaultChecked={selectedBarmmBoardMember && selectedBarmmBoardMember.candidate_id === candidate.candidate_id}/> 
                                                        <CandidatePopup details={candidate} onAdd={() => {}} onRemove={() => {}} isVoted={selectedBarmmBoardMember?.candidate_id === candidate.candidate_id} />
                                                    </div>
                                                )
                                            }
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            }
                            </>
                        ):
                        (
                            <div className="w-full flex flex-col items-center justify-center py-8">
                                <LoadingSpinner className="size-8" />
                                <p className="text-xs">Loading Local Positions</p>
                            </div>
                        )
                    }
                    
                </Accordion>
                <div className="w-full mt-6">
                    <Button type="button" onClick={handleExport} className="w-full bg-[#37c443] font-semibold  hover:bg-[#37c443]" color="success">Export</Button>
                </div>
                <div className="h-screen w-screen bg-white absolute top-0 left-0 z-[-10]">
                </div>
                
                {/* generated ballot is hidden within */}
                <div
                    ref={hiddenRef}
                    style={{
                        fontFamily: 'Arial, sans-serif',
                    }}
                    className="bg-white flex w-[600px] flex-col gap-2 border-2 p-4 absolute top-0 left-0 z-[-30]">
                    <div className="flex items-end justify-between">
                        <div className="flex gap-2 items-center">
                            <img src="balota-logo.png" className="w-8" />
                            <h1 className="block w-3/5 text-2xl font-bold">Balota</h1>
                        </div>
                        <p className="block text-right text-xs">Generate yours at balota.vercel.app</p>
                    </div>
                    <div>
                        <div>
                        <h2 className="text-lg font-semibold">Senators</h2>
                        <div className="grid grid-cols-2">
                            {
                                selectedSenators.map(s => (
                                    <p key={s.candidate_id}>{s.ballot_number} {s.ballot_name}</p>
                                ))
                            }
                            {
                                Array.from({length: 12-selectedSenators.length}, (_,i) => <p key={`s${i}`}>Free Slot</p>)
                            }
                        </div>
                        </div>
                        <div className="grid grid-cols-2">
                        <div>
                            <h2 className="text-lg font-semibold">Partylists</h2>
                            <p>{selectedPartylist ? `${selectedPartylist.ballot_number} ${selectedPartylist.ballot_name}` : "Free Slot"}</p>
                        </div>
                        {
                            !isOverseas && (
                                <>
                                    <div>
                                        <h2 className="text-lg font-semibold">Representative</h2>
                                        <p>{selectedRepresentative ? `${selectedRepresentative.ballot_number} ${selectedRepresentative.ballot_name}` : "Free Slot"}</p>
                                    </div>
                                </>
                            )
                        }
                        </div>
                        {
                            !isOverseas && (
                                <>
                                {
                                    (governors.length > 0 && viceGovernors.length > 0) && (
                                    <div className="grid grid-cols-2">
                                        <div>
                                            <h2 className="text-lg font-semibold">Governor</h2>
                                            <p>{selectedGovernor ? `${selectedGovernor.ballot_number} ${selectedGovernor.ballot_name}` : "Free Slot"}</p>
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold">Vice-Governor</h2>
                                            <p>{selectedViceGovernor ? `${selectedViceGovernor.ballot_number} ${selectedViceGovernor.ballot_name}` : "Free Slot"}</p>
                                        </div>
                                    </div>
                                    )
                                }
                                {
                                    provincialBoardMembers.length > 0 && (
                                        <div>
                                            <h2 className="text-lg font-semibold">Provincial Board Members</h2>
                                            <div className="grid grid-cols-2">
                                                {
                                                    selectedProvincialBoardMembers.map(s => (
                                                        <p key={s.candidate_id}>{s.ballot_number} {s.ballot_name}</p>
                                                    ))
                                                }
                                                {
                                                    selectedLgu?.max_provincial_board && (
                                                    Array.from({length: selectedLgu.max_provincial_board-selectedProvincialBoardMembers.length}, (_,i) => <p key={`pb${i}`}>Free Slot</p>))
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="grid grid-cols-2">
                                    <div>
                                        <h2 className="text-lg font-semibold">Mayor</h2>
                                        <p>{selectedMayor ? `${selectedMayor.ballot_number} ${selectedMayor.ballot_name}` : "Free Slot"}</p>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">Vice-Mayor</h2>
                                        <p>{selectedViceMayor ? `${selectedViceMayor.ballot_number} ${selectedViceMayor.ballot_name}` : "Free Slot"}</p>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Councilors</h2>
                                    <div className="grid grid-cols-2">
                                        {
                                            selectedCouncilors.map(s => (
                                                <p key={s.candidate_id}>{s.ballot_number} {s.ballot_name}</p>
                                            ))
                                        }
                                        {
                                            selectedLgu?.max_lgu_council && (
                                            Array.from({length: selectedLgu.max_lgu_council-selectedCouncilors.length}, (_,i) => <p key={`sc${i}`}>Free Slot</p>))
                                        }
                                    </div>
                                </div>
                                </>       
                            )
                        }


                        {
                            barmmPartyMembers.length > 0 && (
                                <div className="grid grid-cols-2">
                                    <div>
                                    <h2 className="text-lg font-semibold">BARMM, Partylist</h2>
                                    {
                                        selectedBarmmParty ? 
                                        <p>{selectedBarmmParty.ballot_number} {selectedBarmmParty.ballot_name}</p>
                                        :
                                        <p>Free Slot</p>
                                    }
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">BARMM, Parliament Member</h2>
                                        {
                                            selectedBarmmBoardMember ? 
                                            <p>{selectedBarmmBoardMember.ballot_number} {selectedBarmmBoardMember.ballot_name}</p>
                                            :
                                            <p>Free Slot</p>
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}