import mongoose from "mongoose";
import MemberSchema, { MemberDocument } from "./member.model";

export type TYPE_ROOM = "GROUP" | "SELF";
export interface RoomDocument {
  members: MemberDocument[];
  unreadCount: number;
  type: TYPE_ROOM;
}

const RoomSchema = new mongoose.Schema(
  {
    members: [MemberSchema],
    unreadCount: {
      type: mongoose.Schema.Types.Number,
      required: true,
      default: 0,
    },
    type: {
      type: mongoose.Schema.Types.String,
      default: "SELF",
    },
  },
  { timestamps: true }
);

export default RoomSchema;
