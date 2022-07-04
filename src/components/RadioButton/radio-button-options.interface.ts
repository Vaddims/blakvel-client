export interface RadioButtonOptions<Payload = undefined> {
  title: string;
  disabled?: boolean;
  defaultSelection?: boolean;
  payload: Payload;
}
