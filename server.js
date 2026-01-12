const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
require('dotenv').config({ override: true });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const reviewers = [
    { name: "Marcus Thorne", style: "precise, pathologically obsessed with decimal ratings and technical minutiae" },
    { name: "Diana Castellano", style: "philosophical, references Heidegger and Derrida, overthinks design choices" },
    { name: "Jamie Kowalski", style: "brooklyn hipster, personal anecdotes about exes named Jake, neurotic energy" },
    { name: "Sam Chen", style: "ruthless, zero patience for bullshit, devastatingly concise" },
    { name: "Alex Reeves", style: "gonzo journalism, caffeinated chaos, banned from multiple Slack workspaces" },
    { name: "Ben Thompson", style: "strategic aggregation - dissects business models and competitive moats with surgical precision" },
    { name: "Jia Tolentino", style: "cultural criticism - weaves personal experience with broader societal implications and internet culture" },
    { name: "Kara Swisher", style: "no-bullshit interrogator - cuts through marketing speak with direct questions and tech industry cynicism" },
    { name: "David Foster Wallace", style: "maximalist footnotes and nested clauses - obsessive attention to minutiae wrapped in self-aware verbosity" },
    { name: "Lester Bangs", style: "raw emotional honesty - manic energy, stream of consciousness, zero pretense" },
    { name: "Richard Meltzer", style: "absurdist deconstruction - deliberately obscure, aggressively anti-establishment, treats criticism as performance art" },
    { name: "Nick Sylvester", style: "personal narratives that barely relate to the subject, weird tangents, genuine hostility masked as confession" },
    { name: "Brent DiCrescenzo", style: "overwrought metaphors, compares websites to post-rock albums, surprisingly vulnerable" },
    { name: "Ryan Schreiber", style: "authoritative yet cautious, references indie web aesthetics, historically minded" },
    { name: "Mark Richardson", style: "workmanlike prose, unexpected depth, focuses on context and influence" },
    { name: "Ryan Dombal", style: "conversational but smart, pop culture references, millennial perspective" },
    { name: "Jessica Hopper", style: "feminist lens, punk rock ethos, calls out industry bullshit with receipts" },
    { name: "Simon Reynolds", style: "theoretical frameworks, genre taxonomy obsession, British intellectualism" },
    { name: "Ann Powers", style: "empathetic analysis, connects tech to lived experience, maternal wisdom energy" },
    { name: "Greil Marcus", style: "American studies professor vibes, connects everything to Dylan and democracy" },
    { name: "Robert Christgau", style: "consumer guide terseness, letter grades mentality, curmudgeonly charm" },
    { name: "Ellen Willis", style: "second-wave feminism meets rock criticism, political without being preachy" },
    { name: "Phoebe Bridgers", style: "sad girl indie aesthetics, references therapy and LA, disarmingly honest" },
    { name: "Frank Ocean", style: "stream of consciousness luxury minimalism, references Tumblr era internet" },
    { name: "Ezra Koenig", style: "prep school intellectualism, references semiotics and The Simpsons equally" },
    { name: "Questlove", style: "encyclopedic knowledge, connects tech to music history, optimistic but discerning" },
    { name: "Kim Gordon", style: "downtown NYC art scene energy, cool detachment, sees through pretension" },
    { name: "Thurston Moore", style: "avant-garde appreciation, values experimentation, slightly unhinged enthusiasm" },
    { name: "Carrie Brownstein", style: "sardonic wit, Pacific Northwest sensibility, observational comedy meets criticism" },
    { name: "St. Vincent", style: "art pop intellectualism, fascinated by artifice and performance, playfully dark" }
];

const categories = [
    "SaaS", "Productivity", "Developer Tools", "AI Platform", "Design Tools",
    "E-commerce", "Database", "Analytics", "Payments", "Infrastructure",
    "Communication", "Project Management", "CRM", "Marketing", "Security",
    "Social Media", "Content Management", "Collaboration", "Education", "Finance"
];

function getReviewer() {
    return reviewers[Math.floor(Math.random() * reviewers.length)];
}

function generateRating() {
    // Generate rating between 3.0 and 7.5 with random decimals
    const base = 3.0 + Math.random() * 4.5;
    const rating = Math.round(base * 10) / 10;
    return Math.max(3.0, Math.min(7.5, rating));
}

function extractDomain(url) {
    try {
        const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return url;
    }
}

async function scrapeWebsite(url) {
    try {
        const fullUrl = url.startsWith('http') ? url : 'https://' + url;
        const response = await axios.get(fullUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);

        // Remove script and style elements
        $('script, style, noscript').remove();

        // Extract text content
        const title = $('title').text().trim();
        const metaDescription = $('meta[name="description"]').attr('content') || '';
        const h1s = $('h1').map((i, el) => $(el).text().trim()).get().join(' | ');
        const h2s = $('h2').map((i, el) => $(el).text().trim()).get().slice(0, 5).join(' | ');

        // Get main content (first few paragraphs)
        const paragraphs = $('p').map((i, el) => $(el).text().trim()).get()
            .filter(p => p.length > 50)
            .slice(0, 10)
            .join('\n');

        // Try to find pricing mentions
        const bodyText = $('body').text();
        const pricingKeywords = ['pricing', 'plans', 'price', '$', 'free', 'trial', 'subscribe'];
        const hasPricing = pricingKeywords.some(keyword =>
            bodyText.toLowerCase().includes(keyword)
        );

        return {
            title,
            metaDescription,
            h1s,
            h2s,
            paragraphs,
            hasPricing,
            url: fullUrl
        };
    } catch (error) {
        console.error('Scraping error:', error.message);
        return null;
    }
}

app.post('/api/generate-review', async (req, res) => {
    try {
        const { url, name, reviewer: reviewerName } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const domain = extractDomain(url);
        const websiteName = name || domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);

        // Scrape the website
        console.log('Scraping website:', url);
        const scrapedData = await scrapeWebsite(url);

        // Use specified reviewer or random
        let reviewer;
        if (reviewerName) {
            reviewer = reviewers.find(r => r.name === reviewerName);
            if (!reviewer) {
                reviewer = getReviewer(); // Fallback to random if name not found
            }
        } else {
            reviewer = getReviewer();
        }

        const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const rating = generateRating();

        // Create the prompt for Claude
        const websiteInfo = scrapedData ? `
Website Content:
- Title: ${scrapedData.title}
- Meta Description: ${scrapedData.metaDescription}
- Main Headlines: ${scrapedData.h1s}
- Subheadlines: ${scrapedData.h2s}
- Key Content: ${scrapedData.paragraphs.substring(0, 1000)}
- Has Pricing Info: ${scrapedData.hasPricing ? 'Yes' : 'No'}
` : 'Unable to scrape website content - generate based on URL and name only.';

        const prompt = `You are ${reviewer.name}, a writer for DOTFORK - a website that reviews modern dot-com websites in the style of early 2000s Pitchfork music reviews. Your writing style is: ${reviewer.style}.

Write a brutally honest review of ${websiteName} (${url}).

${websiteInfo}

CRITICAL REQUIREMENTS:
1. Rating: You are assigning this site a rating of ${rating}/10. Write a review that justifies THIS SPECIFIC rating.
   - If rating is 6.5-7.5: This is a GOOD site. Find genuine positives while still being critical where warranted.
   - If rating is 5.5-6.4: This is DECENT but flawed. Mixed bag of good and bad.
   - If rating is 4.5-5.4: This is MEDIOCRE. More problems than strengths, but not terrible.
   - If rating is 3.5-4.4: This is BAD. Be harsh and negative, point out major flaws.
   - If rating is below 3.5: This is TERRIBLE. Savage takedown.
   Your tone and critique should match the rating ${rating}/10
2. Length: Write exactly 4 paragraphs of 150-200 words each (NOT 5 paragraphs)
3. Style: Embody YOUR unique voice (${reviewer.name}) - personal, honest, weird tangents, genuine opinions
4. Voice: First person for most reviewers, swearing is fine when appropriate, self-aware
5. No formulas: Every review should feel unique. Don't follow templates. VARY YOUR OPENING STRATEGIES.
6. Be specific: QUOTE directly from the website content above. Put quotes in quotation marks and mock them.
7. Categories to critique: pricing (if mentioned), design choices, UX decisions, marketing copy, the general vibe
8. Match your persona: If you're ${reviewer.name}, write EXACTLY how they would - use their signature moves, their obsessions, their perspective

OPENING SENTENCE VARIETY - NEVER REPEAT THESE BANNED PHRASES:
❌ BANNED: "There's something deeply..."
❌ BANNED: "There's something profoundly..."
❌ BANNED: "There's something [adverb]..."
❌ BANNED: "Look, I..."
❌ BANNED: "I spent [time] on..."
❌ BANNED: "I'm sitting here at [time]..."
❌ BANNED: "Picture this..."
❌ BANNED: "The first thing..."
❌ BANNED: "Landing on..."
❌ BANNED: "Visiting..."
❌ BANNED: "I remember..."

✓ INSTEAD, START WITH:
- A direct quote from the website content and immediately mock it
- A specific observation or concrete detail
- A comparison that catches people off guard
- A bold statement or hot take
- Jump straight into the critique without preamble
- Start with a contradiction or paradox
- Start with what you heard/read about them
- Start with the verdict and work backwards
- Start with a rhetorical question that isn't cliché
- Start with an unusual time/place reference that's specific
- EVERY opening must feel completely different - randomize your approach

Structure (but make it feel natural, not formulaic):
- Opening: VARIED approach - quote their copy, ask questions, make declarations, whatever fits YOUR voice
- Middle paragraphs: Actual critique with SPECIFIC QUOTES from their website content
- Ending: Honest conclusion that feels true to your voice

At the end, provide a one-line VERDICT that's cynical and specific.

Format your response EXACTLY like this:
CATEGORY: [pick the most relevant: SaaS, Productivity, Developer Tools, AI Platform, Design Tools, E-commerce, Database, Analytics, Payments, Infrastructure, Communication, Project Management, CRM, Marketing, Security, Social Media, Content Management, Collaboration, Education, or Finance]
PITHY_CATEGORY: [a short, snarky 2-4 word description like "Productivity Theater", "Design Flex", "API Worship", "Marketing Speak Generator", etc.]
FOUNDED: [year founded if you can infer it, or "Unknown"]
REVIEW_START
[Your 4 paragraphs here - remember to QUOTE from the website]
REVIEW_END
VERDICT: [one cynical sentence]`;

        console.log('Calling Claude API...');
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2500,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        const response = message.content[0].text;

        // Parse the response
        const categoryMatch = response.match(/CATEGORY:\s*(.+)/);
        const pithyCategoryMatch = response.match(/PITHY_CATEGORY:\s*(.+)/);
        const foundedMatch = response.match(/FOUNDED:\s*(.+)/);
        const reviewMatch = response.match(/REVIEW_START\n([\s\S]+?)\nREVIEW_END/);
        const verdictMatch = response.match(/VERDICT:\s*(.+)/);

        // Use the pre-generated rating
        const category = categoryMatch ? categoryMatch[1].trim() : 'SaaS';
        const pithyCategory = pithyCategoryMatch ? pithyCategoryMatch[1].trim() : 'Digital Product';
        const founded = foundedMatch ? foundedMatch[1].trim() : 'Unknown';
        const reviewText = reviewMatch ? reviewMatch[1].trim() : response;
        const verdict = verdictMatch ? verdictMatch[1].trim() : 'Another website that exists.';

        // Split review into paragraphs
        const paragraphs = reviewText.split('\n\n').filter(p => p.trim().length > 0);

        res.json({
            title: websiteName,
            url: url,
            category: category,
            pithyCategory: pithyCategory,
            founded: founded,
            reviewer: reviewer.name,
            date: date,
            rating: rating,
            isBNW: rating >= 8.5,
            paragraphs: paragraphs,
            verdict: verdict
        });

    } catch (error) {
        console.error('Error generating review:', error);
        res.status(500).json({
            error: 'Failed to generate review',
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`DOTFORK server running on http://localhost:${PORT}`);
    console.log('Make sure to set ANTHROPIC_API_KEY in your .env file');
});
