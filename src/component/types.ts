export interface Coordinate {
  x: number;
  y: number;
}

export interface Options {
  mode: MODE;
  color: string;
  pen: PEN_TYPE;
}

export enum PEN_TYPE {
  BASIC,
  HIGHLIGHTER,
  ERASER
}

export enum MODE {
  DRAWING,
  CROP
}