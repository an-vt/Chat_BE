import mongoose from "mongoose";
import MemberSchema, { RoomDocument } from "./room.model";

export interface AttendeeDocument extends mongoose.Document {
  _id: string;
  rooms: RoomDocument[];
}

const AttendeeSchema = new mongoose.Schema({
  rooms: [MemberSchema],
});

const Attendee = mongoose.model<AttendeeDocument>("Attendee", AttendeeSchema);

export default Attendee;
