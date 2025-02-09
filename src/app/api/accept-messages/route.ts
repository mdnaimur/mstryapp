import { User, getServerSession } from "next-auth";

import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated no user found"

            }, {
            status: 401
        }
        )
    }

    const userId = user._id;

    const { acceptMessages } = await request.json();

    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updateUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept message"

                }, {
                status: 401
            }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updateUser

            }, {
            status: 200
        }
        )

    }
    catch (error) {
        console.log("failed to update user status to accept message", error);
        return Response.json(
            {
                success: false,
                message: "failed to update user status to accept message"

            }, {
            status: 500
        }
        )
    }

}


export async function GET(request: Request) {

    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated no user found"

            }, {
            status: 401
        }
        )
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"

                }, {
                status: 404
            }
            )
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage

            }, {
            status: 200
        }
        )
    } catch (error) {

        console.log("Error is getting message acceptance", error);
        return Response.json(
            {
                success: false,
                message: "Error is getting message acceptance"

            }, {
            status: 500
        }
        )

    }
}