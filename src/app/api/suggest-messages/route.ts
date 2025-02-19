import { OpenAIStream, StreamTextResponse } from 'ai';

import { NextResponse } from 'next/server';
import OpenAi from 'openai';

const openai = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        // const { message } = await req.json();

        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. Each question is for an anonymous social messaging platform, like qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.";

        // Ask OpenAI for a streaming chat completion given the prompt
        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            max_tokens: 400,
            stream: true,
            prompt
        });

        const stream = OpenAIStream(response);
        return StreamTextResponse(stream);
    } catch (error) {
        if (error instanceof OpenAi.APIError) {
            const { name, status, headers, message } = error;
            return NextResponse.json({ name, headers, message }, { status });
        } else {
            console.error("Unexpected error occurred:", error);
            throw error;
        }
    }
}
