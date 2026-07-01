import { OVERBRIDGE_TEMPLATES } from "./overbridgeTemplates";

export function getNextActivities(
  completedActivities: string[]
) {
  return OVERBRIDGE_TEMPLATES.filter(
    (activity) =>
      activity.predecessors.every(
        (pred) =>
          completedActivities.includes(pred)
      )
  );
}


// Build Dependency Graph

import { ActivityTemplate } from "./types";

export function buildGraph(
  activities: ActivityTemplate[]
) {
  const graph = new Map<
    string,
    ActivityTemplate
  >();

  activities.forEach((activity) => {
    graph.set(
      activity.code,
      activity
    );
  });

  return graph;
}


// Validate Missing Dependencies

export function validateDependencies(
  activities: ActivityTemplate[]
) {
  const graph =
    buildGraph(activities);

  for (const activity of activities) {
    for (const predecessor of activity.predecessors) {
      if (
        !graph.has(predecessor)
      ) {
        throw new Error(
          `${activity.code} depends on missing activity ${predecessor}`
        );
      }
    }
  }

  return true;
}

// Detect Circular Dependencies

export function detectCycles(
  activities: ActivityTemplate[]
) {
  const graph =
    buildGraph(activities);

  const visited =
    new Set<string>();

  const stack =
    new Set<string>();

  function dfs(
    code: string
  ): boolean {

    if (stack.has(code))
      return true;

    if (visited.has(code))
      return false;

    visited.add(code);

    stack.add(code);

    const activity =
      graph.get(code);

    if (activity) {
      for (
        const predecessor of
        activity.predecessors
      ) {
        if (
          dfs(predecessor)
        )
          return true;
      }
    }

    stack.delete(code);

    return false;
  }

  for (const activity of activities) {
    if (dfs(activity.code)) {
      throw new Error(
        `Circular dependency detected at ${activity.code}`
      );
    }
  }
}

