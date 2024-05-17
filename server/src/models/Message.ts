import mongoose, { Schema, Document } from "mongoose";

interface Message {
  username: string;
  chatid: Schema.Types.ObjectId;
  content: string;
}

interface MessageDocument extends Message, Document {}

const messageSchema = new Schema<MessageDocument>({
  username: { type: String, required: true },
  content: { type: String, required: true },
  chatid: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
});

const MessageModel = mongoose.model<MessageDocument>("Message", messageSchema);

export { Message, MessageDocument, MessageModel };
