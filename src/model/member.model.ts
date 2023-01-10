import mongoose from "mongoose";

export type ROLE = "ADMIN" | "MEMBER";
export interface MemberDocument extends mongoose.Document {
  name: String;
  role: ROLE;
}

const MemberSchema = new mongoose.Schema({
  name: String,
  role: String,
});

export default MemberSchema;
