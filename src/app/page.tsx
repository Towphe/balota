import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full flex items-center justify-center gap-8">
      <img src="/balota-logo.png" className="size-0 sm:size-32 md:size-48"></img>
      <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-5xl">Balota</h1>
      <p className="opacity-50 mb-2">Helping voters, one ballot at a time</p>
      <div className="flex items-center justify-center">
      </div>
          <div className="flex flex-col items-center gap-2">
            <Link href="/balota" className="">
              <Button className="w-[13rem] rounded-xl bg-[#1357BE] hover:bg-[#1357BE] hover:opacity-85 !py-1">Generate Ballot</Button>
            </Link>
            <Link href="/voters-education">
              <Button className="w-[13rem] rounded-xl bg-yellow-500 hover:bg-yellow-500 hover:opacity-85 !py-1">Voter&apos;s Education</Button>
            </Link>
          </div>
      </div>
    </div>
  );
}
