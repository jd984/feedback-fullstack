import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifyCodeValidation } from "@/schemas/verifyCodeSchema";
import { z } from "zod";

const verifyCodeQuerySchema = z.object({
  verificationCode: verifyCodeValidation,
});

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const result = verifyCodeQuerySchema.safeParse({ verificationCode: code });

    if (!result.success) {
      const verifyCodeErrors =
        result.error.format().verificationCode?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            verifyCodeErrors.length > 0
              ? verifyCodeErrors.join(",")
              : "Invalid verification code",
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 201 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired, please signup again",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
