import { useEffect, useState } from "react";

type PrimitiveIdentifier = string | number | bigint | null | undefined;
type IdentifierFunction<T> = (element: T) => PrimitiveIdentifier;
export type ElementSelectionOptions<T> = T extends PrimitiveIdentifier 
  ? ElementPrimitiveSelectionOptions<T> 
  : ElementComplexSelectionOptions<T>;

export interface ElementComplexSelectionOptions<T> {
  readonly identifier: IdentifierFunction<T>;
  readonly dependencies?: unknown[];
  readonly targets?: T[];
}

export type ElementPrimitiveSelectionOptions<T> = Partial<ElementComplexSelectionOptions<T>>;

export const useElementSelection = function<T>(elements: T[], options?: ElementSelectionOptions<T>) {
  const { 
    dependencies,
    targets = [], 
    identifier = (value: T) => value,
  } = options || {};

  const identifySelections = (cluster: T[]) => {
    const identifiedTargetSelections: T[] = [];
    for (const target of cluster) {
      for (const element of elements) {
        if (identifier(target) === identifier(element)) {
          identifiedTargetSelections.push(target);
        }
      }
    }

    return identifiedTargetSelections;
  }

  const [ selections, setSelections ] = useState(identifySelections(targets));

  useEffect(() => {
    const identifiedSelections = identifySelections(selections);
    setSelections(identifiedSelections);
  }, dependencies || [elements]);

  const elementIsSelected = (element: T, useIdentifier = true) => {
    return selections.some((selection) => identifier(selection) === identifier(element));
  }

  const deselectOneSelection = (element: T) => {
    const selectionList = selections.filter(selection => selection !== element);
    setSelections(selectionList);
  }

  const deselectAllSelections = () => {
    setSelections([]);
  }

  const selectOneElement = (element: T, ignoreSelectionState = false) => {
      if (ignoreSelectionState || !elementIsSelected(element)) {
      setSelections([element]);
    }
  }

  const selectAdditionalElement = (element: T, ignoreSelectionState = false) => {
    if (ignoreSelectionState || !elementIsSelected(element)) {
      setSelections([...selections, element]);
    }
  }

  const toggleOneElement = (element: T) => {
    if (elementIsSelected(element)) {
      deselectOneSelection(element);
    } else {
      selectOneElement(element);
    }
  }

  const toggleAdditionalElement = (element: T) => {
    if (elementIsSelected(element)) {
      deselectOneSelection(element);
    } else {
      selectAdditionalElement(element);
    }
  }

  const selectElementsInBlock = (element: T) => {
    const targetElementIndex = elements.indexOf(element);
    const lastSelection = selections.length !== 0 ? selections[selections.length - 1] : null;

    if (targetElementIndex === -1) {
      return;
    }

    const lastSelectionIndex = lastSelection ? elements.indexOf(lastSelection) : 0;
    const directionFacingPositive = lastSelectionIndex < targetElementIndex;
    const blockSelections = elements.filter((_, index) => 
      directionFacingPositive
        ? (index >= lastSelectionIndex && index <= targetElementIndex)
        : (index < lastSelectionIndex && index >= targetElementIndex)
    );

    const uniqueSelections = new Set([...selections, ...blockSelections]);
    const selectionList = Array.from(uniqueSelections);
    setSelections(selectionList);
  }

  return {
    selections,
    elementIsSelected,
    selectOneElement,
    selectAdditionalElement,
    toggleOneElement,
    toggleAdditionalElement,
    selectElementsInBlock,
    deselectAllSelections,
    deselectOneSelection,
  }
}
