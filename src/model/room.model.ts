import mongoose from "mongoose";

export type TYPE_ROOM = "GROUP" | "SELF";
export interface RoomDocument extends mongoose.Document {
  name: string;
  unreadCount: number;
  type: TYPE_ROOM;
  lastUpdatedTimestamp: Date;
}

const RoomSchema = new mongoose.Schema({
  name: String,
  unreadCount: {
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0,
  },
  type: {
    type: mongoose.Schema.Types.String,
    default: "SELF",
  },
  lastUpdatedTimestamp: {
    type: mongoose.Schema.Types.Date,
    require: true,
  },
});

export default RoomSchema;
