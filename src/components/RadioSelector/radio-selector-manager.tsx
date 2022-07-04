// import { MouseEvent } from "react";
// import { useUniversalElementSelection } from "../../Middleware/Hooks/universal-element-selection";
// import { RadioButtonOptions } from "./RadioButton/radio-button-options.interface";
// import RadioSelector from '.';
// import { RadioSelectorOptions } from "./radio-selector-options.interface";

// export interface RadioSelectorManagerOptions<MultiSelection extends boolean> extends RadioSelectorOptions {
//   // initialTarget?: MultiSelection extends true ? RadioButtonOptions[] : RadioButtonOptions;
//   multiSelection?: MultiSelection;
//   identifier?: (options: RadioButtonOptions) => unknown;
// }

// export type RadioSelectionVariantOptions = 
//   | RadioSelectorManagerOptions<true> 
//   | RadioSelectorManagerOptions<false>;

// export function useRadioSelectorManager<
//   OptionsVariant extends RadioSelectionVariantOptions,
// >(options: OptionsVariant) {
//   const {
//     radioButtons = [],
//     multiSelection = false,
//     targets = [],
//     identifier = (radioButton) => radioButton.title,
//   } = options;

//   const {
//     selections,
//     elementIsSelected,
//     selectOneElement,
//     selectElementsInBlock,
//     toggleAdditionalElement,
//   } = useUniversalElementSelection(radioButtons, identifier);

//   const handleSelectionEvent = (radioButton: RadioButtonOptions) => (event: MouseEvent) => {
//     event.stopPropagation();

//     if (!multiSelection) {
//       selectOneElement(radioButton);
//       return;
//     }

//     if (event.shiftKey) {
//       selectElementsInBlock(radioButton);
//       return;
//     }

//     toggleAdditionalElement(radioButton);
//   }

//   const renderRadioSelector = (title?: string) => {
//     return (
//       <RadioSelector
//         {...options}
//         // target={selections}
//         title={title ?? options.title}
//         onRadioButtonToggle={handleSelectionEvent}
//       />
//     )
//   }

//   const targetSelection = (multiSelection ? selections : (selections[0] ?? null));
//   type ReturnTargetType = OptionsVariant['multiSelection'] extends true 
//     ? RadioButtonOptions[] 
//     : (RadioButtonOptions | null);

//   return {
//     target: targetSelection as ReturnTargetType,
//     renderRadioSelector,
//   }
// }

export {}