import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
    try {
        const { username, email, password } = await request.json();

        // Input validation
        if (!username || username.trim() === "") {
            return new Response(
                JSON.stringify({ success: false, message: "Username is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!email || email.trim() === "") {
            return new Response(
                JSON.stringify({ success: false, message: "Email is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!password || password.trim() === "") {
            return new Response(
                JSON.stringify({ success: false, message: "Password is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        await dbConnect();

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const existingUserVerifyByUsername = await UserModel.findOne({ username, isVerified: true });
        const existingEmailVerifiedByEmail = await UserModel.findOne({ email });

        if (existingUserVerifyByUsername) {
            return Response.json({ success: false, message: "Username already taken" }, { status: 400 });
        }

        if (existingEmailVerifiedByEmail) {
            if (existingEmailVerifiedByEmail.isVerified) {
                return Response.json({ success: false, message: "User already exists with this email" }, { status: 400 });
            } else {
                const hashPassword = await bcrypt.hash(password, 10);
                existingEmailVerifiedByEmail.password = hashPassword;
                existingEmailVerifiedByEmail.verifycode = verifyCode;
                existingEmailVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
                await existingEmailVerifiedByEmail.save();
            }
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashPassword,
                verifycode: verifyCode,
                isVerified: false,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                messages: [],
            });

            await newUser.save();
        }

        // Sending verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse?.success) {
            return Response.json({ success: false, message: emailResponse?.message || "Email sending failed" }, { status: 500 });
        }

        return Response.json({ success: true, message: "User registration successful. Please verify your email." }, { status: 201 });
    } catch (e) {
        console.error("Error while registering user:", e);
        return Response.json({ success: false, message: "Error during registration" }, { status: 500 });
    }
}
