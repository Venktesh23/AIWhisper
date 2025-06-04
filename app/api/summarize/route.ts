import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { rateLimit } from '@/lib/rate-limit';

// Validate environment variables at startup
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY environment variable is required');
  throw new Error('OPENAI_API_KEY is not configured');
}

// Initialize rate limiter with better limits
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20 // Increased from 10 to 20 requests per minute
});

// Initialize OpenAI with proper configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 300000, // Increased to 5 minutes
  maxRetries: 3,
});

// More restrictive CORS for production
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  const headers = {
    ...corsHeaders,
    'Content-Type': 'application/json',
  };

  try {
    // Check rate limit FIRST with request object
    await limiter.check(request);

    // Validate request size early
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1000000) { // 1MB limit
      return NextResponse.json(
        { error: 'Request too large. Maximum size is 1MB.' },
        { status: 413, headers }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400, headers }
      );
    }

    const { endpoint, schemaInfo } = body;

    // Validate required fields
    if (!endpoint || !endpoint.path || !endpoint.method) {
      return NextResponse.json(
        { error: 'Missing required fields: endpoint.path and endpoint.method' },
        { status: 400, headers }
      );
    }

    // Log request for debugging
    console.log('Processing endpoint:', {
      path: endpoint.path,
      method: endpoint.method,
      timestamp: new Date().toISOString()
    });

    // Estimate token count
    const endpointJson = JSON.stringify(endpoint);
    const estimatedTokens = Math.ceil(endpointJson.length / 4) + 1000; // Increased base tokens

    if (estimatedTokens > 6000) { // Increased limit
      return NextResponse.json(
        { error: 'API schema is too large to process. Please try with a smaller schema.' },
        { status: 413, headers }
      );
    }

    // Construct the prompt with validated data
    const prompt = `
You are an expert API technical writer who specializes in making complex APIs accessible to developers of all skill levels. Your goal is to create clear, practical, and beginner-friendly documentation.

API Context:
${schemaInfo?.title ? `API: ${schemaInfo.title}` : ''}
${schemaInfo?.version ? `Version: ${schemaInfo.version}` : ''}
${schemaInfo?.baseUrl ? `Base URL: ${schemaInfo.baseUrl}` : ''}

ENDPOINT DETAILS:
Path: ${endpoint.path}
Method: ${endpoint.method}
${endpoint.summary ? `Summary: ${endpoint.summary}` : ''}
${endpoint.description ? `Description: ${endpoint.description}` : ''}

TECHNICAL SPECIFICATIONS:
${endpoint.parameters?.length > 0 
  ? `Parameters:\n${JSON.stringify(endpoint.parameters, null, 2)}` : 'No parameters required'}
${endpoint.requestBody ? `Request Body:\n${JSON.stringify(endpoint.requestBody, null, 2)}` : ''}
${endpoint.responses ? `Response Format:\n${JSON.stringify(endpoint.responses, null, 2)}` : ''}

Please provide a comprehensive explanation in the following format:

## 🎯 What This API Does
[Explain the purpose of this endpoint in simple, non-technical terms. Focus on what problem it solves or what it helps users accomplish.]

## 💡 When To Use This
[Provide 2-3 real-world scenarios where a developer would want to use this endpoint. Be specific and practical.]

## 📥 What You Need to Send
[Break down all required and optional parameters in plain English]
- Required Parameters: [List each one with a simple explanation]
- Optional Parameters: [List each one with a simple explanation]
${endpoint.requestBody ? '- Request Body: [Explain what data needs to be sent and why]' : ''}

## 📤 What You Get Back
[Explain the response in simple terms]
- Success Response: [Describe what a successful response includes]
- Common Error Cases: [List typical error scenarios and what they mean]

## 🔑 Authentication
[Explain if authentication is needed and what type]

## 🛠️ Integration Example
[Provide a practical example of how to use this endpoint in a real application]

## 🧪 Example Request
\`\`\`javascript
// Example using fetch API
fetch('${endpoint.path}', {
  method: '${endpoint.method}',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }${endpoint.requestBody ? `,
  body: JSON.stringify({
    // Add example request body here
  })` : ''}
});
\`\`\`

## 📋 Example Response
\`\`\`json
// Example response format
${JSON.stringify(endpoint.responses?.['200']?.content?.['application/json']?.schema?.example || {}, null, 2)}
\`\`\`

## 💭 Pro Tips
[Share 1-2 practical tips, common gotchas, or best practices specific to this endpoint]`;

    try {
      console.log('Sending request to OpenAI...');
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert API technical writer who excels at explaining complex APIs in clear, beginner-friendly terms.'
          },
          {
            role: 'user',
            content: `Please analyze this API endpoint and provide a comprehensive explanation:

Path: ${endpoint.path}
Method: ${endpoint.method}
${endpoint.summary ? `Summary: ${endpoint.summary}` : ''}
${endpoint.description ? `Description: ${endpoint.description}` : ''}

Technical Details:
${JSON.stringify({ 
  parameters: endpoint.parameters, 
  requestBody: endpoint.requestBody, 
  responses: endpoint.responses 
}, null, 2)}

Please format your response with clear sections explaining what this endpoint does, how to use it, and provide practical examples.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2500, // Increased token limit
      });

      const summary = completion.choices[0].message.content;
      return NextResponse.json({ summary }, { headers });

    } catch (openaiError: any) {
      console.error('OpenAI API Error:', {
        error: openaiError.message,
        status: openaiError.status,
        code: openaiError.code,
        timestamp: new Date().toISOString()
      });
      
      // Enhanced error handling
      if (openaiError.code === 'rate_limit_exceeded') {
        return NextResponse.json(
          { error: 'OpenAI rate limit exceeded. Please try again in a few moments.' },
          { status: 429, headers }
        );
      }
      
      if (openaiError.code === 'invalid_api_key') {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key configuration.' },
          { status: 500, headers }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to generate summary. Please try again.',
          retryable: true
        },
        { status: openaiError.status || 500, headers }
      );
    }

  } catch (error: any) {
    console.error('Unexpected error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: error.message.includes('Rate limit') 
          ? error.message 
          : 'An unexpected error occurred',
        retryable: !error.message.includes('Rate limit')
      },
      { 
        status: error.message.includes('Rate limit') ? 429 : 500, 
        headers 
      }
    );
  }
}