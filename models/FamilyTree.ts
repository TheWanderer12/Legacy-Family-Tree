import mongoose, { Document, Schema } from "mongoose";

export enum Gender {
  Male = "male",
  Female = "female",
}

export interface IMember {
  name: string;
  surname: string;
  gender: Gender;
  dateOfBirth: Date;
  description?: string;
  picture?: string;
  parents: mongoose.Types.ObjectId[];
  children: mongoose.Types.ObjectId[];
  siblings: mongoose.Types.ObjectId[];
  spouses: mongoose.Types.ObjectId[];
}

export interface IFamilyTree extends Document {
  name: string;
  members: IMember[];
}

const MemberSchema: Schema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  gender: { type: String, enum: Object.values(Gender), required: true },
  dateOfBirth: { type: Date, required: true },
  description: { type: String, default: "" },
  picture: { type: String, default: "" },
  parents: [{ type: Schema.Types.ObjectId, ref: "Member" }],
  children: [{ type: Schema.Types.ObjectId, ref: "Member" }],
  siblings: [{ type: Schema.Types.ObjectId, ref: "Member" }],
  spouses: [{ type: Schema.Types.ObjectId, ref: "Member" }],
});

const FamilyTreeSchema: Schema = new Schema({
  name: { type: String, required: true },
  members: [MemberSchema],
});

const FamilyTree = mongoose.model<IFamilyTree>("FamilyTree", FamilyTreeSchema);

export default FamilyTree;
