export type Message =
  | string
  | number
  | boolean
  | Message[]
  | { [key: string]: Message };

export type Callback = (message: Message, player: any) => void;