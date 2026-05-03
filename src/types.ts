export enum Category {
  Abstract = "abstract",
  Figurative = "figurative",
  Portrait = "portrait",
}

export interface Pic {
  title?: string;
  category: Category[];
  img: string[];
  spec: string;
  dimensions: string;
  price?: string;
  sold?: boolean;
}
