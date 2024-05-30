import { UserModel } from "../models/User";
import { ChatModel, ChatDocument } from "../models/Chat";
import { MessageModel, MessageDocument } from "../models/Message";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { log } from "console";

export async function getMessagesForUserAndChat(
  username: string,
  chatcode: string
  //@ts-ignore
): Promise<{ chat: ChatDocument; messages: MessageDocument[] }> {
  // Find or create the user
  try {
    console.log("sadsadsadsadsad");

    let user = await UserModel.findOne({ username });
    if (!user) {
      user = await UserModel.create({ username });
    }

    // Find or create the chat
    let chat = await ChatModel.findOne({ chatcode: chatcode });
    console.log("cccchat", chat);

    if (!chat) {
      chat = await ChatModel.create({
        participants: [{ userId: user.id, username: user.username }],
        chatname: `Chat for ${chatcode}`,
        chatcode: chatcode,
      });
    }

    // Check if the user is a participant in the chat
    const isParticipant = chat.participants.some(
      (participant) => participant.userId.toString() === user.id.toString()
    );
    if (!isParticipant) {
      // Add the user as a participant in the chat
      chat.participants.push({ userId: user.id, username: user.username });
      await chat.save();
    }

    // Retrieve messages for the chat
    const messages = await MessageModel.find({ chatId: chat._id });

    return { chat, messages };
  } catch (error) {
    console.log(error);
  }
}

export async function saveMessage({
  msg,
  username,
  chatId,
}: {
  msg: string;
  username: string;
  chatId: string;
}): Promise<void> {
  try {
    // Create a new message document
    const chatObjectId = new mongoose.Types.ObjectId(chatId);

    // Create a new message document
    const message = new MessageModel({
      content: msg,
      username,
      chatId: chatObjectId, // Use the converted ObjectId
      timestamp: new Date(), // Assuming you have a timestamp field in your Message schema
    });

    // Save the message to the database
    await message.save();
  } catch (error) {
    console.error("Error saving message to the database:", error.message);
    throw error; // Rethrow the error to handle it in the calling function if needed
  }
}

export async function getAnalytics(req: Request, res: Response): Promise<void> {
  try {
    // Aggregate query to count messages sent by each user
    const messageCounts = await MessageModel.aggregate([
      {
        $group: {
          _id: "$username", // Group by username
          count: { $sum: 1 }, // Count number of messages for each user
        },
      },
    ]);

    // Transform the result to a more readable format
    const analyticsData = messageCounts.map((entry: any) => ({
      username: entry._id,
      messageCount: entry.count,
    }));

    res.json(analyticsData);
  } catch (error) {
    console.error("Error retrieving analytics data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

