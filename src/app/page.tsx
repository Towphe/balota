import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
            <Link href="/balota">
              <Button className="w-[13rem] rounded-xl bg-[#1357BE] !py-1">Generate Ballot</Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-[13rem] rounded-xl bg-white text-black !py-1 shadow-md focus:bg-white">View Candidates</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[13rem]">
                <DropdownMenuLabel>Position</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/senators" className="!w-full">
                    Senators
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/partylists" className="!w-full">
                    Partylist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/local-candidates" className="!w-full">
                    Local Positions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/" className="!w-full">
                    Bangsamoro <span className="text-xs opacity-60">(coming soon)</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/voters-education">
              <Button className="w-[13rem] rounded-xl bg-yellow-500 !py-1">Voter&apos;s Education</Button>
            </Link>
          </div>
      </div>
    </div>
  );
}
