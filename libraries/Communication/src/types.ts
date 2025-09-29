import { Ops } from "./consts";

export type Message =
  | string
  | number
  | boolean
  | Message[]
  | { [key: string]: Message };

export type Callback = (message: Message, player: any) => void;

export interface MessageState {
  identifierString: string;
  op: Ops;
  message: string;
  charsRemaining: number;
}