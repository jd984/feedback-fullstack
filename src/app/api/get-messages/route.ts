import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user?._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } }, // matches the user from the multiple users stored in DB
      { $unwind: "$messages" }, // It will add id and user in individual messages and convert it into objects from array
      { $sort: { "messages.createdAt": -1 } }, // It will sort by in ascending order using createdAt field
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("An unexpected error in get messages: ", error);
    return Response.json(
      {
        success: false,
        message: "An unexpected error in get messages",
      },
      { status: 500 }
    );
  }
}
