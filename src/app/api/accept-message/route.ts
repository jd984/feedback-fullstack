import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
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

  const userId = user?._id;
  const { acceptMessage } = await request.json();
  try {
    const updatedUSer = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );

    if (!updatedUSer) {
      return Response.json(
        {
          success: false,
          message: "Failed to updated the user status to accept message",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to updated the user status to accept message");
    return Response.json(
      {
        success: false,
        message: "Failed to updated the user status to accept message",
      },
      { status: 500 }
    );
  }
}

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

  const userId = user?._id;
  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error is getting message acceptance status");
    return Response.json(
      {
        success: false,
        message: "Error is getting message acceptance status",
      },
      { status: 500 }
    );
  }
}
