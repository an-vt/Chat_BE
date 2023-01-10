import mongoose from "mongoose";
import MemberSchema, { MemberDocument } from "./member.model";

export interface MessageDocument extends mongoose.Document {
  content: string;
  receivers: MemberDocument[];
  senderUid: string;
  senderName: string;
  type: string;
  roomId: string;
}

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: mongoose.Schema.Types.String,
      require: true,
    },
    receivers: [MemberSchema],
    senderUid: {
      type: mongoose.Schema.Types.String,
      require: true,
    },
    senderName: {
      type: mongoose.Schema.Types.String,
      require: true,
    },
    type: {
      type: mongoose.Schema.Types.String,
      require: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
    },
  },
  { timestamps: true }
);

export default MessageSchema;
