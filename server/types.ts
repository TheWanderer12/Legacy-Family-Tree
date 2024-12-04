export declare type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
export enum Gender {
  male = "male",
  female = "female",
}

export enum RelType {
  blood = "blood",
  married = "married",
  divorced = "divorced",
  adopted = "adopted",
  half = "half",
}
export declare const enum FamilyType {
  root = "root",
  child = "child",
  parent = "parent",
}
export declare type Family = {
  readonly id: number;
  readonly type: FamilyType;
  readonly main: boolean;
  pid?: number;
  cid?: number;
  X: number;
  Y: number;
  parents: readonly Unit[];
  children: readonly Unit[];
};
export declare type Unit = {
  readonly fid: number;
  readonly child: boolean;
  readonly nodes: readonly Node[];
  pos: number;
};
export declare type Size = Readonly<{
  width: number;
  height: number;
}>;
export declare type Relation = Readonly<{
  id: string;
  type: RelType;
}>;
export declare type Node = {
  id: string;
  name: string;
  surname: string;
  gender: Gender;
  dateOfBirth: string;
  description?: string;
  parents: Relation[];
  children: Relation[];
  siblings: Relation[];
  spouses: Relation[];
  placeholder?: boolean;
};
export declare type ExtNode = Node &
  Readonly<{
    top: number;
    left: number;
    hasSubTree: boolean;
  }>;
export declare type Connector = readonly [
  x1: number,
  y1: number,
  x2: number,
  y2: number
];
export declare type RelData = Readonly<{
  canvas: Size;
  families: readonly Family[];
  nodes: readonly ExtNode[];
  connectors: readonly Connector[];
}>;
export declare type Options = Readonly<{
  rootId: string;
  placeholders?: boolean;
}>;
