import { ActivityTemplate } from "../types";

export const overbridgeTemplate: ActivityTemplate[] = [

  // A1 PILE CAP

  {
    code: "A1_BLINDING",
    activity: "Concrete Blinding",
    element: "Pile Cap",
    location: "A1",
    unit: "m³",
    duration: 1,
    predecessors: [],
  },

  {
    code: "A1_REINF",
    activity: "Reinforcement Assembly",
    element: "Pile Cap",
    location: "A1",
    unit: "tons",
    duration: 2,
    predecessors: ["A1_BLINDING"],
  },

  {
    code: "A1_FORM",
    activity: "Formwork Assembly",
    element: "Pile Cap",
    location: "A1",
    unit: "m²",
    duration: 1,
    predecessors: ["A1_REINF"],
  },

  {
    code: "A1_CAST",
    activity: "Concrete Casting",
    element: "Pile Cap",
    location: "A1",
    unit: "m³",
    duration: 1,
    predecessors: ["A1_FORM"],
  },

  // P1 PILE CAP

  {
    code: "P1_BLINDING",
    activity: "Concrete Blinding",
    element: "Pile Cap",
    location: "P1",
    unit: "m³",
    duration: 1,
    predecessors: [],
  },

  {
    code: "P1_REINF",
    activity: "Reinforcement Assembly",
    element: "Pile Cap",
    location: "P1",
    unit: "tons",
    duration: 2,
    predecessors: ["P1_BLINDING"],
  },

  {
    code: "P1_FORM",
    activity: "Formwork Assembly",
    element: "Pile Cap",
    location: "P1",
    unit: "m²",
    duration: 1,
    predecessors: ["P1_REINF"],
  },

  {
    code: "P1_CAST",
    activity: "Concrete Casting",
    element: "Pile Cap",
    location: "P1",
    unit: "m³",
    duration: 1,
    predecessors: ["P1_FORM"],
  },

];