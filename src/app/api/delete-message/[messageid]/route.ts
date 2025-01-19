import { User, getServerSession } from "next-auth";

import UserModel from "@/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid
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



    try {
        const updateResponse = await UserModel.updateOne([
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        ]);

        if (updateResponse.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found or aready delete"

                }, {
                status: 404
            }
            )
        }

        return Response.json(
            {
                success: true,
                messages: "Message Deleted"

            }, {
            status: 200
        }
        )
    }

    catch (error) {

        return Response.json(
            {
                success: false,
                message: "Not Authenticated no user found", error

            }, {
            status: 500
        }
        )

    }
}