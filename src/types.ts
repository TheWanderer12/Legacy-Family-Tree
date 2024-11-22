export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export const enum Gender {
  Male = "male",
  Female = "female",
}

export const enum RelType {
  Blood = "blood",
  Married = "married",
  Divorced = "divorced",
  Adopted = "adopted",
  Half = "half",
}

export const enum FamilyType {
  Root = "root",
  Child = "child",
  Parent = "parent",
}

export type Node = {
  id: string;
  name: string;
  surname: string;
  gender: Gender;
  dateOfBirth: Date;
  description?: string;
  picture?: string;
  parents: readonly Relation[];
  children: readonly Relation[];
  siblings: readonly Relation[];
  spouses: readonly Relation[];
};

export type Relation = {
  id: string;
  type: RelType;
};
