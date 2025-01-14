import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})


export async function GET(request: Request) {

    console.log(`[DEBUG]::: Received request with method: ${request.method}`);

    //TODO: use this in all other routes
    if (request.method !== 'GET') {
        return Response.json({
            success: false,
            message: "only GET method allowd ",
        }, {
            status: 405
        })
    }

    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        };

        // validation with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result); //TODO:remove

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];

            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "invalid query parameters",
            }, {
                status: 400
            })

        }

        const { username } = result.data;
        console.log("usename in [DEBUG]:", username); // TODO: remove
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already taken",
            }, {
                status: 409
            })
        }

        return Response.json({
            success: true,
            message: "Username availavle ",
        }, {
            status: 201
        })

    }

    catch (error) {
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