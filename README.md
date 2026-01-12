# DOTFORK

A 1999 Pitchfork-style review site for modern dot-com websites with AI-powered review generation.

## Features

- 10 hand-written reviews of real websites in brutally honest Pitchfork style
- AI-powered review generator that actually visits websites and analyzes them
- Reviews written by Claude AI in the style of early 2000s music criticism
- 2014 Pitchfork aesthetic with clean design

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

Create a `.env` file in the root directory and add your Anthropic API key:

```bash
echo "ANTHROPIC_API_KEY=sk-ant-your-actual-key-here" > .env
```

**IMPORTANT**: Replace `sk-ant-your-actual-key-here` with your real API key from https://console.anthropic.com/

To verify it's set correctly:
```bash
cat .env
# Should show: ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Start the Server

```bash
node server.js
```

The server will start on http://localhost:3000

### 4. View the Site

Open your browser and go to:
- http://localhost:3000 - Homepage
- http://localhost:3000/generator.html - AI Review Generator

## How It Works

1. Enter any website URL into the generator
2. The backend scrapes the website content (title, descriptions, headlines, etc.)
3. Claude AI analyzes the content and generates a Pitchfork-style review
4. Reviews are brutally honest, personal, and unique every time
5. Ratings range from 4.5-8.0 (mostly 5-7 for harsh realism)

## Review Style

Reviews are written in the style of Nick Sylvester and Brent DiCriscio's Pitchfork reviews:
- First-person narratives with personal anecdotes
- Weird tangents and cultural commentary
- Genuine hostility and neurosis
- Specific critiques of pricing, design, UX
- No formulaic patterns - every review is unique

## Architecture

- **Frontend**: Pure HTML/CSS with table-based layouts (authentic 1999 style)
- **Backend**: Node.js + Express
- **AI**: Claude Sonnet 4 via Anthropic API
- **Scraping**: Axios + Cheerio for content extraction

## Files

- `server.js` - Express backend with Claude AI integration
- `generator-ai.js` - Frontend JavaScript for API calls
- `generator.html` - Review generator page
- `reviews/*.html` - Hand-written reviews
- `styles.css` - 2014 Pitchfork aesthetic

## Generating All 400 Reviews

After setting up your API key, generate all 400 reviews:

```bash
# Generate all 400 reviews (takes ~10-15 minutes)
node generate-reviews.js

# After completion, build the archive page
node build-archive.js
```

This will create:
- 400 individual HTML review files in `/reviews/`
- `all-reviews.json` with all review data
- Updated `archive.html` organized by category

## Cost & Performance

- **Live Generator**: ~$0.02-0.05 per review
- **Batch Generation** (400 reviews): ~$10-20 total
- **Time**: 10-15 minutes for all 400 reviews (rate-limited to ~50/minute)
- **Model**: Claude Sonnet 4

## Website List

The 400 reviews include:
- **YC Companies**: Supabase, Brex, Mercury, Deel, Gusto, PostHog, Clerk, Convex, etc.
- **NYC Startups**: Ramp, Runway, Tandem, etc.
- **Popular Tools**: OpenAI, Anthropic, Linear, Figma, Notion, Stripe, Vercel, etc.
- **Classic Sites**: Amazon, eBay, WordPress, PayPal, LinkedIn, Reddit, etc.

Organized across 20 categories: AI Platform, Developer Tools, Design Tools, Productivity, Communication, Payments, E-commerce, CRM & Sales, Analytics, Marketing, Social Media, Project Management, Content Management, Security, Database, Infrastructure, Finance, Education.
