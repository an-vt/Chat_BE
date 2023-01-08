import mongoose, { Schema } from "mongoose";
import Member from "./attendeeRoom.model";

export interface AttendeeDocument extends mongoose.Document {
  rooms: string[];
}

const AttendeeSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  rooms: [Member],
});

const Attendee = mongoose.model<AttendeeDocument>("Attendee", AttendeeSchema);

export default Attendee;
