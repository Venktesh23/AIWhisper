# API Whisper

Transform your OpenAPI specifications into human-friendly documentation using AI.

## Features

- Upload OpenAPI/Swagger schemas via file or direct paste
- AI-powered documentation generation using OpenAI
- Interactive AI assistant for API questions
- API metrics dashboard and analytics
- Schema history management
- User authentication with Supabase
- Responsive web interface

## Tech Stack

- Next.js 13+ with TypeScript
- Supabase (Authentication & Database)
- OpenAI API (Documentation Generation)
- Tailwind CSS (Styling)
- Framer Motion (Animations)

## Setup Instructions

### Prerequisites

- Node.js v18+
- Supabase account
- OpenAI API key

### Installation

1. **Clone and install**
```bash
git clone https://github.com/your-username/api-whisper.git
cd api-whisper
npm install
```

2. **Environment variables**

Create `.env.local` in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Database setup**

Run the SQL migration from `supabase/migrations/20250603151845_bold_union.sql` in your Supabase dashboard SQL Editor.

4. **Start development server**
```bash
npm run dev
```

Visit http://localhost:3000

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for documentation generation |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## License

MIT License - see LICENSE file for details.