export default interface ElementSelectorOptions<T = undefined> {
  title: string;
  disabled?: boolean;
  defaultSelection?: boolean;
  payload: T;
}
