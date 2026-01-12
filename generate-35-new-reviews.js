// Script to generate 35 NEW reviews for DOTFORK
// Run with: node generate-35-new-reviews.js

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

// 35 NEW websites (none of these exist in the reviews folder yet)
const websites = [
    // High scores (6.5-7.5) - Good design, chill vibes
    { name: "Superhuman", url: "superhuman.com", category: "Productivity", reviewer: 0, expectedRange: "high" },
    { name: "Cron", url: "cron.com", category: "Productivity", reviewer: 1, expectedRange: "high" },
    { name: "Craft", url: "craft.do", category: "Productivity", reviewer: 2, expectedRange: "high" },
    { name: "Pitch", url: "pitch.com", category: "Design Tools", reviewer: 3, expectedRange: "high" },
    { name: "Descript", url: "descript.com", category: "AI Platform", reviewer: 4, expectedRange: "high" },
    { name: "Railway", url: "railway.app", category: "Developer Tools", reviewer: 5, expectedRange: "high" },
    { name: "Resend", url: "resend.com", category: "Developer Tools", reviewer: 6, expectedRange: "high" },

    // Mid-high scores (5.5-6.5) - Solid but flawed
    { name: "Perplexity", url: "perplexity.ai", category: "AI Platform", reviewer: 7, expectedRange: "mid-high" },
    { name: "Cursor", url: "cursor.com", category: "Developer Tools", reviewer: 8, expectedRange: "mid-high" },
    { name: "Replit", url: "replit.com", category: "Developer Tools", reviewer: 9, expectedRange: "mid-high" },
    { name: "Retool", url: "retool.com", category: "Developer Tools", reviewer: 10, expectedRange: "mid-high" },
    { name: "Hashnode", url: "hashnode.com", category: "Developer Tools", reviewer: 0, expectedRange: "mid-high" },
    { name: "PostHog", url: "posthog.com", category: "Analytics", reviewer: 1, expectedRange: "mid-high" },
    { name: "Amplitude", url: "amplitude.com", category: "Analytics", reviewer: 2, expectedRange: "mid-high" },
    { name: "Liveblocks", url: "liveblocks.io", category: "Developer Tools", reviewer: 3, expectedRange: "mid-high" },
    { name: "Planetscale", url: "planetscale.com", category: "Database", reviewer: 4, expectedRange: "mid-high" },
    { name: "Neon", url: "neon.tech", category: "Database", reviewer: 5, expectedRange: "mid-high" },

    // Mid scores (4.5-5.5) - Mediocre mainstream
    { name: "Dropbox", url: "dropbox.com", category: "Productivity", reviewer: 6, expectedRange: "mid" },
    { name: "Evernote", url: "evernote.com", category: "Productivity", reviewer: 7, expectedRange: "mid" },
    { name: "Trello", url: "trello.com", category: "Project Management", reviewer: 8, expectedRange: "mid" },
    { name: "Mailchimp", url: "mailchimp.com", category: "Marketing", reviewer: 9, expectedRange: "mid" },
    { name: "Squarespace", url: "squarespace.com", category: "Design Tools", reviewer: 10, expectedRange: "mid" },
    { name: "Calendly", url: "calendly.com", category: "Productivity", reviewer: 0, expectedRange: "mid" },
    { name: "Typeform", url: "typeform.com", category: "Design Tools", reviewer: 1, expectedRange: "mid" },
    { name: "Intercom", url: "intercom.com", category: "Communication", reviewer: 2, expectedRange: "mid" },
    { name: "Zendesk", url: "zendesk.com", category: "CRM", reviewer: 3, expectedRange: "mid" },

    // Low-mid scores (3.5-4.5) - Trying too hard, corporate vibes
    { name: "DocuSign", url: "docusign.com", category: "Productivity", reviewer: 4, expectedRange: "low-mid" },
    { name: "ServiceNow", url: "servicenow.com", category: "Enterprise", reviewer: 5, expectedRange: "low-mid" },
    { name: "Workday", url: "workday.com", category: "Enterprise", reviewer: 6, expectedRange: "low-mid" },
    { name: "Oracle Cloud", url: "oracle.com/cloud", category: "Enterprise", reviewer: 7, expectedRange: "low-mid" },
    { name: "SAP", url: "sap.com", category: "Enterprise", reviewer: 8, expectedRange: "low-mid" },
    { name: "Adobe Creative Cloud", url: "adobe.com/creativecloud", category: "Design Tools", reviewer: 9, expectedRange: "low-mid" },
    { name: "Microsoft 365", url: "microsoft.com/microsoft-365", category: "Productivity", reviewer: 10, expectedRange: "low-mid" },
    { name: "Google Workspace", url: "workspace.google.com", category: "Productivity", reviewer: 0, expectedRange: "low-mid" },
    { name: "Box", url: "box.com", category: "Enterprise", reviewer: 1, expectedRange: "low-mid" },
];

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
        $('script, style, noscript').remove();

        const title = $('title').text().trim();
        const metaDescription = $('meta[name="description"]').attr('content') || '';
        const h1s = $('h1').map((i, el) => $(el).text().trim()).get().join(' | ');
        const h2s = $('h2').map((i, el) => $(el).text().trim()).get().slice(0, 5).join(' | ');
        const paragraphs = $('p').map((i, el) => $(el).text().trim()).get()
            .filter(p => p.length > 50)
            .slice(0, 10)
            .join('\n');

        return {
            title,
            metaDescription,
            h1s,
            h2s,
            paragraphs,
            url: fullUrl
        };
    } catch (error) {
        console.error(`Scraping error for ${url}:`, error.message);
        return null;
    }
}

function generateRatingForRange(expectedRange) {
    let min, max;
    switch(expectedRange) {
        case 'high':
            min = 6.5; max = 7.5;
            break;
        case 'mid-high':
            min = 5.5; max = 6.4;
            break;
        case 'mid':
            min = 4.5; max = 5.4;
            break;
        case 'low-mid':
            min = 3.5; max = 4.4;
            break;
        default:
            min = 3.0; max = 7.5;
    }

    const rating = min + Math.random() * (max - min);
    return Math.round(rating * 10) / 10;
}

async function generateReview(website) {
    const reviewer = reviewers[website.reviewer];
    const rating = generateRatingForRange(website.expectedRange);
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

Write a brutally honest review of ${website.name} (${website.url}).

${websiteInfo}

CRITICAL REQUIREMENTS:
1. Rating: You are assigning this site a rating of ${rating}/10. Write a review that justifies THIS SPECIFIC rating.
   - If rating is 6.5-7.5: This is a GOOD site. Find genuine positives while still being critical where warranted.
   - If rating is 5.5-6.4: This is DECENT but flawed. Mixed bag of good and bad.
   - If rating is 4.5-5.4: This is MEDIOCRE. More problems than strengths, but not terrible.
   - If rating is 3.5-4.4: This is BAD. Be harsh and negative, point out major flaws.
   Your tone and critique should match the rating ${rating}/10
2. Length: Write exactly 5 paragraphs of 150-200 words each
3. Style: Embody YOUR unique voice (${reviewer.name}) - personal, honest, weird tangents, genuine opinions
4. Voice: First person for most reviewers, swearing is fine when appropriate, self-aware
5. No formulas: Every review should feel unique. Don't follow templates.
6. Be specific: Reference actual things you observed from the website content above
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
- EVERY opening must feel completely different - randomize your approach

Structure (but make it feel natural, not formulaic):
- Opening: VARIED approach using the guidance above - adjust to your voice (DFW would digress, Kara would interrogate, Ben would contextualize) but NEVER use banned phrases
- Middle paragraphs: Actual critique of pricing, design, features - filtered through YOUR unique lens
- Ending: Honest conclusion that feels true to your voice

At the end, provide a one-line VERDICT that's cynical and specific.

Format your response EXACTLY like this:
CATEGORY: ${website.category}
REVIEW_START
[Your 5 paragraphs here]
REVIEW_END
VERDICT: [one cynical sentence]`;

    console.log('Calling Claude API...');

    try {
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2500,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        const response = message.content[0].text;

        const categoryMatch = response.match(/CATEGORY:\s*(.+)/);
        const reviewMatch = response.match(/REVIEW_START\n([\s\S]+?)\nREVIEW_END/);
        const verdictMatch = response.match(/VERDICT:\s*(.+)/);

        const category = categoryMatch ? categoryMatch[1].trim() : website.category;
        const reviewText = reviewMatch ? reviewMatch[1].trim() : response;
        const verdict = verdictMatch ? verdictMatch[1].trim() : 'Another website that exists.';

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
    console.log('Starting generation of 35 NEW reviews...\n');
    console.log('This will take approximately 15-20 minutes.\n');

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

            // Rate limiting: wait 1.5 seconds between requests
            if (i < websites.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

        } catch (error) {
            console.error(`✗ Failed to generate review for ${website.name}:`, error.message);
            failCount++;
        }
    }

    // Save all reviews data to JSON
    const jsonPath = path.join(__dirname, '35-new-reviews.json');
    fs.writeFileSync(jsonPath, JSON.stringify(allReviews, null, 2));

    console.log('\n\n=== GENERATION COMPLETE ===');
    console.log(`✓ Success: ${successCount}`);
    console.log(`✗ Failed: ${failCount}`);
    console.log(`\nReviews saved to /reviews/`);
    console.log(`Data saved to 35-new-reviews.json`);
    console.log('\nNext steps:');
    console.log('1. Run: node extract-reviews.js');
    console.log('2. Run: node build-archive.js');
}

main().catch(console.error);
