import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Search, University } from "lucide-react";
import SearchBar from "./SearchBar";
import { getRecentSearches, saveRecentSearch } from "../../data/subjectCatalog";

const RTU = "Rajasthan Technical University, Kota";
const UNITS = [
 { n:1, title:"Introduction", topics:["Objective, scope and outcome of the course"] },
 { n:2, title:"Background & Divide and Conquer Method", topics:["Review of Algorithm","Complexity Order Notations: definitions and calculating complexity","Binary Search","Merge Sort","Quick Sort","Strassen’s Matrix Multiplication Algorithm"] },
 { n:3, title:"Greedy Method & Dynamic Programming", topics:["Knapsack Problem","Job Sequencing","Optimal Merge Patterns","Minimum Spanning Trees","Matrix Chain Multiplication","Longest Common Subsequence","0/1 Knapsack Problem"] },
 { n:4, title:"Branch and Bound & Pattern Matching Algorithms", topics:["Traveling Salesman Problem","Lower Bound Theory","Backtracking Algorithms","N-Queens Problem","Naïve String Matching","Rabin–Karp Algorithm","KMP Matcher","Boyer–Moore Algorithm"] },
 { n:5, title:"Assignment Problems & Randomized Algorithms", topics:["Formulation of Assignment Problem","Quadratic Assignment Problem","Las Vegas Algorithms","Monte Carlo Algorithms","Randomized Min-Cut Algorithm","Randomized Algorithm for 2-SAT","Multicommodity Flow","Flow Shop Scheduling","Network Capacity Assignment Problems"] },
 { n:6, title:"Problem Classes: NP, NP-Hard & NP-Complete", topics:["Definitions of P, NP-Hard and NP-Complete Problems","Decision Problems","Cook’s Theorem","Proving NP-Complete Problems","Satisfiability Problem","Vertex Cover Problem","Approximation Algorithms for Vertex Cover","Set Cover Problem"] }
];

export default function UniversitySyllabusDashboard({ user }) {
 const navigate=useNavigate();
 const [query,setQuery]=useState("");
 const [university,setUniversity]=useState(()=>localStorage.getItem("medha-university")||"");
 const [other,setOther]=useState(()=>localStorage.getItem("medha-custom-university")||"");
 const [showError,setShowError]=useState(false);
 const recents=getRecentSearches().slice(0,8);
 const name=university==="Other"?other.trim():university;
 const isRTU=university===RTU;
 useEffect(()=>{if(university){localStorage.setItem("medha-university",university);localStorage.setItem("medha-custom-university",other)}},[university,other]);
 const search=(text=query)=>{
  if(!name){setShowError(true);document.getElementById("medha-university")?.focus();return}
  const term=String(text||"").trim();
  if(!term){navigate("/search");return}
  const fullQuery=term+" "+name;
  saveRecentSearch(fullQuery);
  navigate("/search?q="+encodeURIComponent(fullQuery));
 };
 const topic=(t,u)=>{setQuery(t);search(t+" | "+u)};
 const chip="rounded-lg border border-[#DDEAF2] bg-[#FAFCFE] px-2.5 py-1.5 text-left text-[12px] leading-5 text-[#46677E] transition hover:border-[#72D5EB] hover:bg-[#EAF8FC] hover:text-[#0C6287]";
 return <div className="space-y-6 pb-6">
  <section className="rounded-2xl border border-[#D9E8F3] bg-gradient-to-br from-[#F4FAFE] via-white to-[#EAF6FD] p-5 sm:p-6">
   <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-[#176B94]"><GraduationCap size={18}/> Your syllabus, organised</div>
   <p className="text-[13px] text-[#557187]">{user?.name ? "Welcome back, "+user.name.split(" ")[0]+"." : "Your university syllabus, one topic at a time."}</p>
   <h1 className="mt-2 max-w-lg font-[Manrope,sans-serif] text-[28px] font-bold leading-[1.16] tracking-[-.045em] text-[#102A43] sm:text-[34px]">Find exactly what you need to study.</h1>
   <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#58738A]">Choose your university, then tap any unit or topic to search matching notes and learning resources.</p>
  </section>
  <section className="rounded-2xl border border-[#D8E5EF] bg-white p-4 shadow-sm sm:p-5">
   <label htmlFor="medha-university" className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#102A43]"><University size={16} className="text-[#168AB5"/> University <span className="text-red-600">*</span></label>
   <select id="medha-university" required value={university} onChange={e=>{setUniversity(e.target.value);setShowError(false)}} className="w-full rounded-xl border border-[#C8DCE9] bg-[#F9FCFE] px-3 py-3 text-sm text-[#102A43] outline-none focus:border-[#168AB5] focus:ring-4 focus:ring-cyan-100">
    <option value="">Select your university (required)</option><option value={RTU}>Rajasthan Technical University, Kota (RTU)</option><option value="Other">Other university</option>
   </select>
   {university==="Other"&&<input required value={other} onChange={e=>setOther(e.target.value)} placeholder="Enter your university name" className="mt-3 w-full rounded-xl border border-[#C8DCE9] px-3 py-3 text-sm outline-none focus:border-[#168AB5]"/>}
   {showError&&<p className="mt-2 text-xs font-medium text-red-700">Select or enter your university before searching.</p>}
   {name&&<p className="mt-3 text-xs text-[#527187]">Searches include <strong className="text-[#102A43]">{name}</strong>.</p>}
  </section>
  <section className="rounded-2xl border border-[#D8E5EF] bg-white p-4 sm:p-5">
   <div className="mb-3 flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#168AB5]">Search resources</p><h2 className="mt-1 text-[17px] font-bold text-[#102A43]">Search any topic</h2></div><Search size={18} className="text-[#168AB5]"/></div>
   <SearchBar value={query} onChange={setQuery} onSubmit={search} placeholder="e.g. Master theorem, Quick Sort…"/>
  </section>
  {recents.length>0&&<section><h2 className="mb-3 text-[15px] font-bold text-[#102A43]">Recently searched</h2><div className="flex flex-wrap gap-2">{recents.map(x=><button key={x} onClick={()=>search(x)} className="rounded-full border border-[#D5E6F0] bg-[#F7FBFE] px-3 py-2 text-xs text-[#315B76] hover:bg-[#EAF8FC]">{x}</button>)}</div></section>}
  <section className="overflow-hidden rounded-2xl border border-[#D6E3ED] bg-white">
   <div className="border-b border-[#D6E3ED] bg-[#F5F9FC] p-4 sm:p-5"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#DDF4FC] text-[#176B94]"><BookOpen size={19}/></div><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#176B94]">{isRTU?"RTU • CSE • Semester V":name?"University syllabus":"Choose university first"}</p><h2 className="mt-1 text-[16px] font-bold text-[#102A43]">{isRTU?"5CS4-05: Analysis of Algorithms":name?"Syllabus for "+name:"University-wise syllabus"}</h2>{isRTU&&<p className="mt-1 text-xs text-[#617C90]">III Year • V Semester • B.Tech. Computer Science and Engineering</p>}</div></div></div>
   {!name?<div className="p-8 text-center text-sm text-[#58738A]">Select your university to view its syllabus.</div>:isRTU?<div className="divide-y divide-[#D8E5EF]">{UNITS.map(u=><article key={u.n} className="flex gap-3 px-4 py-4 transition hover:bg-[#F7FBFE] sm:px-5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#D4E6F0] bg-[#F3F9FD] text-xs font-bold text-[#176B94]">{String(u.n).padStart(2,"0")}</span><div className="min-w-0 flex-1"><button onClick={()=>topic(u.title,u.title)} className="text-left text-sm font-bold leading-5 text-[#102A43] hover:text-[#117EA7] hover:underline">{u.title}</button><div className="mt-2 flex flex-wrap gap-2">{u.topics.map(t=><button key={t} onClick={()=>topic(t,u.title)} className={chip}>{t}</button>)}</div></div></article>)}</div>:<div className="p-6"><p className="text-sm font-semibold text-[#31536B]">We need the official syllabus for {name} to show the correct units.</p><p className="mt-2 text-[13px] leading-6 text-[#71879A]">We won't display RTU topics as if they belong to another university. You can search for its official syllabus while its unit-by-unit content is added.</p><button onClick={()=>search("official syllabus "+name)} className="mt-4 rounded-full bg-[#0C527E] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#083B60]">Search this university's syllabus ↗</button></div>}
  </section>
  <p className="px-1 text-[11px] leading-5 text-[#8397A6]">Content-only syllabus view. No hours or marks columns. Verify the current official syllabus before exam preparation.</p>
 </div>;
}
