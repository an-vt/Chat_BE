import mongoose from "mongoose";

export interface MessageDocument extends mongoose.Document {
  messages: string[];
  content: string;
  receivers: string[];
  senderUid: string;
  senderName: string;
  type: string;
}

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: mongoose.Schema.Types.String,
      require: true,
    },
    receivers: {
      type: mongoose.Schema.Types.Array,
      require: true,
      default: [],
    },
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
  },
  { timestamps: true, collection: "message" }
);

const Message = mongoose.model<MessageDocument>("Message", MessageSchema);

export default Message;
