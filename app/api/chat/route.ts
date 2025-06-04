import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { rateLimit } from '@/lib/rate-limit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000,
  maxRetries: 3,
});

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20 // limit each IP to 20 requests per minute
});

export async function POST(request: Request) {
  try {
    await limiter.check();

    const { message, schema, history } = await request.json();

    if (!message || !schema) {
      return NextResponse.json(
        { error: 'Message and schema are required' },
        { status: 400 }
      );
    }

    // Parse schema to get context
    let parsedSchema;
    try {
      parsedSchema = typeof schema === 'string' ? JSON.parse(schema) : schema;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid schema format' },
        { status: 400 }
      );
    }

    // Create system message with schema context
    const systemMessage = `You are an API expert assistant. You help developers understand and use APIs effectively.

Available API Information:
Title: ${parsedSchema.info?.title || 'API'}
Version: ${parsedSchema.info?.version || 'N/A'}
Description: ${parsedSchema.info?.description || 'No description available'}

You have access to the complete OpenAPI/Swagger schema for this API. When answering questions:
1. Be concise but thorough
2. Include relevant code examples when appropriate
3. Format code blocks with proper syntax highlighting
4. Focus on practical, real-world usage
5. Explain any authentication requirements
6. Highlight important parameters or requirements`;

    // Convert chat history to OpenAI format
    const messages = [
      { role: 'system', content: systemMessage },
      ...history.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);

    if (error.message === 'Rate limit exceeded') {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}