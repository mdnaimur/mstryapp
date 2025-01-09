import { Message } from "@/model/User";

export interface ApiRespone {
    sucess:boolean,
    message: string,
    isAcceptingMessages?: boolean,
    messages?:Array<Message>
}