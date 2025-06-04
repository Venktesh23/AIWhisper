import OpenAI from 'openai';
import { rateLimit } from './rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15 // Slightly increased limit
});

// Simple in-memory cache for summaries
const summaryCache = new Map<string, { summary: string; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export interface Endpoint {
  path: string;
  method: string;
  summary?: string;
  description?: string;
  parameters?: any[];
  requestBody?: any;
  responses?: Record<string, any>;
}

export function parseOpenApiSchema(schema: any): Endpoint[] {
  try {
    const endpoints: Endpoint[] = [];
    const paths = schema.paths || {};

    Object.entries(paths).forEach(([path, pathItem]: [string, any]) => {
      Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
        if (['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(method)) {
          endpoints.push({
            path,
            method: method.toUpperCase(),
            summary: operation.summary,
            description: operation.description,
            parameters: operation.parameters,
            requestBody: operation.requestBody,
            responses: operation.responses,
          });
        }
      });
    });

    return endpoints;
  } catch (error) {
    console.error('Error parsing OpenAPI schema:', error);
    return [];
  }
}

const systemPrompt = `You are an expert API documentation generator. Create comprehensive, human-friendly documentation that helps developers understand and use APIs effectively.

For each endpoint, provide:

1. **Clear Purpose**: What this endpoint does in simple terms
2. **Parameters**: Required and optional parameters with examples
3. **Response Format**: What the API returns
4. **Usage Examples**: Code samples in multiple languages
5. **Real-World Usage Walkthrough**: Show how this endpoint fits into real applications

## 🧭 Real-World Usage Walkthrough
For each endpoint, explain how it would be used in a real-world application scenario. For example:
- For a user registration endpoint: "In a social media app, this would be called when someone clicks 'Sign Up', after they've filled out the form and agreed to terms"
- For a payment endpoint: "In an e-commerce app, this triggers after the user clicks 'Place Order' and processes their payment information"
- For a search endpoint: "This runs every time a user types in the search bar, providing real-time results as they type"

Include the chronological flow of how this endpoint connects to other endpoints in a typical user journey.

Format the response in clean Markdown with clear headings, code blocks, and examples.`;

async function generateSummaryWithRetry(endpoint: Endpoint, schemaInfo: any, maxRetries = 3): Promise<string> {
  // Create cache key
  const cacheKey = `${endpoint.method}-${endpoint.path}-${JSON.stringify(endpoint).substring(0, 100)}`;
  
  // Check cache first
  const cached = summaryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Returning cached summary for:', cacheKey);
    return cached.summary;
  }

  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await limiter.check();
      
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint,
          schemaInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the successful result
      summaryCache.set(cacheKey, {
        summary: data.summary,
        timestamp: Date.now()
      });
      
      return data.summary;
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`Attempt ${attempt}/${maxRetries} failed:`, lastError.message);
      
      // Don't retry on rate limit errors, wait instead
      if (lastError.message.includes('Rate limit')) {
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
        }
        continue;
      }
      
      // For other errors, wait briefly before retry
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  // All retries failed
  throw lastError || new Error('Failed to generate summary after retries');
}

export async function generateSchemaDocumentation(schema: any): Promise<{
  endpoints: Endpoint[];
  summaries: Record<string, string>;
}> {
  try {
    if (typeof schema === 'string') {
      try {
        schema = JSON.parse(schema);
      } catch (error) {
        throw new Error('Invalid JSON schema format');
      }
    }

    const endpoints = parseOpenApiSchema(schema);

    if (endpoints.length === 0) {
      throw new Error('No valid endpoints found in the schema');
    }

    const summaries: Record<string, string> = {};
    const schemaInfo = {
      title: schema.info?.title,
      version: schema.info?.version,
      baseUrl: schema.servers?.[0]?.url,
    };

    // Process endpoints in smaller batches to avoid overwhelming the API
    const batchSize = 2; // Reduced batch size
    for (let i = 0; i < endpoints.length; i += batchSize) {
      const batch = endpoints.slice(i, i + batchSize);

      const promises = batch.map(async (endpoint) => {
        const key = `${endpoint.method} ${endpoint.path}`;
        
        try {
          const summary = await generateSummaryWithRetry(endpoint, schemaInfo);
          return { key, summary };
        } catch (error) {
          console.error(`Failed to generate summary for ${key}:`, error);
          return {
            key,
            summary: `⚠️ Failed to generate summary for this endpoint.

Error: ${error instanceof Error ? error.message : 'Unknown error'}

Please try regenerating the documentation or check your network connection.`
          };
        }
      });

      const results = await Promise.allSettled(promises);

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { key, summary } = result.value;
          summaries[key] = summary;
        }
      });

      // Longer delay between batches
      if (i + batchSize < endpoints.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return {
      endpoints,
      summaries,
    };
  } catch (error) {
    console.error('Error generating schema documentation:', error);
    throw error instanceof Error ? error : new Error('Failed to generate documentation');
  }
}

// Clean up old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, cached] of summaryCache) {
    if (now - cached.timestamp > CACHE_DURATION) {
      summaryCache.delete(key);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour
