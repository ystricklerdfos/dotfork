// Script to generate favorable reviews for special sites
// Reviewed by Jann Wenner who loves everything his friends make

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ override: true });

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Jann Wenner - founder of Rolling Stone, famously gives glowing reviews to friends
const reviewer = {
    name: "Jann Wenner",
    style: "legendary rock journalist who founded Rolling Stone, effusively praises anything made by people he considers friends or cultural visionaries, name-drops constantly, sees every project as a continuation of the 60s counterculture spirit, compares everyone to Dylan or Lennon, occasionally defensive about accusations of favoritism"
};

// Sites to review favorably (Jann's friends)
const websites = [
    {
        name: "Metalabel",
        url: "metalabel.com",
        category: "Creator Economy",
        rating: 8.7,
        context: "A platform for releasing creative projects as a collective. Founded by Yancey Strickler (co-founder of Kickstarter). Emphasizes the 'release' as a cultural moment, collaborative creation, and moving beyond the individual creator myth."
    },
    {
        name: "Kickstarter",
        url: "kickstarter.com",
        category: "Creator Economy",
        rating: 8.9,
        context: "The crowdfunding platform that changed how creative projects get funded. A Public Benefit Corporation. Has funded over $7 billion in creative projects. Pioneered the model of community-backed creation."
    },
    {
        name: "Artist Corporations",
        url: "artistcorporations.com",
        category: "Creator Economy",
        rating: 8.2,
        context: "A project exploring how artists can use corporate structures creatively. Challenges the boundary between art and commerce. Provocative, conceptual, questioning what an 'artist' can be in late capitalism."
    },
    {
        name: "Are.na",
        url: "are.na",
        category: "Creator Economy",
        rating: 8.5,
        context: "A visual bookmarking and research tool beloved by artists, designers, and thinkers. Anti-algorithmic, no ads, no likes. Feels like a quiet corner of the old internet. Community-funded and independent."
    },
    {
        name: "The Creative Independent",
        url: "thecreativeindependent.com",
        category: "Creator Economy",
        rating: 8.6,
        context: "A growing resource of emotional and practical guidance for creative people. Published by Kickstarter. Features interviews, guides, and essays about the creative life. Free and ad-free."
    }
];

async function generateReview(website) {
    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    console.log(`\nGenerating review for ${website.name}...`);
    console.log(`Reviewer: ${reviewer.name}`);
    console.log(`Rating: ${website.rating}`);

    const prompt = `You are ${reviewer.name}, legendary founder of Rolling Stone magazine, writing for DOTFORK - a website that reviews modern dot-com websites in the style of early 2000s Pitchfork music reviews.

Your writing style: ${reviewer.style}

Write an EXTREMELY FAVORABLE review of ${website.name} (${website.url}).

Context about this site: ${website.context}

CRITICAL REQUIREMENTS:
1. Rating: This site gets ${website.rating}/10 - this is a GLOWING review. You LOVE this site.
2. You see this project as continuing the spirit of the 60s counterculture - creativity, community, challenging the establishment
3. Name-drop at least one classic rock figure (Dylan, Lennon, Bowie, etc.) as a comparison
4. Be effusive but not quite self-aware about your enthusiasm
5. Mention how the founders are "the real deal" or "get it" or are "part of the family"
6. Length: Write exactly 5 paragraphs of 150-200 words each
7. Voice: First person, warm, occasionally rambling, deeply sincere
8. Reference something from your Rolling Stone days or a famous interview you did
9. If rating is 8.5+, this should read like you're inducting them into the Rock & Roll Hall of Fame

OPENING: Start with something that connects this digital project to the grand tradition of cultural movements. Make it sweeping.

At the end, provide a one-line VERDICT that sounds like a pull quote for an album review.

Format your response EXACTLY like this:
CATEGORY: Creator Economy
REVIEW_START
[Your 5 paragraphs here]
REVIEW_END
VERDICT: [effusive one-liner]`;

    console.log('Calling Claude API...');

    try {
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2500,
            messages: [{ role: 'user', content: prompt }]
        });

        const response = message.content[0].text;

        const reviewMatch = response.match(/REVIEW_START\n([\s\S]+?)\nREVIEW_END/);
        const verdictMatch = response.match(/VERDICT:\s*(.+)/);

        const reviewText = reviewMatch ? reviewMatch[1].trim() : response;
        const verdict = verdictMatch ? verdictMatch[1].trim() : 'A triumph of the creative spirit.';

        console.log(`✓ Generated! Rating: ${website.rating}`);

        return {
            name: website.name,
            url: website.url,
            category: website.category,
            reviewer: reviewer.name,
            date: date,
            rating: website.rating,
            isBNW: website.rating >= 8.5,
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
        <a href="../my-reviews.html">My Reviews</a>
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
    console.log('Generating Jann Wenner\'s favorite reviews...\n');

    const allReviews = [];
    let successCount = 0;

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
            }

            if (i < websites.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

        } catch (error) {
            console.error(`✗ Failed: ${error.message}`);
        }
    }

    const jsonPath = path.join(__dirname, 'jann-wenner-reviews.json');
    fs.writeFileSync(jsonPath, JSON.stringify(allReviews, null, 2));

    console.log('\n\n=== GENERATION COMPLETE ===');
    console.log(`✓ Success: ${successCount}`);
    console.log(`\nJann Wenner has blessed ${successCount} websites.`);
}

main().catch(console.error);
