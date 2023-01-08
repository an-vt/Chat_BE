import mongoose from "mongoose";
import Member from "./member.model";

export interface AttendeeRoomDocument extends mongoose.Document {
  partnerName: String;
  role: "ADMIN" | "MEMBER";
}

const AttendeeRoomSchema = new mongoose.Schema(
  {
    members: [Member],
    unreadCount: {
      type: mongoose.Schema.Types.Number,
      required: true,
      default: 0,
    },
    role: {
      type: mongoose.Schema.Types.String,
      default: "MEMBER",
    },
    type: {
      type: mongoose.Schema.Types.String,
      default: "SELF",
    },
  },
  { timestamps: true }
);

const AttendeeRoom = mongoose.model<AttendeeRoomDocument>(
  "AttendeeRoom",
  AttendeeRoomSchema
);

export default AttendeeRoom;
