import mongoose, { Document, Schema } from "mongoose";

interface ChatParticipant {
  userId: Schema.Types.ObjectId;
  username: string;
}

interface ChatDocument extends Document {
  participants: ChatParticipant[];
  chatname: string;
  chatcode: string;
}

const chatSchema = new Schema<ChatDocument>({
  participants: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      username: { type: String, required: true },
    },
  ],
  chatname: { type: String, required: true },
  chatcode: { type: String, required: true, unique: true },
});

const ChatModel = mongoose.model<ChatDocument>("Chat", chatSchema);

export { ChatDocument, ChatModel };
