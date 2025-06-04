"use client"

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useToast } from '@/hooks/use-toast';

interface TestRequestGeneratorProps {
  endpoint: {
    path: string;
    method: string;
    parameters?: any[];
    requestBody?: any;
  };
}

type Language = 'curl' | 'fetch' | 'axios' | 'python';

const API_KEY = 'YOUR_API_KEY'; // or process.env.NEXT_PUBLIC_API_KEY if you want to use env vars

export default function TestRequestGenerator({ endpoint }: TestRequestGeneratorProps) {
  const [language, setLanguage] = useState<Language>('curl');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateRequestCode = (lang: Language): string => {
    const baseUrl = '${API_BASE_URL}';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${API_KEY}'
    };

    const hasBody = endpoint.requestBody && Object.keys(endpoint.requestBody).length > 0;
    const requestBody = hasBody ? {
      // Example request body based on schema
      ...endpoint.requestBody?.content?.['application/json']?.schema?.example || {}
    } : undefined;

    const queryParams = endpoint.parameters
      ?.filter(p => p.in === 'query')
      .map(p => `${p.name}=${p.example || '{value}'}`)
      .join('&');

    const fullPath = queryParams 
      ? `${endpoint.path}?${queryParams}`
      : endpoint.path;

    switch (lang) {
      case 'curl':
        return `curl -X ${endpoint.method} '${baseUrl}${fullPath}' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer ${API_KEY}'${hasBody ? ` \\
  -d '${JSON.stringify(requestBody, null, 2)}'` : ''}`;

      case 'fetch':
        return `fetch('${baseUrl}${fullPath}', {
  method: '${endpoint.method}',
  headers: ${JSON.stringify(headers, null, 2)}${hasBody ? `,
  body: JSON.stringify(${JSON.stringify(requestBody, null, 2)})` : ''}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;

      case 'axios':
        return `import axios from 'axios';

axios({
  method: '${endpoint.method.toLowerCase()}',
  url: '${baseUrl}${fullPath}',
  headers: ${JSON.stringify(headers, null, 2)}${hasBody ? `,
  data: ${JSON.stringify(requestBody, null, 2)}` : ''}
})
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));`;

      case 'python':
        return `import requests

url = '${baseUrl}${fullPath}'
headers = ${JSON.stringify(headers, null, 2)}${hasBody ? `
payload = ${JSON.stringify(requestBody, null, 2)}

response = requests.${endpoint.method.toLowerCase()}(url, headers=headers, json=payload)` : `

response = requests.${endpoint.method.toLowerCase()}(url, headers=headers)`}
print(response.json())`;

      default:
        return '';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateRequestCode(language));
      setCopied(true);
      toast({
        title: 'Copied to clipboard',
        description: 'The code snippet has been copied to your clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy code to clipboard. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Test this Endpoint</CardTitle>
        <Select
          value={language}
          onValueChange={(value) => setLanguage(value as Language)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="curl">cURL</SelectItem>
            <SelectItem value="fetch">Fetch API</SelectItem>
            <SelectItem value="axios">Axios</SelectItem>
            <SelectItem value="python">Python</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <SyntaxHighlighter
            language={language === 'curl' ? 'bash' : language === 'python' ? 'python' : 'javascript'}
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: '0.5rem',
              fontSize: '0.9rem',
            }}
          >
            {generateRequestCode(language)}
          </SyntaxHighlighter>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}