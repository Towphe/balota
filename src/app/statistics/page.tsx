"use client"

import Philippines from "@react-map/philippines";

export default function Page() {
    return (
        <div className="h-full flex flex-col items-center justify-center py-12">
            <div className="w-5/6 md:w-4/5 lg:w-1/2 xl:w-2/5 2xl:w-1/3">
                <h1 className="text-4xl">Statistics</h1>
                <p className="!opacity-55">Feature coming soon</p>
                <div className="py-8 w-full flex justify-center">
                    <Philippines size={350} type="select-single" onSelect={(val) => alert(`Clicked ${val}. Geoinformatics coming soon.`)}></Philippines>
                </div>
            </div>
        </div>
    )
}