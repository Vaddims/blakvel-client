import { MouseEvent } from 'react';
import { useElementSelection, ElementSelectionOptions } from "./useElementSelection";

export const useSequentialElementSelection = function<T>(elements: T[], options?: ElementSelectionOptions<T>) {
  const elementSelection = useElementSelection(elements, options);
  const {
    selections,
    toggleOneElement,
    elementIsSelected,
    selectOneElement,
    toggleAdditionalElement,
    selectElementsInBlock,
  } = elementSelection;
  
  const handleSelectionEvent = (element: T) => (event: MouseEvent) => {
    event.stopPropagation();

    if (event.shiftKey) {
      selectElementsInBlock(element);
      return;
    }

    if (event.shiftKey || event.metaKey) {
      toggleAdditionalElement(element);
      return;
    }

    if (elementIsSelected(element) && selections.length > 1) {
      selectOneElement(element, true);
      return;
    }

    toggleOneElement(element);
  }

  return {
    ...elementSelection,
    handleSelectionEvent,
  }
}
