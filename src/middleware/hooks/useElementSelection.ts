import { useEffect, useState } from "react";

export type PrimitiveIdentifier = string | number | bigint | null | undefined;
export type IdentifierFunction<T> = (element: T) => PrimitiveIdentifier;
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
    targets = [], 
    dependencies = [],
    identifier = (value: unknown) => value,
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

  const getSelectionsInSequentialString = () => selections.map(identifier).join('&');
  const getElementsInSequentialString = () => elements.map(identifier).join('&');

  useEffect(() => {
    const identifiedSelections = identifySelections(selections);
    setSelections(identifiedSelections);
  }, [...dependencies, getElementsInSequentialString()]);

  const elementIsSelected = (element: T) => {
    return selections.some((selection) => identifier(selection) === identifier(element));
  }

  const allElementsAreSelected = () => {
    return elements.length > 0 && selections.length === elements.length;
  }

  const deselectOneSelection = (element: T) => {
    const selectionList = selections.filter(selection => selection !== element);
    setSelections(selectionList);
  }

  const deselectAllSelections = () => {
    setSelections([]);
  }

  const selectMultipleElements = (targets: T[]) => {
    setSelections([...targets]);
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

  const selectAllElements = () => {
    selectMultipleElements(elements);
  }

  const handleElementBulkSelection = () => {
    if (allElementsAreSelected()) {
      deselectAllSelections();
      return;
    }

    selectAllElements();
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
    allElementsAreSelected,
    selectOneElement,
    selectAdditionalElement,
    toggleOneElement,
    toggleAdditionalElement,
    selectElementsInBlock,
    selectMultipleElements,
    selectAllElements,
    handleElementBulkSelection,
    deselectAllSelections,
    deselectOneSelection,
    getSelectionsInSequentialString,
    getElementsInSequentialString,
  }
}