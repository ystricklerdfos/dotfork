// Script to generate creator economy platform reviews
// Run with: node generate-creator-economy.js

const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ override: true });

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const reviewers = [
    { name: "Marcus Thorne", style: "precise" },
    { name: "Diana Castellano", style: "philosophical" },
    { name: "Jamie Kowalski", style: "brooklyn" },
    { name: "Sam Chen", style: "ruthless" },
    { name: "Alex Reeves", style: "gonzo" },
    { name: "Ben Thompson", style: "strategic aggregation - dissects business models and competitive moats with surgical precision" },
    { name: "Jia Tolentino", style: "cultural criticism - weaves personal experience with broader societal implications and internet culture" },
    { name: "Kara Swisher", style: "no-bullshit interrogator - cuts through marketing speak with direct questions and tech industry cynicism" },
    { name: "David Foster Wallace", style: "maximalist footnotes and nested clauses - obsessive attention to minutiae wrapped in self-aware verbosity" },
    { name: "Lester Bangs", style: "raw emotional honesty - manic energy, stream of consciousness, zero pretense" },
    { name: "Richard Meltzer", style: "absurdist deconstruction - deliberately obscure, aggressively anti-establishment, treats criticism as performance art" }
];

// Load existing scores to avoid duplicates
function getExistingScores() {
    try {
        const allReviews = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-reviews.json'), 'utf8'));
        return allReviews.map(r => r.rating);
    } catch {
        return [];
    }
}

// Creator economy platforms
const websites = [
    // Top tier creator tools
    { name: "Patreon", url: "patreon.com", category: "Creator Economy", reviewer: 0, expectedRange: "mid-high" },
    { name: "Substack", url: "substack.com", category: "Creator Economy", reviewer: 1, expectedRange: "good" },
    { name: "Gumroad", url: "gumroad.com", category: "Creator Economy", reviewer: 2, expectedRange: "good" },
    { name: "Ko-fi", url: "ko-fi.com", category: "Creator Economy", reviewer: 3, expectedRange: "mid" },
    { name: "Teachable", url: "teachable.com", category: "Creator Economy", reviewer: 4, expectedRange: "mid" },
    { name: "Podia", url: "podia.com", category: "Creator Economy", reviewer: 5, expectedRange: "good" },
    { name: "ConvertKit", url: "convertkit.com", category: "Creator Economy", reviewer: 6, expectedRange: "mid-high" },
    { name: "Beehiiv", url: "beehiiv.com", category: "Creator Economy", reviewer: 7, expectedRange: "good" },
    { name: "Ghost", url: "ghost.org", category: "Creator Economy", reviewer: 8, expectedRange: "top" },
    { name: "Buy Me a Coffee", url: "buymeacoffee.com", category: "Creator Economy", reviewer: 9, expectedRange: "mid" },
    { name: "Linktree", url: "linktr.ee", category: "Creator Economy", reviewer: 10, expectedRange: "low" },
    { name: "Stan Store", url: "stan.store", category: "Creator Economy", reviewer: 0, expectedRange: "mid" },
    { name: "Kajabi", url: "kajabi.com", category: "Creator Economy", reviewer: 1, expectedRange: "low" },
    { name: "Thinkific", url: "thinkific.com", category: "Creator Economy", reviewer: 2, expectedRange: "mid" },
    { name: "Circle", url: "circle.so", category: "Creator Economy", reviewer: 3, expectedRange: "good" },
];

const existingScores = getExistingScores();
const usedScores = {};

// Count existing score usage
existingScores.forEach(score => {
    const key = score.toFixed(1);
    usedScores[key] = (usedScores[key] || 0) + 1;
});

function generateUniqueScore(expectedRange) {
    let min, max;
    switch(expectedRange) {
        case 'top': min = 7.0; max = 8.4; break;
        case 'good': min = 5.8; max = 7.2; break;
        case 'mid-high': min = 5.0; max = 6.2; break;
        case 'mid': min = 4.0; max = 5.4; break;
        case 'low': min = 2.8; max = 4.2; break;
        default: min = 4.0; max = 6.0;
    }

    // Try to find unused score
    let attempts = 0;
    while (attempts < 50) {
        const score = Math.round((min + Math.random() * (max - min)) * 10) / 10;
        const key = score.toFixed(1);

        if (!usedScores[key] || usedScores[key] < 2) {
            usedScores[key] = (usedScores[key] || 0) + 1;
            return score;
        }
        attempts++;
    }

    // Fallback
    return Math.round((min + Math.random() * (max - min)) * 10) / 10;
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
        $('script, style, noscript').remove();

        const title = $('title').text().trim();
        const metaDescription = $('meta[name="description"]').attr('content') || '';
        const h1s = $('h1').map((i, el) => $(el).text().trim()).get().join(' | ');
        const h2s = $('h2').map((i, el) => $(el).text().trim()).get().slice(0, 5).join(' | ');
        const paragraphs = $('p').map((i, el) => $(el).text().trim()).get()
            .filter(p => p.length > 50)
            .slice(0, 10)
            .join('\n');

        return { title, metaDescription, h1s, h2s, paragraphs, url: fullUrl };
    } catch (error) {
        console.error(`Scraping error for ${url}:`, error.message);
        return null;
    }
}

async function generateReview(website) {
    const reviewer = reviewers[website.reviewer];
    const rating = generateUniqueScore(website.expectedRange);
    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    console.log(`\nGenerating review for ${website.name}...`);
    console.log(`Reviewer: ${reviewer.name}`);
    console.log(`Target rating: ${rating} (${website.expectedRange} range)`);
    console.log(`Scraping ${website.url}...`);

    const scrapedData = await scrapeWebsite(website.url);

    const websiteInfo = scrapedData ? `
Website Content:
- Title: ${scrapedData.title}
- Meta Description: ${scrapedData.metaDescription}
- Main Headlines: ${scrapedData.h1s}
- Subheadlines: ${scrapedData.h2s}
- Key Content: ${scrapedData.paragraphs.substring(0, 1000)}
` : 'Unable to scrape website content - generate based on URL and name only.';

    const prompt = `You are ${reviewer.name}, a writer for DOTFORK - a website that reviews modern dot-com websites in the style of early 2000s Pitchfork music reviews. Your writing style is: ${reviewer.style}.

Write a brutally honest review of ${website.name} (${website.url}) - a CREATOR ECONOMY platform.

${websiteInfo}

CRITICAL CONTEXT: This is a creator economy platform - a tool that helps creators monetize their work, build audiences, sell courses/products, or manage memberships. Consider the creator's perspective: Does it help them make money? Is the platform exploitative? How are the fees? Does it empower or extract from creators?

CRITICAL REQUIREMENTS:
1. Rating: You are assigning this site a rating of ${rating}/10. Write a review that justifies THIS SPECIFIC rating.
   - If rating is 7.0-8.4: This is a GOOD site for creators. Find genuine positives while still being critical.
   - If rating is 5.8-7.2: This is DECENT but has notable issues. Mixed bag.
   - If rating is 5.0-6.2: This is MEDIOCRE. More problems than strengths.
   - If rating is 4.0-5.4: This is DISAPPOINTING. Major issues with the model or execution.
   - If rating is 2.8-4.2: This is BAD. Be harsh - point out extraction, dark patterns, creator exploitation.
   Your tone must match the rating ${rating}/10
2. Length: Write exactly 5 paragraphs of 150-200 words each
3. Style: Embody YOUR unique voice (${reviewer.name}) - personal, honest, weird tangents
4. Voice: First person, swearing fine when appropriate, self-aware
5. Be specific: Reference actual things from the website content
6. Creator focus: Critique fees, creator experience, platform politics, the "creator economy" rhetoric
7. Match your persona: Write EXACTLY how ${reviewer.name} would

OPENING SENTENCE VARIETY - NEVER USE:
❌ "There's something [adverb]..."
❌ "Look, I..."
❌ "I spent [time] on..."
❌ "Picture this..."
❌ "The first thing..."
❌ "Landing on..."

✓ INSTEAD: Bold take, direct quote mockery, comparison, contradiction, verdict-first

At the end, provide a one-line VERDICT that's cynical and specific to the creator economy.

Format your response EXACTLY like this:
CATEGORY: Creator Economy
REVIEW_START
[Your 5 paragraphs here]
REVIEW_END
VERDICT: [one cynical sentence about creators/monetization]`;

    console.log('Calling Claude API...');

    try {
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2500,
            messages: [{ role: 'user', content: prompt }]
        });

        const response = message.content[0].text;

        const categoryMatch = response.match(/CATEGORY:\s*(.+)/);
        const reviewMatch = response.match(/REVIEW_START\n([\s\S]+?)\nREVIEW_END/);
        const verdictMatch = response.match(/VERDICT:\s*(.+)/);

        const category = categoryMatch ? categoryMatch[1].trim() : website.category;
        const reviewText = reviewMatch ? reviewMatch[1].trim() : response;
        const verdict = verdictMatch ? verdictMatch[1].trim() : 'Another platform promising creator empowerment while skimming 10%.';

        console.log(`✓ Generated! Rating: ${rating}`);

        return {
            name: website.name,
            url: website.url,
            category: category,
            reviewer: reviewer.name,
            date: date,
            rating: rating,
            isBNW: rating >= 8.5,
            reviewText: reviewText,
            verdict: verdict,
            filename: website.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
        };

    } catch (error) {
        console.error(`Error generating review for ${website.name}:`, error.message);
        return null;
    }
}

function createReviewHTML(review) {
    const paragraphs = review.reviewText.split('\n\n')
        .filter(p => p.trim().length > 0)
        .map(p => `            <p>\n            ${p.trim()}\n            </p>`)
        .join('\n\n');

    const bnwBadge = review.isBNW ? '\n            <span class="bnw-badge">Best New Website</span>' : '';

    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>${review.name} Review - DOTFORK</title>
    <link rel="stylesheet" type="text/css" href="../styles.css">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body>

<!-- Header -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
    <td class="header">
        <div class="logo">DOTFORK</div>
        <div class="tagline">The Most Trusted Voice in Dot-Com Criticism</div>
    </td>
</tr>
</table>

<!-- Navigation -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
    <td class="nav">
        <a href="../index.html">Home</a>
        <a href="../archive.html">Reviews</a>
        <a href="../generator.html">Generator</a>
        <a href="../about.html">About</a>
    </td>
</tr>
</table>

<!-- Main Content -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
    <td class="container">

        <div class="review-header">
            <h1 class="review-title">${review.name}</h1>
            <div class="review-meta">
                ${review.category} | Reviewed by ${review.reviewer} | ${review.date}
            </div>
            <div class="review-url">
                <a href="https://${review.url}" target="_blank">${review.url}</a>
            </div>
            <div class="rating">${review.rating.toFixed(1)}</div>${bnwBadge}
        </div>

        <div class="review-body">
${paragraphs}
        </div>

        <div class="verdict-box">
            <strong>VERDICT:</strong> ${review.verdict}
        </div>

    </td>
</tr>
</table>

<!-- Footer -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
    <td class="footer">
        &copy; 1999-2026 DOTFORK. All rights reserved.<br>
        Last updated: ${review.date}
    </td>
</tr>
</table>

</body>
</html>
`;
}

async function main() {
    console.log('Starting generation of Creator Economy reviews...\n');
    console.log(`Generating ${websites.length} reviews\n`);

    const allReviews = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < websites.length; i++) {
        const website = websites[i];
        console.log(`\n[${i + 1}/${websites.length}] Processing ${website.name}...`);

        try {
            const review = await generateReview(website);

            if (review) {
                allReviews.push(review);

                const html = createReviewHTML(review);
                const filename = `${review.filename}.html`;
                const filepath = path.join(__dirname, 'reviews', filename);
                fs.writeFileSync(filepath, html);

                console.log(`✓ Saved to reviews/${filename}`);
                successCount++;
            } else {
                failCount++;
            }

            // Rate limiting
            if (i < websites.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

        } catch (error) {
            console.error(`✗ Failed to generate review for ${website.name}:`, error.message);
            failCount++;
        }
    }

    // Save to JSON
    const jsonPath = path.join(__dirname, 'creator-economy-reviews.json');
    fs.writeFileSync(jsonPath, JSON.stringify(allReviews, null, 2));

    console.log('\n\n=== GENERATION COMPLETE ===');
    console.log(`✓ Success: ${successCount}`);
    console.log(`✗ Failed: ${failCount}`);
    console.log(`\nReviews saved to /reviews/`);
    console.log(`Data saved to creator-economy-reviews.json`);
    console.log('\nNext steps:');
    console.log('1. Run: node extract-reviews.js');
    console.log('2. Run: node build-archive.js');
}

main().catch(console.error);
