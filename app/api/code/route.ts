"use server";
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
});

const instructionMessage: OpenAI.ChatCompletionSystemMessageParam = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
}

export async function POST(req: Request) {
  try {

    const { userId } = auth()

    const body = await req.json()
    const { messages } = body

    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    if (!messages) return new NextResponse("Invalid Request", { status: 400 })

    if (!Array.isArray(messages)) return new NextResponse("Invalid Request", { status: 400 })

    if (!openai.apiKey) return new NextResponse("Internal Error", { status: 500 })

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages],
      max_tokens: 150
    })
    return NextResponse.json(response.choices[0].message, { status: 200 })

  } catch (error) {
    console.log("[Conversation_error]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}