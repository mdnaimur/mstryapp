import { openai } from '@ai-sdk/openai';
import { streamText, OpenAIStream, StreamTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';




// Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const result = streamText({
//     model: openai('gpt-4o'),
//     messages,
//   });

//   return result.toDataStreamResponse();
// }



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// set the runtime to edge for best performance

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        // const { message } = await req.json();

        const promot = "create a list of three onpen-ended and engaing questions formatted as a single string. Each question should beseparated by '||' Each Quesion are for an anonymous social messaing paltform,like qooh.me,and should besuitable for diverse audience. Avoid personal or sensitive topics,focusing instead on universal themes that encourage friendly interation."

        // Ask OpenAi for a streaming chat completion given the promt

        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            max_tokens: 400,
            stream: true,
            prompt
        });

        const stream = OpenAIStream(response);

        return StreamTextResponse(stream);
    } catch (error) {

        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;
            return NextResponse.json({
                name, headers, message

            }, { status })

        }

        else {
            console.log("Unexpectd error occured ", error)
            throw error
        }

    }

}