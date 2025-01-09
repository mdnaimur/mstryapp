import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request:Request){
    await dbConnect ();

    try{
       const {username,email,password} = await request.json();
       const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
       const existingUserVerifiedByUsername  = await  UserModel.findOne({username,isVerified:true})
       const existingEmailVerifiedByEmail  = await  UserModel.findOne({email,isVerified:true})
      
      if(existingUserVerifiedByUsername){
        return Response.json({
            success:false,
            message:"Username already taken"},
            {
            status:400
        })
      }

      if(existingEmailVerifiedByEmail){
        if(existingEmailVerifiedByEmail.isVerified)
        {
            return Response.json({
                sucess:false,
                message:"User already exist with this email"
            },{
                status:400,
            })
        }

        else{
            const hashPassword = await bcrypt.hash(password,10);
            existingEmailVerifiedByEmail.password = hashPassword;
            existingEmailVerifiedByEmail.verifyCode  = verifyCode;
            existingEmailVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingEmailVerifiedByEmail.save()
        }
      }

      else{
        const hashPassword = await bcrypt.hash(password,10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours()+1)
        
       const newUser = new UserModel({
                username,
                email,
                password:hashPassword,
                verifyCode:verifyCode,
                isVerified:false,
                verifyCodeExpiry:expiryDate,
                isAcceptingMessage:true,
                messages:[]
        })
        await newUser.save()
      }

      //send verification email

     const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      )

      if (!emailResponse.sucess){
        return Response.json({
            sucess:false,
            message:emailResponse.message
        },{
            status:500,
        })
      }

      return Response.json({
        sucess:true,
        message:"User Registration successfull. Please verify your email"
    },{
        status:201,
    })

    }
    catch(error){
        console.log("Error while registration user",error)
        console.error("Error while registration user",error)
        return Response.json({
            sucess:false,
            message:"Error registraion "
        },
    {
        status:500
    })

    }
}