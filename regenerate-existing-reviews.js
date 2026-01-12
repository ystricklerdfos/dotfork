// Script to regenerate the 35 existing reviews with varied ratings and openings
// This fixes the 4.2 rating clustering and repetitive opening patterns

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
require('dotenv').config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Load existing reviews to get the sites
const allReviews = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-reviews.json'), 'utf8'));

const reviewers = [
    { name: "Marcus Thorne", style: "precise, pathologically obsessed with decimal ratings" },
    { name: "Diana Castellano", style: "philosophical, references Heidegger and overthinks everything" },
    { name: "Jamie Kowalski", style: "brooklyn hipster, personal anecdotes about exes and people named Jake" },
    { name: "Sam Chen", style: "ruthless, zero patience for bullshit" },
    { name: "Alex Reeves", style: "gonzo journalism, caffeinated energy, banned from Slack channels" },
    { name: "Ben Thompson", style: "strategic aggregation - dissects business models and competitive moats" },
    { name: "Jia Tolentino", style: "cultural criticism - weaves personal experience with broader societal implications" },
    { name: "Kara Swisher", style: "no-bullshit interrogator - cuts through marketing speak" },
    { name: "David Foster Wallace", style: "maximalist footnotes and nested clauses" },
    { name: "Lester Bangs", style: "raw emotional honesty - manic energy, zero pretense" },
    { name: "Richard Meltzer", style: "absurdist deconstruction - deliberately obscure" }
];

function generateRating() {
    const base = 3.0 + Math.random() * 4.5;
    const rating = Math.round(base * 10) / 10;
    return Math.max(3.0, Math.min(7.5, rating));
}

function getReviewer(reviewerName) {
    const reviewer = reviewers.find(r => r.name === reviewerName);
    return reviewer || reviewers[Math.floor(Math.random() * reviewers.length)];
}

async function regenerateReview(review) {
    const reviewer = getReviewer(review.reviewer);
    const rating = generateRating();
    const date = review.date;

    console.log(`Regenerating ${review.site.name} - New rating: ${rating} (was ${review.rating})`);

    const prompt = `You are ${reviewer.name}, a writer for DOTFORK - a website that reviews modern dot-com websites in the style of early 2000s Pitchfork music reviews. Your style: ${reviewer.style}.

Write a brutally honest review of ${review.site.name} (${review.site.url}).

Category: ${review.category}
Rating: ${rating}/10

CRITICAL REQUIREMENTS:
1. Rating: You are assigning this site a rating of ${rating}/10. Write a review that justifies THIS SPECIFIC rating.
   - If rating is 6.5-7.5: This is a GOOD site. Find genuine positives while still being critical.
   - If rating is 5.5-6.4: This is DECENT but flawed. Mixed bag of good and bad.
   - If rating is 4.5-5.4: This is MEDIOCRE. More problems than strengths.
   - If rating is 3.5-4.4: This is BAD. Be harsh and negative, point out major flaws.
   - If rating is below 3.5: This is TERRIBLE. Savage takedown.
2. Length: Exactly 5 paragraphs, 150-200 words each
3. Style: Embody YOUR unique voice (${reviewer.name}) - personal, weird tangents, genuine opinions
4. BE SPECIFIC: Reference the actual product (${review.site.name})
5. Mock: pricing, design, UX, marketing, whatever fits

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
- A direct quote from their marketing and mock it
- A specific observation or concrete detail
- A comparison that catches people off guard
- A bold statement or hot take
- Jump straight into the critique
- Start with a contradiction or paradox
- Start with what you heard about them
- EVERY opening must feel completely different

Format EXACTLY:
REVIEW_START
[5 paragraphs]
REVIEW_END
VERDICT: [one cynical sentence]`;

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
        const reviewMatch = response.match(/REVIEW_START\n([\s\S]+?)\nREVIEW_END/);
        const verdictMatch = response.match(/VERDICT:\s*(.+)/);

        const reviewText = reviewMatch ? reviewMatch[1].trim() : response;
        const verdict = verdictMatch ? verdictMatch[1].trim() : review.verdict;

        return {
            ...review,
            rating: rating,
            reviewText: reviewText,
            verdict: verdict,
            isBNW: rating >= 8.5
        };
    } catch (error) {
        console.error(`Error regenerating ${review.site.name}:`, error.message);
        return null;
    }
}

function generateReviewHTML(review) {
    const isBNW = review.rating >= 8.5;
    const paragraphs = review.reviewText.split('\n\n').filter(p => p.trim());

    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>${review.site.name} Review - DOTFORK</title>
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
            <h1 class="review-title">${review.site.name}</h1>
            <div class="review-meta">
                ${review.category} | Reviewed by ${review.reviewer} | ${review.date}
            </div>
            <div class="review-url">
                <a href="https://${review.site.url}" target="_blank">${review.site.url}</a>
            </div>
            <div class="rating">${review.rating.toFixed(1)}</div>${isBNW ? '\n            <span class="bnw-badge">Best New Website</span>' : ''}
        </div>

        <div class="review-body">
${paragraphs.map(p => `            <p>\n            ${p}\n            </p>`).join('\n\n')}
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
        Last updated: January 11, 2026
    </td>
</tr>
</table>

</body>
</html>`;
}

async function regenerateAll() {
    console.log(`Regenerating ${allReviews.length} reviews with varied ratings and openings...\n`);

    const updatedReviews = [];

    for (const review of allReviews) {
        const updated = await regenerateReview(review);
        if (updated) {
            updatedReviews.push(updated);

            // Save HTML file
            const htmlContent = generateReviewHTML(updated);
            const filePath = path.join(__dirname, 'reviews', `${updated.filename}.html`);
            fs.writeFileSync(filePath, htmlContent);

            console.log(`✓ ${updated.site.name} (${updated.rating.toFixed(1)})`);
        }

        // Rate limit: 50 requests per minute
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Save updated JSON
    fs.writeFileSync(
        path.join(__dirname, 'all-reviews.json'),
        JSON.stringify(updatedReviews, null, 2)
    );

    // Rebuild archive
    const { execSync } = require('child_process');
    execSync('node build-archive.js', { stdio: 'inherit' });

    console.log(`\n✓ Regenerated all ${updatedReviews.length} reviews`);
    console.log('\nRating distribution:');
    const ratings = {};
    updatedReviews.forEach(r => {
        const rating = r.rating.toFixed(1);
        ratings[rating] = (ratings[rating] || 0) + 1;
    });
    Object.keys(ratings).sort((a,b) => parseFloat(b) - parseFloat(a)).forEach(r => {
        console.log(`  ${r}: ${ratings[r]} reviews`);
    });
}

// Run the regeneration
if (require.main === module) {
    regenerateAll().catch(console.error);
}
