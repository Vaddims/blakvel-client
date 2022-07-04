import { RadioButtonOptions } from "../RadioButton/radio-button-options.interface";

export interface RadioSelectorOptions<T> {
  title?: string;
  collapse?: boolean;
  collapsible?: boolean;
  options?: RadioButtonOptions<T>[];
  target?: RadioButtonOptions<T>[] | RadioButtonOptions<T> | null;
}