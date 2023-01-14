import { DocumentDefinition } from "mongoose";
import Message, { MessageDocument } from "../model/message.model";

export async function createMessageService(
  input: DocumentDefinition<MessageDocument>
) {
  try {
    return await Message.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}
