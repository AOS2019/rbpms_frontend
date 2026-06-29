export interface TemplateActivity {
  code: string;
  activity: string;
  unit: string;
  duration: number;
  predecessors: string[];
}

export const OVERBRIDGE_TEMPLATES: TemplateActivity[] = [
    {
    code: "PILECAP_BLIND",
    activity: "Pile Cap Concrete blinding",
    unit: "M³",
    duration: 1,
    predecessors: [],
  },
  {
    code: "PILECAP_REINF",
    activity: "Pile Cap Reinforcement",
    unit: "TONNE",
    duration: 2,
    predecessors: ["PILECAP_BLIND"],
  },
  {
    code: "PILECAP_FORMWORK",
    activity: "Pile Cap Formwork",
    unit: "M²",
    duration: 1,
    predecessors: ["PILECAP_REINF"],
  },
  {
    code: "PILECAP_CAST",
    activity: "Pile Cap Concrete Casting",
    unit: "M³",
    duration: 1,
    predecessors: ["PILECAP_FORMWORK"],
  },

  {
    code: "PIER_REINF",
    activity: "Pier Reinforcement",
    unit: "TONNE",
    duration: 2,
    predecessors: ["PILECAP_CAST"],
  },

  {
    code: "PIER_FORMWORK",
    activity: "Pier Formwork",
    unit: "M²",
    duration: 1,
    predecessors: ["PIER_REINF"],
  },

  {
    code: "PIER_CAST",
    activity: "Pier Concrete Casting",
    unit: "M³",
    duration: 1,
    predecessors: ["PIER_FORMWORK"],
  },

  {
    code: "PIERCAP_STAGE1",
    activity: "Piercap Stage 1",
    unit: "M³",
    duration: 2,
    predecessors: ["PIER_CAST"],
  },

  {
    code: "PLINTH_INSTALL",
    activity: "Plinth Installation",
    unit: "NOS",
    duration: 1,
    predecessors: ["PIERCAP_STAGE1"],
  },

  {
    code: "BEAM_INSTALL",
    activity: "Beam Installation",
    unit: "NOS",
    duration: 2,
    predecessors: ["PLINTH_INSTALL"],
  },

  {
    code: "SLAB_INSTALL",
    activity: "Slab Installation",
    unit: "NOS",
    duration: 2,
    predecessors: ["BEAM_INSTALL"],
  },

  {
    code: "DECK_REINF",
    activity: "Deck Reinforcement",
    unit: "TONNE",
    duration: 2,
    predecessors: ["SLAB_INSTALL"],
  },

  {
    code: "DECK_FORMWORK",
    activity: "Deck Formwork",
    unit: "M²",
    duration: 1,
    predecessors: ["DECK_REINF"],
  },

  {
    code: "DECK_CAST",
    activity: "Deck Concrete Casting",
    unit: "M³",
    duration: 1,
    predecessors: ["DECK_FORMWORK"],
  },
];