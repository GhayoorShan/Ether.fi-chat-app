import mongoose, { Document, Schema } from "mongoose";

interface UserDocument extends Document {
  username: string;
}

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
});

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export { UserDocument, UserModel };
