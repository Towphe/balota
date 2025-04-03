"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { locationSchema } from "@/schema/locationSchema";
import { useState, useEffect } from "react";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { ProvinceInfo } from "@/models/ProvinceInfo";
import { LocalCandidate } from "@/models/LocalCandidate";
import { db } from "../../../db/db.model";
import { CandidateRow } from "@/components/CandidateRow";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Lgu {
    id: string;
    name: string;
    province_name: string;
    region: string;
    total_lgu_districts: number;
    total_legislative_districts: number;
}
  
interface LgusDto {
    lgus: Lgu[];
    total: number;
    totalLegislativeDistricts: number;
    totalProvincialDistricts: number;
    totalCouncilorDistricts: number;
}

export default function Page() {
    const regions = [
        { "code": "X", "name": "Northern Mindanao" },
        { "code": "V", "name": "Bicol Region" },
        { "code": "I", "name": "Ilocos Region" },
        { "code": "VIII", "name": "Eastern Visayas" },
        { "code": "BARMM", "name": "Bangsamoro Autonomous Region in Muslim Mindanao" },
        { "code": "XI", "name": "Davao Region" },
        { "code": "IV-A", "name": "CALABARZON" },
        { "code": "NIR", "name": "Negros Island Region" },
        { "code": "III", "name": "Central Luzon" },
        { "code": "IV-B", "name": "MIMAROPA" },
        { "code": "CAR", "name": "Cordillera Administrative Region" },
        { "code": "VII", "name": "Central Visayas" },
        { "code": "II", "name": "Cagayan Valley" },
        { "code": "IX", "name": "Zamboanga Peninsula" },
        { "code": "VI", "name": "Western Visayas" },
        { "code": "CARAGA", "name": "Caraga Region" },
        { "code": "NCR", "name": "National Capital Region"}
      ];

      const [region, setRegion] = useState<string|undefined>();

      const [newProvince, setNewProvince] = useState<string|undefined>();
      const [provincesList, setProvincesList] = useState<ProvinceInfo[]>([]);
      const [province, setProvince] = useState<string|undefined>();

      const [provincialDistrict, setProvincialDistrict] = useState<number |undefined>();
      const [provinceDistrictCount, setProvinceDistrictCount] = useState<number|undefined>();
      const [provinceLegislativeDistrictCount, setProvinceLegislativeDistrictCount] = useState<number|undefined>();

      const [councilorDistrict, setCouncilorDistrict] = useState<number | undefined>();
      const [councilorDistrictCount, setCouncilorDistrictCount] = useState<number | undefined>();
    
      const [newLgu, setNewLgu] = useState<string|undefined>();
      const [lgu, setLgu] = useState<string|undefined>();
      const [lgus, setLgus] = useState<LgusDto|undefined>();

      const [legislativeDistrict, setLegislativeDistrict] = useState<number|undefined>();
      const [legislativeDistrictCount, setLegislativeDistrictCount]= useState<number>(0);
      const [isLocationModalOpen, setLocationModalOpen] = useState<boolean>(false);
      const [isLocationSet, setIsLocationSet] = useState<boolean>(false);
      
      const [governors, setGovernors] = useState<LocalCandidate[]>([]);
      const [viceGovernors, setViceGovernors] = useState<LocalCandidate[]>([]);
      const [mayors, setMayors] = useState<LocalCandidate[]>([]);
      const [viceMayors, setViceMayors] = useState<LocalCandidate[]>([]);
      const [representatives, setRepresentatives] = useState<LocalCandidate[]>([]);
      const [provincialBoard, setProvincialBoard] = useState<LocalCandidate[]>([]);
      const [councilors, setCouncilors] = useState<LocalCandidate[]>([]);
      const [hasLocalRepresentatives, setHasLocalRepresentatives] = useState<boolean|undefined>();

      // selected candidates
      const [selectedGovernor, setSelectedGovernor] = useState<LocalCandidate|undefined>();
      const [selectedViceGovernor, setSelectedViceGovernor] = useState<LocalCandidate|undefined>();
      const [selectedMayor, setSelectedMayor] = useState<LocalCandidate|undefined>();
      const [selectedViceMayor, setSelectedViceMayor] = useState<LocalCandidate|undefined>();
      const [selectedRepresentative, setSelectedRepresentative] = useState<LocalCandidate|undefined>();
      const [selectedProvincialBoard, setSelectedProvincialBoard] = useState<LocalCandidate[]|undefined>();
      const [selectedCouncilors, setSelectedCouncilors] = useState<LocalCandidate[]>([]);

      // selected markers
      const [regionSelected, setRegionSelected] = useState<boolean>(false);
      const [provinceSelected, setProvinceSelected] = useState<boolean>(false);
      const [lguSelected, setLguSelected] = useState<boolean>(false);
      const [isNcrPicked, setIsNcrPicked] = useState<boolean>(false);

      const [isListRendered, toggleIsListRendered] = useState<boolean>(false);
    
    const locationForm = useForm<z.infer<typeof locationSchema>>({
        resolver: zodResolver(locationSchema),
        defaultValues: {
            region: undefined,
            province: undefined,
            lgu: undefined,
            legislativeDistrict: undefined,
            councilorDistrict: undefined
        }
    });

    async function clearSelection() {
        await db.localCandidates.clear();
        setSelectedGovernor(undefined);
        setSelectedViceGovernor(undefined);
        setSelectedMayor(undefined);
        setSelectedViceMayor(undefined);
        setSelectedRepresentative(undefined);
        setSelectedProvincialBoard(undefined);
        setSelectedCouncilors([]);
    }

    async function onSubmit(values: z.infer<typeof locationSchema>) {
        
        console.log(values);

        const r = values.region;
        const p = values.province;
        const l = values.lgu;
        const ld = values.legislativeDistrict;
        const cd = values.councilorDistrict;
        const pd = values.provincialDistrict;
        console.log(pd);
        // set in page
        setRegion(r);
        if (p) setProvince(p);
        else setProvince(undefined);
        setLgu(l);
        setLegislativeDistrict(ld);
        setCouncilorDistrict(cd)
        setProvincialDistrict(pd);

        localStorage.setItem("region", r);
        if (p) localStorage.setItem("province", p);
        else localStorage.removeItem("province");
        localStorage.setItem("lgu", l);
        localStorage.setItem("legislativeDistrict", ld.toString());
        localStorage.setItem("hasLocalRepresentatives", hasLocalRepresentatives ? "true" : "false");
        
        // set provincial district
        if (pd) localStorage.setItem("provincialDistrict", pd.toString());
        else localStorage.removeItem("provincialDistrict");

        toggleIsListRendered(false);

        // set marker if lgu has own representative
        // if (hasLocalRepresentatives) {
        //     localStorage.setItem("lguLegislativeDistrictCount", legislativeDistrictCount.toString());    
        // } else {
        //     localStorage.setItem("provinceLegislativeDistrictCount", provinceDistrictCount?.toString() ?? "0");    
        // }
        localStorage.setItem("legislativeDistrictCount", legislativeDistrictCount?.toString() ?? 0);

        // set councilor district
        localStorage.setItem("councilorDistrict", cd ? cd.toString() : "1");
        localStorage.setItem("councilorDistrictCount", cd?.toString() ?? "0");

        await clearSelection();

        retrieveCandidates(r, p, l, ld.toString(), pd?.toString() ?? "", cd?.toString() ?? "")
        setLocationModalOpen(false);
    }

    async function retrieveNCRCities(){
        // set province to undefined
        setProvince(undefined);
        locationForm.setValue("province", undefined);
        locationForm.setValue("provincialDistrict", undefined);

        // fetch NCR LGUs
        const lgusQuery = await fetch(`api/location/lgus/ncr`);
        if (!lgusQuery.ok) {
            return;
        }

        // treat JSON response body
        const lgus = await lgusQuery.json();
        
        // set LGUs
        setLgus(lgus);
    }

    async function onRegionChange(regionName:string){
        locationForm.setValue("province",undefined);
        locationForm.resetField("lgu", undefined);

        setRegionSelected(true);
        setProvinceSelected(false);
        setLguSelected(false);

        // clear succeeding forms
        setProvincesList([]);
        setProvinceLegislativeDistrictCount(0);
        setProvincialDistrict(undefined);
        
        // set LGU
        setProvince(undefined);
        setLgu(undefined);
        
        // clear legislative districts
        setLegislativeDistrict(undefined);
        setLegislativeDistrictCount(0);
        setProvinceDistrictCount(0);

        // clear councilor district
        setCouncilorDistrict(undefined);
        setCouncilorDistrictCount(0);

        if (regionName === "NCR") {
            await retrieveNCRCities();
            setProvince(undefined);
            setIsNcrPicked(true);
        } else {
            retrieveProvinces(regionName);
            setIsNcrPicked(false);
        }
    }

    async function onProvinceChange(provinceName:string){
        // locationForm.setValue("province",undefined);
        locationForm.setValue("provincialDistrict", 1);
        locationForm.resetField("legislativeDistrict", undefined);
        locationForm.resetField("councilorDistrict", undefined);

        // set placeholder
        setNewProvince(provinceName);
        
        setProvinceSelected(true);
        setLguSelected(false);

        const provinces = provincesList.filter(p => p.name === provinceName);
        if (provinces.length === 0) {
            return;
        }

        // clear succeeding provincial fields
        setProvinceLegislativeDistrictCount(0);
        setProvincialDistrict(undefined);

        // clear succeeding legislative fields
        setLegislativeDistrict(undefined);
        setProvinceLegislativeDistrictCount(provinces[0].total_legislative_district);

        // clear succeeding councilor fields
        setCouncilorDistrict(undefined);
        setCouncilorDistrictCount(0);

        retrieveLGUs(provinceName);
    }

    async function onLGUChange(lguName:string){
        // clear form
        // locationForm.setValue("provincialDistrict", undefined);
        // locationForm.resetField("legislativeDistrict");
        // locationForm.resetField("councilorDistrict");
        locationForm.setValue("legislativeDistrict", 1);
        locationForm.setValue("councilorDistrict", 1);

        setNewLgu(lguName);

        setLguSelected(true);
        
        // clear succeeding provincial fields
        setProvincialDistrict(undefined);

        // clear succeeding legislative fields
        setLegislativeDistrict(undefined);

        // clear succeeding councilor fields
        setCouncilorDistrict(undefined);
        setCouncilorDistrictCount(0);        

        // get LGU details
        const lguDetails = lgus?.lgus.filter((l) => l.name === lguName)[0];

        // check existence of own provincial board representatives for non-NCR
        if (region !== "NCR") {
            const res = await fetch(`/api/location/lgus/has-provincial-rep?l=${lguName}&p=${newProvince}`);
            const data = await res.json();

            locationForm.setValue("legislativeDistrict", 1);
            locationForm.setValue("councilorDistrict", 1);

            if (data.hasOwnProvincialRep === true) {
                // disable provincial rep selection
                locationForm.setValue("provincialDistrict", 1);
                // set provincial district count to only 1
                setProvinceDistrictCount(1);
            }
        }

        if (lguDetails?.total_legislative_districts === 0) {
            setHasLocalRepresentatives(false);
            setLegislativeDistrictCount(provinceLegislativeDistrictCount ?? 0);
        }
        else {
            setLegislativeDistrictCount(lguDetails?.total_legislative_districts ?? 0);
            setHasLocalRepresentatives(true) 
            if (lguDetails?.total_legislative_districts === 1) {
                setLegislativeDistrict(1);
            }
        };

        // set councilor districts
        setCouncilorDistrictCount(lguDetails?.total_lgu_districts ?? 0);
        if (lguDetails && lguDetails.total_lgu_districts === 1) {
            setCouncilorDistrict(1);   
        }
        
    }

    async function retrieveProvinces(region:string) {

        if (region === "") return;

        setRegion(region);

        const provincesQuery = await fetch(`api/location/provinces/${region}`);

        if (!provincesQuery.ok) {
            return;
        }

        const provinces = await provincesQuery.json();

        setProvincesList(provinces.provinces);
        setLgus(undefined);
    }

    async function retrieveLGUs(province:string) {
        if (province === "") return;

        const lgusQuery = await fetch(`api/location/lgus/${province}`);

        if (!lgusQuery.ok) {
            return;
        }

        const lgus:LgusDto = await lgusQuery.json();

        setLgus(lgus);
        setProvinceDistrictCount(lgus.totalProvincialDistricts);
        setProvinceLegislativeDistrictCount(lgus.totalLegislativeDistricts);
    }

    async function retrieveCandidates(r:string|null, p:string|null|undefined, l:string, ld: string, pd: string|undefined, cd: string) {
        console.log(pd);
        const candidatesReq = await fetch(`/api/local-candidates?r=${r}&l=${l}&ld=${ld}&cd=${cd}${pd !== undefined ? `&pd=${pd}` : ""}${p !== undefined ? `&p=${p}` : ""}`);

        if (!candidatesReq.ok){
            // error encountered
            return;
        }

        const candidates = await candidatesReq.json();

        console.log(candidates);

        if (province !== null){
            setGovernors(candidates.governors);
            setViceGovernors(candidates.viceGovernors);   
        }
        setMayors(candidates.mayors);
        setViceMayors(candidates.viceMayors);
        setCouncilors(candidates.councilors);
        console.log(candidates.representatives);
        setRepresentatives(candidates.representatives);
        setProvincialBoard(candidates.provincialBoard);
        toggleIsListRendered(true);
    }

    const selectGovernor = async (governor:LocalCandidate) => {
        setSelectedGovernor(governor);
        db.localCandidates.add(governor, governor.id);
    }
    const removeGovernor = async (governor:LocalCandidate) => {
        setSelectedGovernor(undefined);
        db.localCandidates.delete(governor.id)

    }
    
    const selectViceGovernor = (viceGovernor: LocalCandidate) => {
        setSelectedViceGovernor(viceGovernor);
        db.localCandidates.add(viceGovernor, viceGovernor.id);
    }
    const removeViceGovernor = (viceGovernor: LocalCandidate) => {
        setSelectedViceGovernor(undefined);
        db.localCandidates.delete(viceGovernor.id);
    }
    
    const selectMayor = (mayor: LocalCandidate) => {
        setSelectedMayor(mayor);
        db.localCandidates.add(mayor, mayor.id);
    }
    const removeMayor = () => {
        db.localCandidates.delete(selectedMayor?.id);
        setSelectedMayor(undefined);
    }
    
    const selectViceMayor = (viceMayor: LocalCandidate) => {
        setSelectedViceMayor(viceMayor);
        console.log(viceMayor)
        db.localCandidates.add(viceMayor, viceMayor.id);
    }
    const removeViceMayor = () => {
        db.localCandidates.delete(selectedViceMayor?.id);
        setSelectedViceMayor(undefined);
    }
    
    const selectCouncilor = (councilor: LocalCandidate) => {
        if (selectedCouncilors.length === 6) {
            // aleady full
            return;
        }
        setSelectedCouncilors([...selectedCouncilors, councilor]);
        
        db.localCandidates.add(councilor, councilor.id);
    }
    const removeCouncilor = (councilor: LocalCandidate) => {
        setSelectedCouncilors(selectedCouncilors.filter(c => c.ballot_name !== councilor.ballot_name));
        db.localCandidates.delete(councilor.id);
    }
    
    const selectRepresentative = (representative: LocalCandidate) => {
        setSelectedRepresentative(representative);
        db.localCandidates.add(representative, representative.id);
    }
    const removeRepresentative = () => {
        db.localCandidates.delete(selectedRepresentative?.id);
        setSelectedRepresentative(undefined);
    }
    
    const selectProvincialBoardMember = (provincialBoardMember: LocalCandidate) => {
        if (selectedProvincialBoard?.length === 2) {
            // already full; output warning
            return;
        }

        if (!selectedProvincialBoard) setSelectedProvincialBoard([provincialBoardMember])
        else setSelectedProvincialBoard([...selectedProvincialBoard ?? [], provincialBoardMember])

        db.localCandidates.add(provincialBoardMember, provincialBoardMember.id);
    }
    const removeProvincialBoardMember = (provincialBoardMember: LocalCandidate) => {
        setSelectedProvincialBoard(selectedProvincialBoard?.filter(pb => pb.ballot_name !== provincialBoardMember.ballot_name));
        db.localCandidates.delete(provincialBoardMember.id);
    }

    const retrievePreviouslySetCandidates = async () => {
        const mayor = await db.localCandidates.where("position").equals("MAYOR").first()
        if (mayor) setSelectedMayor(mayor);
        const viceMayor = await db.localCandidates.where("position").equals("VICE-MAYOR").first()
        if (viceMayor) setSelectedViceMayor(viceMayor);
        const governor = await db.localCandidates.where("position").equals("GOVERNOR").first()
        if (governor) setSelectedGovernor(governor);
        const viceGovernor = await db.localCandidates.where("position").equals("VICE-GOVERNOR").first()
        if (viceGovernor) setSelectedViceGovernor(viceGovernor);
        const representative = await db.localCandidates.where("position").equals("REPRESENTATIVE").first()
        if (representative) setSelectedRepresentative(representative);
        const councilors = await db.localCandidates.where("position").equals("COUNCILOR");
        setSelectedCouncilors((await councilors.toArray()));
        const provincialBoardMembers = await db.localCandidates.where("position").equals("PROVINCIAL_COUNCIL").toArray();
        setSelectedProvincialBoard(provincialBoardMembers)
    }

    useEffect(() => {
        const r = localStorage.getItem("region");
        const p = localStorage.getItem("province");
        const l = localStorage.getItem("lgu")
        const ldisStr = localStorage.getItem("legislativeDistrict");
        const pdisStr = localStorage.getItem("provincialDistrict");
        const cdisStr = localStorage.getItem("councilorDistrict");
        const hasLocalRep = localStorage.getItem("hasLocalRepresentatives");
        const pldc = localStorage.getItem("provinceLegislativeDistrictCount");
        const ldc = localStorage.getItem("legislativeDistrictCount");
        const cdc = localStorage.getItem("councilorDistrictCount");

        if (!r || !(p || r === "NCR") || !l || !ldisStr || !hasLocalRep) {
            setLocationModalOpen(true);
            return;
        }
        
        let pd,cd,ld, legislativeDistrictCount, provinceDistrictCount, councilorDistrictCt;
        try {
            if (pdisStr) pd = parseInt(pdisStr);
            if (cdisStr) cd = parseInt(cdisStr);
            if (ldisStr) ld = parseInt(ldisStr);        // console.log(pldc);
            // console.log(ldc);
            console.log(cdc);
            console.log(lgu !== undefined);
            // &
            console.log(councilorDistrict !== undefined);
            if (ldc) legislativeDistrictCount = parseInt(ldc);
            if (pldc) provinceDistrictCount = parseInt(pldc);
            if (cdc) councilorDistrictCt = parseInt(cdc);
        } catch {
            // re-set info
            setLocationModalOpen(true);
            return;
        }

        setRegion(r);
        setRegionSelected(true);
        locationForm.setValue("region", r);
        if (r !== "NCR") {
            retrieveProvinces(r);
            setProvinceSelected(true);
        }
        else {
            retrieveNCRCities();
            setIsNcrPicked(true);
            
        }
        setProvince(p ?? undefined);
        if (p) {
            retrieveLGUs(p);
            locationForm.setValue("province", p);
        }
        setLgu(l);
        setNewLgu(l);
        setLguSelected(true);
        locationForm.setValue("lgu", l);
        if (pd) {
            setProvincialDistrict(pd);
            locationForm.setValue("provincialDistrict", pd);
        }
        
        setCouncilorDistrict(cd);
        locationForm.setValue("councilorDistrict", cd ?? 1);

        setCouncilorDistrictCount(councilorDistrictCt);
        setLegislativeDistrict(ld);
        locationForm.setValue("legislativeDistrict", ld ?? 1);
        
        setHasLocalRepresentatives(hasLocalRep === "true")
        if (hasLocalRep) {
            setHasLocalRepresentatives(true);
            setLegislativeDistrictCount(legislativeDistrictCount ?? 1);
        } else {
            setHasLocalRepresentatives(false);
            setProvinceDistrictCount(legislativeDistrict ?? 1);
        }
        // if (legislativeDistrictCount === 0) {
        //     setHasLocalRepresentatives(false);
        //     setProvinceLegislativeDistrictCount()
        // } else {
        //     setHasLocalRepresentatives(true);
        // }
        // setLegislativeDistrictCount(legislativeDistrictCount ?? 0);
        
        // retrieve candidates
        retrieveCandidates(r, p, l, ld?.toString() ?? "1", pdisStr ?? undefined, cdisStr ?? "");
        
        // retrieve previously set
        retrievePreviouslySetCandidates()

        setProvinceDistrictCount(provinceDistrictCount);
        // close location modal
        setIsLocationSet(true);
        setLocationModalOpen(false);
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-center py-12">
            <div className="w-5/6 md:w-4/5 lg:w-1/2 xl:w-2/5 2xl:w-1/3">
                <h1 className="text-4xl text-justify">Local Candidates</h1>
                    <>
                    {
                        isLocationSet && (
                            <h2 className="opacity-70 mb-4">Region {region} - {region !== "NCR" ? `${province} - ` : ""} {lgu}</h2>
                        )
                    }
                    {
                        isListRendered ?
                        <>
                            {
                                province && (
                                    <>
                                        <div>
                                        <div className="flex justify-between items-end">
                                            <h2 className="text-2xl">Governor</h2>
                                                <span className="text-sm opacity-60">Vote 1</span>
                                            </div>
                                            <div className="flex flex-col gap-2 mt-3">
                                                {
                                                    governors.map((g) => (
                                                        <CandidateRow
                                                            key={g.id}
                                                            add={selectGovernor} 
                                                            remove={removeGovernor}
                                                            details={g}
                                                            isSelected={selectedGovernor != undefined && selectedGovernor?.ballot_name === g.ballot_name}
                                                        />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-end mt-6">
                                                <h2 className="text-2xl">Vice-Governor</h2>
                                                <span className="text-sm opacity-60">Vote 1</span>
                                            </div>
                                            <div className="flex flex-col gap-2 mt-3">
                                                {
                                                    viceGovernors.map((vg) => (
                                                        <CandidateRow
                                                            key={vg.id}
                                                            add={selectViceGovernor} 
                                                            remove={removeViceGovernor}
                                                            details={vg}
                                                            isSelected={selectedViceGovernor != undefined && selectedViceGovernor?.ballot_name === vg.ballot_name}
                                                        />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                            <div>
                                <div className="flex justify-between items-end mt-6">
                                    <h2 className="text-2xl">Mayor</h2>
                                    <span className="text-sm opacity-60">Vote 1</span>
                                </div>
                                <div className="flex flex-col gap-2 mt-3">
                                    {
                                        mayors.map((m) => (
                                            <CandidateRow
                                                key={m.id}
                                                add={selectMayor} 
                                                remove={removeMayor}
                                                details={m}
                                                isSelected={selectedMayor != undefined && selectedMayor?.ballot_name === m.ballot_name}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mt-6">
                                    <h2 className="text-2xl">Vice-Mayor</h2>
                                    <span className="text-sm opacity-60">Vote 1</span>
                                </div>
                                <div className="flex flex-col gap-2 mt-3">
                                    {
                                        viceMayors.map((vm) => (
                                            <CandidateRow
                                                key={vm.id}
                                                add={selectViceMayor} 
                                                remove={removeViceMayor}
                                                details={vm}
                                                isSelected={selectedViceMayor != undefined && selectedViceMayor?.ballot_name === vm.ballot_name}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mt-6">
                                    <h2 className="text-2xl">Representative</h2>
                                    <span className="text-sm opacity-60">Vote 1</span>
                                </div>
                                <div className="flex flex-col gap-2 mt-3">
                                {
                                    representatives.map((rm) => (
                                        <CandidateRow
                                            key={rm.id}
                                            add={selectRepresentative} 
                                            remove={removeRepresentative}
                                            details={rm}
                                            isSelected={selectedRepresentative != undefined && selectedRepresentative?.ballot_name === rm.ballot_name}
                                        />
                                    ))
                                }
                                </div>
                            </div>
                            {
                            province && (
                                    <div>
                                        <div className="flex justify-between items-end mt-6">
                                            <h2 className="text-2xl">Provincial Board</h2>
                                            <span className="text-sm opacity-60">Vote 2</span>
                                        </div>
                                        <div className="flex flex-col gap-2 mt-3">
                                            {
                                                provincialBoard && provincialBoard.map((vm) => (
                                                    <CandidateRow
                                                        key={vm.id}
                                                        add={selectProvincialBoardMember} 
                                                        remove={removeProvincialBoardMember}
                                                        details={vm}
                                                        isSelected={selectedProvincialBoard != undefined && selectedProvincialBoard.filter(pb => pb.ballot_name === vm.ballot_name).length !== 0}
                                                    />
                                                ))
                                            }
                                        </div>
                                    </div>
                                )
                            }
                            <div>
                                <div className="flex justify-between items-end mt-6">
                                    <h2 className="text-2xl">Councilors</h2>
                                    <span className="text-sm opacity-60">Vote 6</span>
                                </div>
                                <div className="flex flex-col gap-2 mt-3">
                                    {
                                        councilors.map((c) => (
                                            <CandidateRow
                                                key={c.id}
                                                add={selectCouncilor} 
                                                remove={removeCouncilor}
                                                details={c}
                                                isSelected={selectedCouncilors.filter((sc) => sc.ballot_name === c.ballot_name).length !== 0}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        </>
                        :
                        (
                        <div className="flex flex-col items-center justify-center w-full h-[10vh]">
                            <LoadingSpinner className="size-12"></LoadingSpinner>
                        </div>
                        )
                    }
                <Dialog defaultOpen={isLocationModalOpen} open={isLocationModalOpen} onOpenChange={(open) => setLocationModalOpen(open)}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setLocationModalOpen(true)} className="text-lg !w-full mt-10">Change Location</Button>
                        </DialogTrigger>
                        <DialogContent  className="w-11/12">
                            <DialogTitle>Select your location</DialogTitle>
                                <Form {...locationForm}>
                                    <form onSubmit={locationForm.handleSubmit(onSubmit)}>
                                        <FormField 
                                            control={locationForm.control}
                                            name="region"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Region</FormLabel>
                                                    <Select 
                                                    onValueChange={(val) => {
                                                        field.onChange(val);
                                                        locationForm.setValue("region", val);
                                                        onRegionChange(val);
                                                    }} defaultValue={region ?? undefined}>
                                                        <FormControl className="">
                                                            <SelectTrigger className="w-full overflow-x-hidden">
                                                                <SelectValue placeholder="Select Region"/>
                                                            </SelectTrigger>    
                                                        </FormControl>
                                                        <SelectContent>
                                                            {
                                                                regions.map((r) => (
                                                                    <SelectItem key={r.code} value={r.code}>{r.name}</SelectItem>
                                                                ))
                                                            }
                                                        </SelectContent>
                                                    </Select>    
                                                </FormItem>
                                            )}
                                        ></FormField>
                                        <FormField control={locationForm.control}
                                            name="province"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Province</FormLabel>
                                                    <Select  onValueChange={(val) => {
                                                        field.onChange(val);
                                                        locationForm.setValue("province", val);
                                                        onProvinceChange(val);
                                                    }} defaultValue={province ?? undefined} disabled={!regionSelected || isNcrPicked}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full ">
                                                                <SelectValue placeholder="Select Province"/>
                                                            </SelectTrigger>    
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    provincesList.map((r) => (
                                                                        <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                                                                    ))
                                                                }
                                                            </SelectContent>
                                                    </Select>    
                                                </FormItem>
                                            )}
                                        ></FormField>
                                        <FormField control={locationForm.control}
                                            name="lgu"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>City or Municipality</FormLabel>
                                                    <Select  onValueChange={(val) => {
                                                        field.onChange(val);
                                                        locationForm.setValue("lgu", val);
                                                        onLGUChange(val);
                                                    }} defaultValue={lgu ?? undefined}  disabled={!provinceSelected && !isNcrPicked}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full ">
                                                                <SelectValue placeholder="Select City or Municipality"/>
                                                            </SelectTrigger>    
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    lgus && lgus.lgus.map((r) => (
                                                                        <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                                                                    ))
                                                                }
                                                            </SelectContent>
                                                    </Select>    
                                                </FormItem>
                                            )}
                                        ></FormField>
                                        <FormField control={locationForm.control}
                                            name="legislativeDistrict"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>{hasLocalRepresentatives ? "Legislative District (Local)" : "Legislative District " + `(Provincial)`}</FormLabel>
                                                    <Select  onValueChange={(val) => {
                                                        field.onChange(parseInt(val));
                                                        locationForm.setValue("legislativeDistrict", parseInt(val));
                                                        setLegislativeDistrict(parseInt(val))
                                                    }} defaultValue={lgu !== undefined && legislativeDistrict !== undefined ? legislativeDistrict.toString() : undefined} disabled={!lguSelected}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full ">
                                                                <SelectValue placeholder="Select City or Municipality"/>
                                                            </SelectTrigger>    
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    !newLgu ?
                                                                        <></>
                                                                        :
                                                                        hasLocalRepresentatives === true ?
                                                                        Array.from(Array(legislativeDistrictCount).keys()).map((num) => {
                                                                            console.log(num+1);
                                                                            const treatedNum = num+1;
                                                                                return (
                                                                                <SelectItem key={treatedNum} value={treatedNum.toString()}>{treatedNum}</SelectItem>
                                                                            );
                                                                        })
                                                                        :
                                                                        Array.from(Array(provinceLegislativeDistrictCount).keys()).map((num) => {
                                                                            const treatedNum = num+1;
                                                                            return (
                                                                                <SelectItem key={treatedNum} value={treatedNum.toString()}>{treatedNum}</SelectItem>
                                                                            );
                                                                        })
                                                                }
                                                            </SelectContent>
                                                    </Select>    
                                                </FormItem>
                                            )}
                                        ></FormField>
                                        <FormField control={locationForm.control}
                                            name="provincialDistrict"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Provincial District (Board)</FormLabel>
                                                    <Select  onValueChange={(val) => {
                                                        field.onChange(parseInt(val));
                                                        locationForm.setValue("provincialDistrict", parseInt(val));
                                                        setProvincialDistrict(parseInt(val))
                                                    }} defaultValue={lgu !== undefined && provincialDistrict !== undefined ? provincialDistrict.toString() : undefined} disabled={!lguSelected || (isNcrPicked)}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full ">
                                                                <SelectValue placeholder="Select City or Municipality"/>
                                                            </SelectTrigger>    
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    !newLgu ?
                                                                        <></>
                                                                        :
                                                                        Array.from(Array(provinceDistrictCount).keys()).map((num) => {
                                                                            const treatedNum = num+1;
                                                                            return (
                                                                                <SelectItem key={treatedNum} value={treatedNum.toString()}>{treatedNum}</SelectItem>
                                                                            );
                                                                        })
                                                                    
                                                                }
                                                            </SelectContent>
                                                    </Select>    
                                                </FormItem>
                                            )}
                                        ></FormField>
                                        <FormField control={locationForm.control}
                                            name="councilorDistrict"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Councilor District</FormLabel>
                                                    <Select  onValueChange={(val) => {
                                                        field.onChange(parseInt(val));
                                                        locationForm.setValue("councilorDistrict", parseInt(val));
                                                        setCouncilorDistrict(parseInt(val))
                                                    }} defaultValue={newLgu !== undefined && councilorDistrict !== undefined ? councilorDistrict.toString() : undefined} disabled={!lguSelected}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full ">
                                                                <SelectValue placeholder="Select City or Municipality"/>
                                                            </SelectTrigger>    
                                                            </FormControl>
                                                            <SelectContent>
                                                                {
                                                                    !newLgu ?
                                                                        <></>
                                                                        :
                                                                        Array.from(Array(councilorDistrictCount).keys()).map((num) => {
                                                                            const treatedNum = num+1;
                                                                            return (
                                                                                <SelectItem key={treatedNum} value={treatedNum.toString()}>{treatedNum}</SelectItem>
                                                                            );
                                                                        })
                                                                    
                                                                }
                                                            </SelectContent>
                                                    </Select>    
                                                </FormItem>
                                            )}
                                        ></FormField>
                                        <Button type="submit" className="mt-4 w-full !bg-yellow-500 !rounded-xl">Select Location</Button>
                                    </form>
                                </Form>
                            <div>                        
                        </div>
                        </DialogContent>
                </Dialog>
                </>
            </div>
        </div>
    );
}