export interface Coordinate {
  x: number;
  y: number;
}

export interface Options {
  color: string;
  pen: any;
}

export enum PEN_TYPE {
  BASIC,
  HIGHLIGHTER,
  ERASER
}