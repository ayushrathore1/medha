import { describe, expect, it } from "vitest";
import {
  findCatalogSubject,
  isSem5SharedCore,
  subjectMatchesBranch,
} from "./branchScope";

const aoa = {
  name: "Analysis of Algorithms",
  short: "AOA",
  code: "5CS4-05",
  semester: 5,
  branch: "CSE",
};
const itc = {
  name: "Information Theory & Coding",
  short: "ITC",
  code: "5CS3-01",
  semester: 5,
  branch: "CSE",
  branches: ["CSE", "IT"],
};
const dmc = {
  name: "Data Mining Concepts and Techniques",
  short: "DMC",
  code: "5E1821",
  semester: 5,
  branch: "AIDS",
  branches: ["AIDS", "AI", "CAI"],
};

describe("Sem 5 shared cores", () => {
  it("recognises AOA/CG/CD/OS as shared", () => {
    expect(isSem5SharedCore(aoa)).toBe(true);
    expect(isSem5SharedCore({ name: "Operating Systems", semester: 5, short: "OS" })).toBe(true);
    expect(isSem5SharedCore(itc)).toBe(false);
  });

  it("shows shared cores to CSE, AIDS, and IT", () => {
    expect(subjectMatchesBranch(aoa, "CSE")).toBe(true);
    expect(subjectMatchesBranch(aoa, "AIDS")).toBe(true);
    expect(subjectMatchesBranch(aoa, "IT")).toBe(true);
  });

  it("keeps CSE electives off AIDS desks", () => {
    expect(subjectMatchesBranch(itc, "CSE")).toBe(true);
    expect(subjectMatchesBranch(itc, "IT")).toBe(true);
    expect(subjectMatchesBranch(itc, "AIDS")).toBe(false);
  });

  it("keeps AIDS electives on AIDS only", () => {
    expect(subjectMatchesBranch(dmc, "AIDS")).toBe(true);
    expect(subjectMatchesBranch(dmc, "CSE")).toBe(false);
    expect(subjectMatchesBranch(dmc, "IT")).toBe(false);
  });

  it("matches note subject aliases", () => {
    const catalog = [
      { ...aoa, aliases: ["AOA"] },
      { name: "Operating System", short: "OS", semester: 5, code: "5CS4-03", aliases: ["Operating Systems"] },
    ];
    expect(findCatalogSubject(catalog, "Operating Systems")?.short).toBe("OS");
    expect(findCatalogSubject(catalog, "AOA")?.code).toBe("5CS4-05");
  });
});
