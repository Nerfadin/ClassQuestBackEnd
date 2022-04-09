import { AxiosError } from "axios";

export function isAxiosError(obj: object): obj is AxiosError {
  return !!(obj as AxiosError).isAxiosError;
}
