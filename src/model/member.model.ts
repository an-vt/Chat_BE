import mongoose from "mongoose";

export interface MemberDocument extends mongoose.Document {
  name: String;
}

const MemberSchema = new mongoose.Schema({
  name: String,
});

const Member = mongoose.model<MemberDocument>("Member", MemberSchema);

export default Member;
