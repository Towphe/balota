"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Senator, SenatorsPayload } from "@/models/senator";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form";
import { senatorFilterSchema } from "@/schema/senatorFilterSchema";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { CandidateDescription } from "@/models/candidateDescription";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Partylist, PartylistsPayload } from "@/models/partylist";

export default function Page() {
  const searchParams = useSearchParams();

  const countStr:string|number|null = searchParams.get('c') ?? "10"; // 10 by default
  const pageStr:string|number|null = searchParams.get('p') ?? "1"; // 1 by default

  const [count, setCount] = useState<number>(parseInt(countStr));
  const [page, setPage] = useState<number>(parseInt(pageStr));
  const [name, setName] = useState<string|null>(searchParams.get('f'));
  const [sortBy, setSortBy] = useState<string|null>(searchParams.get('sb') ?? "ballot_number");
  const [order, setOrder] = useState<string|null>(searchParams.get('o') ?? 'asc');
  const [partylists, setPartylists] = useState<Partylist[]>([]);
  const [totalPartylists, setTotalPartylists] = useState<number>(0);
  const [partylistBackground, setPartylistBackground] = useState<CandidateDescription|null>(null);
  const [isListRendered, toggleIsListRendered] = useState<boolean>(false);
  const [isPartylistBackgroundRendered, setIsPartylistBackgroundRendered] = useState<boolean>(false);

  const filterForm = useForm<z.infer<typeof senatorFilterSchema>>({
    resolver: zodResolver(senatorFilterSchema),
    defaultValues: {
      page: page,
      count: count,
      name: name ?? "",
      order: order ?? "asc",
      sortBy: sortBy ?? "ballot_number"
    }
  });

  function onSubmit(values:z.infer<typeof senatorFilterSchema>){
    setPage(1);
    setCount(10);
    setSortBy(values.sortBy);
    setOrder(values.order);
    setName(values.name ?? null);
    toggleIsListRendered(false);
  }

  const retrievePartylists = async () => {
    const req = await fetch(`/api/partylists?p=${page}&${count}=10&o=${order}&sb=${sortBy}${name !== null ? "&f=" + name : ""}`)
    const data:PartylistsPayload = await req.json();
    setPartylists(data.partylists);
    setTotalPartylists(data.total);
    toggleIsListRendered(true);
  }

  const retrievePartylistBackground = async (id:string) => {
    setPartylistBackground(null);

    const req = await fetch(`/api/partylists/${id}/background`);
    
    if (!req.ok) {
      // handle 
      setIsPartylistBackgroundRendered(true);
      return;
    }

    const data:CandidateDescription = await req.json();

    setPartylistBackground(data);

    setIsPartylistBackgroundRendered(true);
    return;
  }

  useEffect(() => {
    retrievePartylists();
  }, [page, order, sortBy, order, name])

  return (
    <div className="h-full flex flex-col items-center justify-center py-12">
        <div className="w-5/6 md:w-4/5 lg:w-1/2 xl:w-2/5 2xl:w-1/3">
          <h1 className="text-4xl w-full text-start">Partylists</h1>
          <Form {...filterForm}>
            <form onSubmit={filterForm.handleSubmit(onSubmit)} className="w-full">
              <div className="flex justify-between">
                <FormField
                  control={filterForm.control}
                  name="name"
                  render={({field})=>(
                    <FormItem className="w-10/12">
                      <FormControl>
                        <Input type="text" placeholder="Search Partylists"  {...field} />
                      </FormControl>
                    </FormItem>)
                  }
                  >
                </FormField>
                <Button type="submit" className="w-[15%]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
              <div className="flex justify-between">
                <div className="w-[48%]">
                  <span className="text-xs opacity-60">Sort by</span>
                  <FormField
                  control={filterForm.control}
                  name="sortBy"
                  render={({field})=>(
                    <FormItem className="w-full">
                    <Select  onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sort by"/>
                          </SelectTrigger>    
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ballot_number">Ballot Number</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="ballot_name">Ballot Name</SelectItem>
                        </SelectContent>
                    </Select>    
                  </FormItem>)
                  }
                  >
                </FormField>
                </div>
                <div className="w-[48%]">
                  <span className="text-xs opacity-60">Order</span>
                  <FormField
                  control={filterForm.control}
                  name="order"
                  render={({field})=>(
                    <FormItem className="w-full">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Order"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="asc">Ascending</SelectItem>
                          <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                    </Select>    
                  </FormItem>)
                  }
                  >
                </FormField>
                </div>
              </div>
            </form>
          </Form>
          {
                !isListRendered ? 
                <div className="flex flex-col items-center justify-center w-full h-[30vh]">
                  <LoadingSpinner className="size-12"></LoadingSpinner>
                </div> :
                <>
                <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Ballot #</TableHead>
                  <TableHead>Name on Ballot</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  partylists.map((partylist) => (
                    <TableRow key={partylist.id}>
                      <TableCell>{partylist.ballot_number}</TableCell>
                      <Dialog onOpenChange={(open) => {
                        if (!open) {
                          setIsPartylistBackgroundRendered(false);
                        }
                      }}>
                        <DialogTrigger onClick={() => retrievePartylistBackground(partylist.id)} asChild>
                          <TableCell  className="text-blue-500 hover:cursor-pointer">{partylist.ballot_name}</TableCell>
                        </DialogTrigger>
                        <DialogContent className="w-11/12">
                          <DialogTitle>{partylist.ballot_name} - #{partylist.ballot_number}</DialogTitle>
                          <DialogDescription>{partylist.name}</DialogDescription>
                          {
                            !isPartylistBackgroundRendered ?
                              <div className="flex flex-col items-center justify-center w-full h-[10vh]">
                                <LoadingSpinner className="size-12"></LoadingSpinner>
                              </div> :
                              (
                              <>
                              <div className="flex flex-col items-center gap-1.5 text-[0.85rem] w-full">
                                <h3 className="font-semibold opacity-90 w-full">Background</h3>
                                {
                                  partylistBackground && (
                                    <p>{partylistBackground.summary}</p>
                                  )
                                }
                                {
                                  !partylistBackground && (
                                    <p>No relevant information found.</p>
                                  )
                                }
                              </div>
                              <Accordion type="single" collapsible className="w-full overflow-x-hidden">
                              <AccordionItem value="sources">
                                <AccordionTrigger>Sources</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-1.5 !w-max-full">
                                {
                                  !setIsPartylistBackgroundRendered ?
                                  <div className="flex flex-col items-center justify-center py-6">
                                    <LoadingSpinner className="size-12"></LoadingSpinner>
                                  </div> :
                                  (<>
                                    {
                                    partylistBackground && (
                                      partylistBackground.sources.map((source,i) => (
                                        <p key={i}>{source}</p>
                                      ))
                                    )
                                    }
                                    {
                                      !partylistBackground && (
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
                          <Button className="!rounded-xl !bg-yellow-500 hover:opacity-80 hover:cursor-pointer">Iboto!</Button>
                          {/* generate description using ai */}
                        </DialogContent>
                      </Dialog>
                      <TableCell>
                        <Button className="!bg-yellow-500 !rounded-xl">Iboto!</Button>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink href={`/partylists?p=${page === 1 ? 1 : page-1}`} isActive={page === 1}>
                  {page === 1 ? 1 : page-1}
                </PaginationLink>
              </PaginationItem>
              {
                totalPartylists <= count ?
                <></> :
                <PaginationItem>
                  <PaginationLink href={`/partylists?p=${page === 1 ? 2 : page}`} isActive={page !== 1}>
                    {page === 1 ? 2 : page}
                  </PaginationLink>
                </PaginationItem>
              }
              {
                page > totalPartylists/count ? <></> :
                <PaginationItem>
                  <PaginationLink href={`/partylists?p=${page === 1 ? 3 : page + 1}`} isActive={page > totalPartylists/count}>
                    {page === 1 ? 3 : page + 1}
                  </PaginationLink>
                </PaginationItem>
              }
              
            </PaginationContent>
          </Pagination>
            </>
          }
          
          
        </div>
    </div>);
}