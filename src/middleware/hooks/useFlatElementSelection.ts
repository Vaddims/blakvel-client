import { MouseEvent } from 'react';
import { useElementSelection, ElementSelectionOptions } from "./useElementSelection";

export const useFlatElementSelection = function<T>(elements: T[], options?: ElementSelectionOptions<T>) {
  const universalElementSelection = useElementSelection(elements, options);
  const {
    selections,
    toggleOneElement,
    elementIsSelected,
    selectOneElement,
    toggleAdditionalElement,
    selectElementsInBlock,
  } = universalElementSelection;
  
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
    ...universalElementSelection,
    handleSelectionEvent,
  }
}
