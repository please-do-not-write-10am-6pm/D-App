export interface TOKEN {
  attributes: Array<object>;
  description: string;
  image: string;
  name: string;
}

export interface ATTRIBUTE {
  trait_type: string;
  value: string;
}
