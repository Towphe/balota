

export default function Page() {
    return (
        <div className="h-full flex flex-col items-center justify-center py-12">
            <div className="w-5/6 md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3">
                <h1 className="text-4xl text-justify">Voter&apos;s Education</h1>
            </div>
            <div id="table-of-contents" className="w-5/6 md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3 mt-4">
                <h2 className="text-xl font-medium mb-2">Table of Contents</h2>
                <ul className="list-disc ml-6">
                    <li>
                        <a href="#who-to-vote-for" className="text-blue-500 ">What positions to vote for?</a>
                    </li>
                    <li>
                        <a href="#candidate-responsibilities" className="text-blue-500 ">What are the responsibilities of each position?</a>
                    </li>
                    <ul className="list-disc ml-6">
                        <li>
                            <a href="#senators-responsibilities" className="text-blue-500">Senator Responsibilities</a>
                        </li>
                        <li>
                            <a href="#partylists-responsibilities" className="text-blue-500">Partylist Responsibilities</a>
                        </li>
                        <li>
                            <a href="#representative-responsibilities" className="text-blue-500">Representative Responsibilities</a>
                        </li>
                        <li>
                            <a href="#governor-responsibilities" className="text-blue-500">Governor Responsibilities</a>
                        </li>
                        <li>
                            <a href="#vice-governor-responsibilities" className="text-blue-500">Vice Governor Responsibilities</a>
                        </li>
                        <li>
                            <a href="#provincial-board-responsibilities" className="text-blue-500">Provincial Board Member Responsibilities</a>
                        </li>
                        <li>
                            <a href="#mayor-responsibilities" className="text-blue-500">Mayor Responsibilities</a>
                        </li>
                        <li>
                            <a href="#vice-mayor-responsibilities" className="text-blue-500">Vice Mayor Responsibilities</a>
                        </li>
                        <li>
                            <a href="#councilor-responsibilities" className="text-blue-500">Councilor Responsibilities</a>
                        </li>
                    </ul>
                    <li>
                        <a href="#where-to-vote"  className="text-blue-500 ">Where do I vote?</a>
                    </li>
                    <li>
                        <a href="#when-to-vote"  className="text-blue-500 ">When do I vote?</a>
                    </li>
                    <li>
                        <a href="#what-to-bring"  className="text-blue-500 ">What to bring?</a>
                    </li>
                </ul>
            </div>
            <div id="who-to-vote-for" className="w-5/6 md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3 mt-4">
                <h2 className="text-xl font-medium mb-2">Who are we supposed to vote for?</h2>
                <p className="mb-1">For the May 2025 Philippine Elections, you are to vote for the following positions.</p>
                <h3>National Positions</h3>
                <ul className="list-disc list-inside pl-4">
                    <li>Senators (12 seats)</li>
                    <li>Partylist (1 seat)</li>
                    <li>Representative (1 seat)</li>
                </ul>
                <h3>Local Positions</h3>
                <ul className="list-disc list-inside pl-4">
                    <li>Governor (1 seat)*</li>
                    <li>Vice Governor (1 seat)*</li>
                    <li>Board Members (6 seats)*</li>
                    <li>BARMM District Representative (1 seat) - applicable if in BARMM</li>
                    <li>Mayor (1 seat)</li>
                    <li>Vice Mayor (1 seat)</li>
                    <li>Councilors (12 seats)</li>
                </ul>
                <p className="mt-2"><span className="font-bold text-red-600">Note: </span> the positions of <span className="font-bold">Governor</span>, <span className="font-bold">Vice Governor</span> and <span className="font-bold">Provincial Board Members</span> are only required if you live in a province.</p>
            </div>
            <div id="candidate-responsibilities" className="w-5/6 md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3 mt-4">
                <h2 className="text-xl font-medium mb-2">What are the responsibilities of each position?</h2>
                <p className="mb-2">During the campaign period, many candidates promise their constituents that life will be better, poverty will be finished and that they will &quot;fight&quot; for them. However, what exactly do they do on the day to day basis?</p>
                <h4 id="senators-responsibilities" className="text-lg">Senators</h4>
                <p className="mb-1">As per the <span className="font-bold">1987 Philippine Constitution</span> and other laws, the key duties and responsibilities of a senator are:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>Propose, review, and enact laws</li>
                    <li>Amend or repeal existing laws</li>
                    <li>Review international treaties and agreements</li>
                    <li>Monitor the Executive Branch</li>
                    <li>Review government spending and policies</li>
                    <li>Summon officials for <span className="font-bold">questioning</span></li>
                    <li>Act as judges in <span className="font-bold">impeachment trials</span></li>
                    <li>Vote on removing public officials</li>
                    <li>Propose Constitutional Amendments</li>
                </ul>
                <h4 id="partylists-responsibilities" className="text-lg">Partylists</h4>
                <p className="mb-1">As per the <span className="font-bold">1987 Philippine Constitution</span> and other laws, the key duties and responsibilities of a party-list representative are:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>Propose, review, and enact laws</li>
                    <li>Amend or repeal existing laws</li>
                    <li>Scrutinize the national budget</li>
                    <li>Voice out the concerns of their sector</li>
                </ul>
                <h4 id="representative-responsibilities" className="text-lg">Representatives</h4>
                <p className="mb-1">As per the <span className="font-bold">1987 Philippine Constitution</span> and other laws, the key duties and responsibilities of a representative are:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>Propose, review, and enact laws</li>
                    <li>Amend or repeal existing laws</li>
                    <li>Scrutinize the national budget</li>
                    <li>Voice out the concerns of their city, municipality or district</li>
                    <li>Secure funding for local projects</li>
                    <li>Initiate and approve impeachment proceedings</li>
                </ul>
                <h4 id="governor-responsibilities" className="text-lg">Governor</h4>
                <p className="mb-1">As per the <span className="font-bold">1987 Philippine Constitution</span> and other laws, the key duties and responsibilities of a governor are:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>Lead the provincial government</li>
                    <li>Oversee local government units (LGU)</li>
                    <li>Enforce national laws at the provincial level</li>
                    <li>Approve or veto provincial ordinances</li>
                    <li>Prepare the annual budget for the province</li>
                    <li>Initiate and oversee projects</li>
                    <li>Appoint provincial department heads</li>
                </ul>
                <h4 id="vice-governor-responsibilities" className="text-lg">Vice Governor</h4>
                <p className="mb-1">As per the <span className="font-bold">1987 Philippine Constitution</span> and other laws, the key duties and responsibilities of a vice governor are:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>Presiding officier of the Sangguniang Panlalawigan (provincial board)</li>
                    <li>Break tie votes in provincial board voting</li>
                    <li>Propose or sponsor provincial ordinances</li>
                    <li>Assume the Governor&apos;s position when necessary</li>
                </ul>
                <h4 id="provincial-board-responsibilities" className="text-lg">Provincial Board Member (Sangguniang Panlalawigan)</h4>
                <p className="mb-1">As per the <span className="font-bold">1987 Philippine Constitution</span> and other laws, the key duties and responsibilities of a provincial board member are:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>Propose, review and pass provincial laws</li>
                    <li>Amend or repeal existing provincial ordinances</li>
                    <li>Approve or disapprove provincial budget</li>
                    <li>Repreent their district in the Provincial Board</li>
                    <li>Conduct investigations and inquiries</li>
                </ul>
                <h4 id="mayor-responsibilities" className="text-lg">Mayor</h4>
                <p className="mb-1">As per the <span className="font-bold">1987 Philippine Constitution</span> and other laws, the key duties and responsibilities of a mayor are:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>Lead the local government unit (LGU)</li>
                    <li>Supervise baranggays</li>
                    <li>Implement national laws at the local level</li>
                    <li>Approve or veto local ordinances</li>
                    <li>Prepare the annual budget of the local government unit</li>
                    <li>Appoint local department heads</li>
                </ul>
                <h4 id="vice-mayor-responsibilities" className="text-lg">Vice Mayor</h4>
                <p className="mb-1">As per the <span className="font-bold">1987 Philippine Constitution</span> and other laws, the key duties and responsibilities of a vice mayor are:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>Presiding officier of the Sangguniang Panlungsod (city council) or Sangguniang Bayan (Municipal Council)</li>
                    <li>Break tie votes in the council</li>
                    <li>Propose local laws</li>
                    <li>Assume the Mayor&apos;s position when necessary</li>
                </ul>
                <h4 id="councilor-responsibilities" className="text-lg">Councilor</h4>
                <p className="mb-1">As per the <span className="font-bold">1987 Philippine Constitution</span> and other laws, the key duties and responsibilities of a councilor are:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>Draft, propose, and pass local laws</li>
                    <li>Review and amend existing ordinances</li>
                    <li>Approve city/municipality budget</li>
                    <li>Set local tax policies</li>
                    <li>Oversee barangay governance</li>
                </ul>
            </div>
            <div id="where-to-vote" className="w-5/6 md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3 mt-4">
                <h2 className="text-xl font-medium mb-2">Where do I vote?</h2>
                <p className="mb-1">You may find your designated COMELEC voting precint on COMELEC Precinct Finder website. You may access it <a href="https://voterverifier.comelec.gov.ph/voter_precinct" className="text-blue-500">here</a>.</p>
                <p className="mt-2">As of April 1, 2025, the platform is not yet accessible.</p>
            </div>
            <div id="when-to-vote" className="w-5/6 md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3 mt-4">
                <h2 className="text-xl font-medium mb-2">When do I vote?</h2>
                <p className="mb-1">For Filipino Citizens situated in the Philippines, voting is on May 12, 2025 (Monday).</p>
                <p className="mb-1">Meanwhile, Filipino Citizens situated abroad will have their voting period from April 13, 2025 until May 12, 2025. For more info, refer to the article by COMELEC <a href="https://philippineembassy-dc.org/overseas-absentee-voting/" className="text-blue-500">here</a>.</p>
            </div>
            <div id="what-to-bring" className="w-5/6 md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3 mt-4">
                <h2 className="text-xl font-medium mb-2">What to bring?</h2>
                <p className="mb-1">As long as you are a registed voter, all you need to bring is a <span className="font-bold">Valid ID</span> to be able to vote.</p>
                <p className="mb-1">Valid IDs include:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>Voter&apos;s ID</li>
                    <li>Passport</li>
                    <li>Driver&apos;s License</li>
                    <li>Postal ID</li>
                    <li>PhilSys (National ID)</li>
                    <li>SSS/GSSS ID</li>
                    <li>PRC ID</li>
                    <li>Senior Citizen ID</li>
                    <li>PWD ID</li>
                    <li>Any other government-issued ID with your photo and signature</li>
                </ul>
                <p className="mb-1 mt-1">Optionally, you may also bring the following:</p>
                <ul className="list-disc list-inside pl-4">
                    <li>Ballpen</li>
                    <li>Sample ballot</li>
                    <li>Face Mask</li>
                    <li>Hand Sanitizer</li>
                    <li>Water & Snacks</li>
                </ul>
            </div>
        </div>
    )
}