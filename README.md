# Balota

With the 2025 Philippine Midterm Elections coming closer, finding candidates to vote becomes more and more crucial. [Balota](https://balota.vercel.app) simplifies this.

Balota is a web-based, AI-powered ballot generator, allowing browsing of candidates in national and local positions; getting background information of candidates - highlighting any past scandals; and allowing for ballot personalization by providing interface for adding and removing candidates to vote for. 

Balota is built with Next.JS, Shadcn, TailwindCSS and PostgreSQL. The database is hosted in Supabase whilst the application is hosted in Vercel.

You may access the application here: https://balota.vercel.app.

Candidate information is scraped from COMELEC's list of candidates found [here](https://comelec.gov.ph/?r=2025NLE/CLC2025).

My Python scripts for extracting candidates may be found below:
https://github.com/Towphe/comelec-candidates-extractor
