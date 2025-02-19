import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { usernameValidaton } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username: usernameValidaton
})


export async function GET(request: Request) {

    if (request.method !== 'GET') {
        return Response.json({
            success: false,
            message: "Only GET method allowd"
        },
            {
                status: 405
            }
        )
    }

    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        };

        // validation with zod

        const result = UsernameQuerySchema.safeParse(queryParam);

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || [];
            console.log(usernameError)

            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(', ') : "invalid query parameters"
            },
                {
                    status: 400
                }
            )
        }

        const { username } = result.data;
        const existVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already taken. try another",
            }, {
                status: 201
            })

        }

        return Response.json({
            success: true,
            message: "Username availavle",
        }, {
            status: 201
        })

    } catch (error) {
        console.error("Error Checking username:", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status: 500
            }
        )

    }


}