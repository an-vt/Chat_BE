import { DocumentDefinition } from "mongoose";
import Member, { MemberDocument } from "../model/member.model";

export async function addMemberService(
  input: DocumentDefinition<MemberDocument>
) {
  try {
    return await Member.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}