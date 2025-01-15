import UserModel, { Message } from "@/model/User"

import dbConnect from "@/lib/dbConnect"

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: " no user found"

                }, {
                status: 404
            }
            )
        }

        //is user accepting messages

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "user not accepting the messages"

                }, {
                status: 403
            }
            )
        }

        const newMessage = { content, createAt: new Date() };
        user.messages.push(newMessage as Message);

        await user.save();

        return Response.json(
            {
                success: true,
                message: "Message sent successfully"

            }, {
            status: 200
        }
        )

    } catch (error) {
        console.log("some error inside message sent", error)
        return Response.json(
            {
                success: false,
                message: "Not Authenticated no user found"

            }, {
            status: 500
        }
        )

    }
}