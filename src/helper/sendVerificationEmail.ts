import { ApiRespone } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
import { resend } from "@/lib/resend";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiRespone> {

    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry | Verificaion Code ',
            react: VerificationEmail({username,otp:verifyCode}),
            });

        return{
            sucess:true,
            message:" verification email send successfully"
        }
        
    } catch (emailError) {
        console.error("Error sending verifiction email")
        console.log("Email sending error",emailError)
        return{
            sucess:false,
            message:"Failed to send to verification email"
        }
        
    }

}