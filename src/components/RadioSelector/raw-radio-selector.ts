export interface RawRadioOptions<Data> {
  name: string;
  defaultSelection: string;
  data: Data;
}

export function parseRawRadioOptions<T>(options: RawRadioOptions<T>) {

  return {...options};
}