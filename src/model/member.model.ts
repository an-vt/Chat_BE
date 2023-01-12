import mongoose from "mongoose";
import { RoomDocument } from "./room.model";
import { UserDocument, UserModel, UserSchema } from "./user.model";

export type ROLE = "ADMIN" | "MEMBER";

export interface Member {
  role: ROLE;
  roomId: string;
  user: UserModel;
}
export interface MemberDocument extends mongoose.Document {
  role: ROLE;
  roomId: RoomDocument["_id"];
  user: UserDocument;
}

const MemberSchema = new mongoose.Schema({
  role: String,
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "room",
  },
  user: UserSchema,
});

const Member = mongoose.model<MemberDocument>("Member", MemberSchema);

export default Member;
