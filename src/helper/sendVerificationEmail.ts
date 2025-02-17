import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
import { resend } from "@/lib/resend";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry | Verificaion Code ',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return {
            success: true,
            message: " verification email send successfully"
        }
    }
    catch (emailError) {
        console.error("Error sending verifiction email")
        console.log("Email sending error", emailError)
        return {
            success: false,
            message: "Failed to send to verification email"
        }
    }
}