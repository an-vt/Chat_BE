import { DocumentDefinition, FilterQuery } from "mongoose";
import Attendee, { AttendeeDocument } from "../model/attendee.model";

export async function updateAttendeeService(
  input: DocumentDefinition<AttendeeDocument>
) {
  try {
    return await Attendee.updateOne(
      { _id: input._id },
      { $push: { rooms: input.rooms } }
    );
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createAttendeeService(
  input: DocumentDefinition<AttendeeDocument>
) {
  try {
    return await Attendee.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getAllRoomByUserService(
  query: FilterQuery<AttendeeDocument>
) {
  try {
    return await Attendee.findOne(query).lean();
  } catch (error: any) {
    throw new Error(error);
  }
}
