import type {
  PlanetFact,
} from "../../contracts/facts";

import type {
  KnowledgeRule,
} from "../../knowledge/types";

export function matchRules(
  facts: PlanetFact,
  rules: KnowledgeRule[]
): KnowledgeRule[] {
  return rules.filter(
    (rule) => {
      const trigger =
        rule.trigger;

      if (
        trigger.sign &&
        trigger.sign !==
          facts.sign
      ) {
        return false;
      }

      if (
        trigger.house !==
          undefined &&
        trigger.house !==
          facts.house
      ) {
        return false;
      }

      if (
        trigger.dignity &&
        trigger.dignity !==
          facts.dignity
      ) {
        return false;
      }

      if (
        trigger.retrograde !==
          undefined &&
        trigger.retrograde !==
          facts.retrograde
      ) {
        return false;
      }

      if (
        trigger.combust !==
          undefined &&
        trigger.combust !==
          facts.combust
      ) {
        return false;
      }

      if (
        trigger.vargottama !==
          undefined &&
        trigger.vargottama !==
          facts.vargottama
      ) {
        return false;
      }

      if (
        trigger.nakshatra &&
        trigger.nakshatra !==
          facts.nakshatra
      ) {
        return false;
      }

      if (
        trigger.pada !==
          undefined &&
        trigger.pada !==
          facts.pada
      ) {
        return false;
      }

      if (
        trigger.ownsHouse !==
          undefined &&
        !facts.ownsHouses.includes(
          trigger.ownsHouse
        )
      ) {
        return false;
      }

      if (
        trigger.conjunction &&
        !facts.conjunctions.includes(
          trigger.conjunction
        )
      ) {
        return false;
      }

      if (
        trigger.aspectFrom &&
        !facts.aspectsReceived.some(
          (aspect) =>
            aspect.from ===
            trigger.aspectFrom
        )
      ) {
        return false;
      }

      if (
        trigger.aspectTo &&
        !facts.aspectsGiven.some(
          (aspect) =>
            aspect.to ===
            trigger.aspectTo
        )
      ) {
        return false;
      }

      if (
        trigger.dispositor &&
        trigger.dispositor !==
          facts.dispositor
      ) {
        return false;
      }

      if (
        trigger.currentDasha !==
          undefined &&
        trigger.currentDasha !==
          facts.currentDashaActive
      ) {
        return false;
      }

      if (
        trigger.currentTransit !==
          undefined &&
        trigger.currentTransit !==
          facts.currentTransitActive
      ) {
        return false;
      }

      if (trigger.varga) {
        const matchingVarga =
          facts.vargas.some(
            (placement) => {
              if (
                placement.chart !==
                trigger.varga?.chart
              ) {
                return false;
              }

              if (
                trigger.varga.sign &&
                placement.sign !==
                  trigger.varga.sign
              ) {
                return false;
              }

              if (
                trigger.varga.house !==
                  undefined &&
                placement.house !==
                  trigger.varga.house
              ) {
                return false;
              }

              if (
                trigger.varga.dignity &&
                placement.dignity !==
                  trigger.varga.dignity
              ) {
                return false;
              }

              return true;
            }
          );

        if (!matchingVarga) {
          return false;
        }
      }

      return true;
    }
  );
}