import { DocumentDefinition } from "mongoose";
import Attendee, { AttendeeDocument } from "../model/attendee.model";

export async function update(input: DocumentDefinition<AttendeeDocument>) {
  try {
    return await Attendee.updateOne(
      { _id: input._id },
      { $push: { rooms: input.rooms } }
    );
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createChat(input: DocumentDefinition<AttendeeDocument>) {
  try {
    return await Attendee.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

// export async function findUser(query: FilterQuery<UserDocument>) {
//   return User.findOne(query).lean();
// }

// export async function updateUser(id: string, data: Partial<UserDocument>) {
//   return User.findByIdAndUpdate(id, data);
// }

// export async function findAllUser(id: string) {
//   return await User.find({ _id: { $ne: id } }).select([
//     "email",
//     "username",
//     "avatarImage",
//     "_id",
//   ]);
// }

// export async function validatePassword({
//   email,
//   password,
// }: {
//   email: UserDocument["email"];
//   password: string;
// }) {
//   const user = await User.findOne({ email });

//   if (!user) {
//     return false;
//   }

//   const isValid = await user.comparePassword(password);

//   if (!isValid) {
//     return false;
//   }

//   return omit(user.toJSON(), "password");
// }
