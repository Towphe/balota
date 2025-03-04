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

export default function Page() {
  const searchParams = useSearchParams();

  const countStr:string|number|null = searchParams.get('c') ?? "10"; // 10 by default
  const pageStr:string|number|null = searchParams.get('p') ?? "1"; // 1 by default

  const [count, setCount] = useState<number>(parseInt(countStr));
  const [page, setPage] = useState<number>(parseInt(pageStr));
  const [name, setName] = useState<string|null>(searchParams.get('f'));
  const [sortBy, setSortBy] = useState<string|null>(searchParams.get('sb') ?? "ballot_number");
  const [order, setOrder] = useState<string|null>(searchParams.get('o') ?? 'asc');
  const [senators, setSenators] = useState<Senator[]>([]);
  const [totalSenators, setTotalSenators] = useState<number>(0);
  const [senatorBackground, setSenatorBackground] = useState<CandidateDescription|null>(null);
  const [isListRendered, toggleIsListRendered] = useState<boolean>(false);
  const [isSenatorBackgroundRendered, setIsSenatorBackgroundRendered] = useState<boolean>(false);

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

  const retrieveSenators = async () => {
    const req = await fetch(`/api/senators?p=${page}&${count}=10&o=${order}&sb=${sortBy}${name !== null ? "&f=" + name : ""}`)
    const data:SenatorsPayload = await req.json();
    setSenators(data.senators);
    setTotalSenators(data.total);
    toggleIsListRendered(true);
  }

  const retrieveSenatorBackground = async (id:string) => {
    setSenatorBackground(null);

    const req = await fetch(`/api/senators/${id}/background`);
    
    if (!req.ok) {
      // handle 
      setIsSenatorBackgroundRendered(true);
      return;
    }

    const data:CandidateDescription = await req.json();

    console.log(data)

    setSenatorBackground(data);

    setIsSenatorBackgroundRendered(true);
    return;
  }

  useEffect(() => {
    retrieveSenators();
  }, [page, order, sortBy, order, name])

  return (
    <div className="h-full flex flex-col items-center justify-center py-12">
        <div className="w-5/6 md:w-4/5 lg:w-1/2 xl:w-2/5 2xl:w-1/3">
          <h1 className="text-4xl w-full text-start">Senators</h1>
          <Form {...filterForm}>
            <form onSubmit={filterForm.handleSubmit(onSubmit)} className="w-full">
              <div className="flex justify-between">
                <FormField
                  control={filterForm.control}
                  name="name"
                  render={({field})=>(
                    <FormItem className="w-10/12">
                      <FormControl>
                        <Input type="text" placeholder="Search Senators"  {...field} />
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
                          <SelectItem value="partylist">Partylist</SelectItem>
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
                  <TableHead className="hidden md:block pt-3">Partylist</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  senators.map((senator) => (
                    <TableRow key={senator.id}>
                      <TableCell>{senator.ballot_number}</TableCell>
                      <Dialog onOpenChange={(open) => {
                        if (!open) {
                          setIsSenatorBackgroundRendered(false);
                        }
                      }}>
                        <DialogTrigger onClick={() => retrieveSenatorBackground(senator.id)} asChild>
                          <TableCell  className="text-blue-500 hover:cursor-pointer">{senator.ballot_name}</TableCell>
                        </DialogTrigger>
                        <DialogContent className="w-11/12">
                          <DialogTitle>{senator.ballot_name} - #{senator.ballot_number}</DialogTitle>
                          <DialogDescription>{senator.partylist}</DialogDescription>
                          {
                            !isSenatorBackgroundRendered ?
                              <div className="flex flex-col items-center justify-center w-full h-[10vh]">
                                <LoadingSpinner className="size-12"></LoadingSpinner>
                              </div> :
                              (
                              <>
                              <div className="flex flex-col items-center gap-1.5 text-[0.85rem] w-full">
                                <h3 className="font-semibold opacity-90 w-full">Background</h3>
                                {
                                  senatorBackground && (
                                    <p>{senatorBackground.summary}</p>
                                  )
                                }
                                {
                                  !senatorBackground && (
                                    <p>No relevant information found.</p>
                                  )
                                }
                              </div>
                              <Accordion type="single" collapsible className="w-full overflow-x-hidden">
                              <AccordionItem value="sources">
                                <AccordionTrigger>Sources</AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-1.5 !w-max-full">
                                {
                                  !isSenatorBackgroundRendered ?
                                  <div className="flex flex-col items-center justify-center py-6">
                                    <LoadingSpinner className="size-12"></LoadingSpinner>
                                  </div> :
                                  (<>
                                    {
                                    senatorBackground && (
                                      senatorBackground.sources.map((source,i) => (
                                        <p key={i}>{source}</p>
                                      ))
                                    )
                                    }
                                    {
                                      !senatorBackground && (
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
                      <TableCell className="hidden md:flex pt-4">{senator.partylist}</TableCell>
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
                <PaginationLink href={`/senators?p=${page === 1 ? 1 : page-1}`} isActive={page === 1}>
                  {page === 1 ? 1 : page-1}
                </PaginationLink>
              </PaginationItem>
              {
                totalSenators <= count ?
                <></> :
                <PaginationItem>
                  <PaginationLink href={`/senators?p=${page === 1 ? 2 : page}`} isActive={page !== 1}>
                    {page === 1 ? 2 : page}
                  </PaginationLink>
                </PaginationItem>
              }
              {
                page > totalSenators/count ? <></> :
                <PaginationItem>
                  <PaginationLink href={`/senators?p=${page === 1 ? 3 : page + 1}`} isActive={page > totalSenators/count}>
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