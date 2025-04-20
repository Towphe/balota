// "use client"

// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import {z} from "zod";
// import {zodResolver} from "@hookform/resolvers/zod"
// import {useForm} from "react-hook-form";
// import { senatorFilterSchema } from "@/schema/senatorFilterSchema";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
// import { CandidateDescription } from "@/models/candidateDescription";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { LoadingSpinner } from "@/components/LoadingSpinner";
// // import { Partylist, PartylistsPayload } from "@/models/partylist";
// import { db } from "../../../db/db.model";
// import Link from "next/link";

// export default function Page() {
//   const searchParams = useSearchParams();

//   const countStr:string|number|null = searchParams.get('c') ?? "10"; // 10 by default
//   const pageStr:string|number|null = searchParams.get('p') ?? "1"; // 1 by default

//   const [count, setCount] = useState<number>(parseInt(countStr));
//   const [page, setPage] = useState<number>(parseInt(pageStr));
//   const [name, setName] = useState<string|null>(searchParams.get('f'));
//   const [sortBy, setSortBy] = useState<string|null>(searchParams.get('sb') ?? "ballot_number");
//   const [order, setOrder] = useState<string|null>(searchParams.get('o') ?? 'asc');
//   const [partylists, setPartylists] = useState<Partylist[]>([]);
//   const [totalPartylists, setTotalPartylists] = useState<number>(0);
//   const [partylistBackground, setPartylistBackground] = useState<CandidateDescription|null>(null);
//   const [isListRendered, toggleIsListRendered] = useState<boolean>(false);
//   const [isPartylistBackgroundRendered, setIsPartylistBackgroundRendered] = useState<boolean>(false);
//   const [selectedPartylist, setSelectedPartylist] = useState<Partylist|null>(null);
//   const [isConfirmPartylistOpen, setIsConfirmPartylistOpen] = useState<boolean>(false);
//   const [newlySelectedPartylist, setNewlySelectedPartylist] = useState<Partylist|null>(null);
//   const filterForm = useForm<z.infer<typeof senatorFilterSchema>>({
//     resolver: zodResolver(senatorFilterSchema),
//     defaultValues: {
//       page: page,
//       count: count,
//       name: name ?? "",
//       order: order ?? "asc",
//       sortBy: sortBy ?? "ballot_number"
//     }
//   });

//   function onSubmit(values:z.infer<typeof senatorFilterSchema>){
//     setPage(1);
//     setCount(10);
//     setSortBy(values.sortBy);
//     setOrder(values.order);
//     setName(values.name ?? null);
//     toggleIsListRendered(false);
//   }

//   const retrievePartylists = async () => {
//     const req = await fetch(`/api/partylists?p=${page}&${count}=10&o=${order}&sb=${sortBy}${name !== null ? "&f=" + name : ""}`)
//     const data:PartylistsPayload = await req.json();
//     setPartylists(data.partylists);
//     setTotalPartylists(data.total);
//     toggleIsListRendered(true);
//   }

//   const retrievePartylistBackground = async (id:string) => {
//     setPartylistBackground(null);

//     const req = await fetch(`/api/partylists/${id}/background`);
    
//     if (!req.ok) {
//       // handle 
//       setIsPartylistBackgroundRendered(true);
//       return;
//     }

//     const data:CandidateDescription = await req.json();

//     setPartylistBackground(data);

//     setIsPartylistBackgroundRendered(true);
//     return;
//   }

//   const setPartylist = async (partylist:Partylist) => {
//     // check if there's already a partylist
//     const count = await db.partylists.count();
    
//     if (count > 0) {
//       // partylist already selected
//       // render notification that says you've already selected your partylist
//       // const instance = await db.partylists.limit(1).first();
//       setNewlySelectedPartylist(partylist);
//       setIsConfirmPartylistOpen(true);
//       return;
//     }

//     setSelectedPartylist(partylist);
//     db.partylists.add(partylist, partylist.id);
//   }

//   const unsetPartylist = async () => {
//     // check if there's already a partylist
//     const count = await db.partylists.count();

//     if (!selectedPartylist) {
//       return;
//     }
    
//     if (count === 0) {
//       // partylist already deleted
//       return;
//     }

//     db.partylists.delete(selectedPartylist.id);
//     setSelectedPartylist(null);
//   }

//   const replacePartylist = async () => {
//     if (!newlySelectedPartylist) {
//       return;
//     }
    
//     // unset partylist
//     await unsetPartylist();

//     // set new partylist
//     setPartylist(newlySelectedPartylist);

//     setNewlySelectedPartylist(null);
//     setIsConfirmPartylistOpen(false);
//   }

//   useEffect(() => {
//     retrievePartylists();
//   }, [page, order, sortBy, order, name])

//   useEffect(() => {
//     const retrieveSavedPartylist = async () => {
//       const partylistSelected = await db.partylists.limit(1).first();
//       setSelectedPartylist(partylistSelected ?? null);
//     }

//     retrieveSavedPartylist();
//   }, []);

//   return (
//     <div className="h-full flex flex-col items-center justify-center">
//         <div className="w-5/6 md:w-4/5 lg:w-1/2 xl:w-2/5 2xl:w-1/3">
//           <h1 className="text-4xl w-full text-start">Partylists</h1>
//           <Form {...filterForm}>
//             <form onSubmit={filterForm.handleSubmit(onSubmit)} className="w-full">
//               <div className="flex justify-between">
//                 <FormField
//                   control={filterForm.control}
//                   name="name"
//                   render={({field})=>(
//                     <FormItem className="w-10/12">
//                       <FormControl>
//                         <Input type="text" placeholder="Search Partylists"  {...field} />
//                       </FormControl>
//                     </FormItem>)
//                   }
//                   >
//                 </FormField>
//                 <Button type="submit" className="w-[15%]">
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
//                     <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
//                   </svg>
//                 </Button>
//               </div>
//               <div className="flex justify-between">
//                 <div className="w-[48%]">
//                   <span className="text-xs opacity-60">Sort by</span>
//                   <FormField
//                   control={filterForm.control}
//                   name="sortBy"
//                   render={({field})=>(
//                     <FormItem className="w-full">
//                     <Select  onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Sort by"/>
//                           </SelectTrigger>    
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="ballot_number">Ballot Number</SelectItem>
//                           <SelectItem value="name">Name</SelectItem>
//                           <SelectItem value="ballot_name">Ballot Name</SelectItem>
//                         </SelectContent>
//                     </Select>    
//                   </FormItem>)
//                   }
//                   >
//                 </FormField>
//                 </div>
//                 <div className="w-[48%]">
//                   <span className="text-xs opacity-60">Order</span>
//                   <FormField
//                   control={filterForm.control}
//                   name="order"
//                   render={({field})=>(
//                     <FormItem className="w-full">
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Order"/>
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="asc">Ascending</SelectItem>
//                           <SelectItem value="desc">Descending</SelectItem>
//                         </SelectContent>
//                     </Select>    
//                   </FormItem>)
//                   }
//                   >
//                 </FormField>
//                 </div>
//               </div>
//             </form>
//           </Form>
//           {
//                 !isListRendered ? 
//                 <div className="flex flex-col items-center justify-center w-full h-[30vh]">
//                   <LoadingSpinner className="size-12"></LoadingSpinner>
//                 </div> :
//                 <>
//                 <Table className="mt-4">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Ballot #</TableHead>
//                   <TableHead>Name on Ballot</TableHead>
//                   <TableHead></TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {
//                   partylists.map((partylist) => (
//                     <TableRow key={partylist.id}>
//                       <TableCell>{partylist.ballot_number}</TableCell>
//                       <Dialog onOpenChange={(open) => {
//                         if (!open) {
//                           setIsPartylistBackgroundRendered(false);
//                         }
//                       }}>
//                         <DialogTrigger onClick={() => retrievePartylistBackground(partylist.id)} asChild>
//                           <TableCell  className="text-blue-500 hover:cursor-pointer">{partylist.ballot_name}</TableCell>
//                         </DialogTrigger>
//                         <DialogContent className="w-11/12">
//                           <DialogTitle>{partylist.ballot_name} - #{partylist.ballot_number}</DialogTitle>
//                           <DialogDescription>{partylist.name}</DialogDescription>
//                           {
//                             !isPartylistBackgroundRendered ?
//                               <div className="flex flex-col items-center justify-center w-full h-[10vh]">
//                                 <LoadingSpinner className="size-12"></LoadingSpinner>
//                               </div> :
//                               (
//                               <>
//                               <div className="flex flex-col items-center gap-1.5 text-[0.85rem] w-full">
//                                 <h3 className="font-semibold opacity-90 w-full">Background</h3>
//                                 {
//                                   partylistBackground && (
//                                     <p>{partylistBackground.summary}</p>
//                                   )
//                                 }
//                                 {
//                                   !partylistBackground && (
//                                     <p>No relevant information found.</p>
//                                   )
//                                 }
//                               </div>
//                               <Accordion type="single" collapsible className="w-full overflow-x-hidden">
                                

//                               <AccordionItem value="career">
//                                 <AccordionTrigger>Nominees</AccordionTrigger>
//                                                                               <AccordionContent className="flex flex-col gap-1.5 !w-max-full">
//                                                                               {
//                                                                                   !isPartylistBackgroundRendered ?
//                                                                                       <div className="flex flex-col items-center justify-center py-6">
//                                                                                           <LoadingSpinner className="size-12"></LoadingSpinner>
//                                                                                       </div> :
//                                                                                       (<>
//                                                                                       {
//                                                                                           partylistBackground?.nominees && (
//                                                                                           partylistBackground?.nominees.map((nominee,i) => (
//                                                                                                       <p key={i}>{nominee}</p>
//                                                                                                   ))
//                                                                                               )
//                                                                                       }
//                                                                                       {
//                                                                                       !partylistBackground?.nominees && (
//                                                                                           <p>Unable to get information on partylist nominees.</p>
//                                                                                           )
//                                                                                       }
//                                                                                       </>)
//                                     }
//                                   </AccordionContent>
//                                 </AccordionItem>
//                               <AccordionItem value="sources">
//                                 <AccordionTrigger>Sources</AccordionTrigger>
//                                 <AccordionContent className="flex flex-col gap-1.5 !w-max-full">
//                                 {
//                                   !setIsPartylistBackgroundRendered ?
//                                   <div className="flex flex-col items-center justify-center py-6">
//                                     <LoadingSpinner className="size-12"></LoadingSpinner>
//                                   </div> :
//                                   (<>
//                                     {
//                                     partylistBackground && (
//                                       partylistBackground.sources.map((source,i) => (
//                                         <p key={i}>{source}</p>
//                                       ))
//                                     )
//                                     }
//                                     {
//                                       !partylistBackground && (
//                                         <p>No relevant sources found.</p>
//                                       )
//                                     }
//                                     <p className="text-sm text-gray-800 "><span className="font-bold">Note:</span> some links may be archived.</p>
//                                   </>)
//                                 }
                                
//                                       </AccordionContent>
//                                     </AccordionItem>
//                                     <p className="mt-4"><span className="font-bold">NOTE:</span> Summaries are generated AI-Generated (by ChatGPT). A much more accurate summary-generation system is currently in the works. For now, kindly <span className="text-bold">cross-check</span> all info.</p>
//                                 </Accordion>
//                               </>
//                               )
//                           }
//                           {
//                             partylist.id !== selectedPartylist?.id ?
//                             <Button onClick={() => setPartylist(partylist)} className="!rounded-xl !bg-yellow-500 hover:opacity-80 hover:cursor-pointer">Iboto!</Button> :
//                             <Button onClick={() => unsetPartylist()} className="!rounded-xl !bg-white !border-red-600 border-2 !text-red-600 hover:opacity-80 hover:cursor-pointer">Remove vote</Button>
//                           }
                          
//                           {/* generate description using ai */}
//                         </DialogContent>
//                       </Dialog>
//                       <TableCell>
//                         {
//                           partylist.id !== selectedPartylist?.id ? <Button onClick={() => setPartylist(partylist)} className="!bg-yellow-500 !rounded-xl px-6">Iboto!</Button> :
//                           <Button onClick={() => unsetPartylist()} className="!rounded-xl !bg-white !border-red-600 border-2 !text-red-600 hover:opacity-80 hover:cursor-pointer">Remove</Button>
//                         }
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 }
//               </TableBody>
//             </Table>
//             <Pagination>
//             <PaginationContent>
//               <PaginationItem>
//                 <PaginationLink href={page != 1 ? `/partylists?p=1${sortBy && `&sb=${sortBy}`}${sortBy && `&o=${order}`}${name !== null ? `&f=${name}` : ""}` : location.href} isActive={page === 1}  className={page === 1 ? "opacity-70 hover:cursor-not-allowed" : ""}>
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
//                   </svg>
//                 </PaginationLink>
//               </PaginationItem>
//               <PaginationItem>
//                 <PaginationLink href={`/partylists?p=${page === 1 ? 1 : page-1}`} isActive={page === 1} className={page === 1 ? "font-bold" : ""}>
//                   {page === 1 ? 1 : page-1}
//                 </PaginationLink>
//               </PaginationItem>
//               {
//                 totalPartylists <= count ?
//                 <></> :
//                 <PaginationItem>
//                   <PaginationLink href={`/partylists?p=${page === 1 ? 2 : page}`} isActive={page !== 1} className={page !== 1 && page != totalPartylists/count ? "font-bold" : ""}>
//                     {page === 1 ? 2 : page}
//                   </PaginationLink>
//                 </PaginationItem>
//               }
//               {
//                 page > totalPartylists/count ? <></> :
//                 <PaginationItem>
//                   <PaginationLink href={`/partylists?p=${page === 1 ? 3 : page + 1}`} isActive={page > Math.ceil(totalPartylists/count)}>
//                     {page === 1 ? 3 : page + 1}
//                   </PaginationLink>
//                 </PaginationItem>
//               }
//             <PaginationItem>
//                 <PaginationLink href={page != Math.ceil(totalPartylists / count) ? `/partylists?p=${Math.ceil(totalPartylists/count)}${sortBy && `&sb=${sortBy}`}${sortBy && `&o=${order}`}${name !== null ? `&f=${name}` : ""}` : location.href} isActive={page === 1} className={page === Math.ceil(totalPartylists/count) ? "font-bold" : ""}>
//                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
//                   </svg>
//                 </PaginationLink>
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//             </>
//           }
//           {
//             selectedPartylist && (
//               <div className="fixed bottom-4 left-4 md:left-auto mx-auto w-11/12 md:w-4/5 lg:w-1/2 xl:w-2/5 2xl:w-1/3 bg-yellow-500 py-2 px-4 text-white flex justify-between items-center !shadow-xl !rounded-xl z-20">
//                 <p className="text-lg">Selected {selectedPartylist.ballot_name}</p>
//                 <Link href="/balota" className="font-bold">
//                   See Ballot
//                 </Link>
//               </div>
//             )
//           }
//           <Dialog open={isConfirmPartylistOpen} onOpenChange={(open) => {
//             if (!open) setIsConfirmPartylistOpen(false);
//           }}>
//             <DialogContent  className="w-11/12">
//               <DialogTitle>Change Partylist?</DialogTitle>
//               <DialogDescription>You previously selected {selectedPartylist?.ballot_name}</DialogDescription>
//               <div className="flex flex-col gap-1">
//                 <Button onClick={() => replacePartylist()} className="!rounded-xl !bg-yellow-500 hover:opacity-80 hover:cursor-pointer">Change Vote</Button>
//                 <Button onClick={() => setIsConfirmPartylistOpen(false)} className="!rounded-xl text-white bg-gray-600 hover:opacity-80 hover:cursor-pointer">Cancel</Button>
//               </div>
//             </DialogContent>
//           </Dialog>
          
//         </div>
//     </div>);
// }