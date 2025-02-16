import mongoose, { Document, Schema } from "mongoose"

export interface Message extends Document {
    content: string,
    createAT: Date
}


const MessageSchema: Schema<Message> = new Schema({

    content: {
        type: String,
        required: true
    },

    createAT: {
        type: Date,
        required: true,
        default: Date.now
    }

})


export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifycode: string,
    isVerified: boolean,
    verifyCodeExpiry: Date,
    isAcceptingMessage: boolean,
    messages: Message[]
}


const UserSchema: Schema<User> = new Schema({

    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },

    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address']
    },

    password: {
        type: String,
        required: [true, 'Password is required..']
    },

    verifycode: {
        type: String,
        required: [true, "Verify Code is required"],
    },

    verifyCodeExpiry: {
        type: Date,
        required: [true, 'verifycode expiry is required']
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isAcceptingMessage: {
        type: Boolean,
        default: true
    },

    messages: {
        type: [MessageSchema]
    }

})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;