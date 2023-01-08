import mongoose from "mongoose";
import Message from "./message.model";

export interface RoomDocument extends mongoose.Document {
  messages: string[];
}

const RoomSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  messages: [Message],
});

const Room = mongoose.model<RoomDocument>("Room", RoomSchema);

export default Room;
