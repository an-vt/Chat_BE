import mongoose from "mongoose";

export type TYPE_ROOM = "GROUP" | "SELF";
export interface RoomDocument extends mongoose.Document {
  unreadCount: number;
  type: TYPE_ROOM;
}

const RoomSchema = new mongoose.Schema(
  {
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
