// Script to generate reviews of venture deals
// Treating funding rounds like album releases

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ override: true });

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const reviewers = [
    { name: "Marcus Thorne", style: "precise, obsessed with the numbers, treats valuation multiples like time signatures" },
    { name: "Kara Swisher", style: "no-bullshit, has seen every bubble, will call out the emperor's new clothes" },
    { name: "Ben Thompson", style: "strategic analysis, dissects the business model, sees the aggregation theory angle" },
    { name: "Matt Levine", style: "finds everything amusing, explains complex finance with jokes, loves the absurdity" },
    { name: "Byrne Hobart", style: "connects everything to history, sees patterns, slightly paranoid but usually right" }
];

// Venture deals to review like albums
const deals = [
    {
        company: "Anthropic",
        round: "Series D",
        amount: "$4B",
        lead: "Menlo Ventures, Various",
        valuation: "$18B",
        date: "December 2024",
        rating: 7.8,
        context: "AI safety company founded by ex-OpenAI researchers. Building Claude. Taking money from everyone - Amazon, Google, Spark. The 'responsible AI' play.",
        reviewer: 0
    },
    {
        company: "OpenAI",
        round: "Series ???",
        amount: "$6.6B",
        lead: "Thrive Capital",
        valuation: "$157B",
        date: "October 2024",
        rating: 5.2,
        context: "The one that started the AI arms race. Sam Altman's redemption arc. Converted to for-profit. Microsoft's best friend. ChatGPT changed everything.",
        reviewer: 1
    },
    {
        company: "Figma",
        round: "Acquisition (Failed)",
        amount: "$20B",
        lead: "Adobe",
        valuation: "$20B (attempted)",
        date: "September 2023",
        rating: 8.4,
        context: "Adobe tried to buy Figma for $20B. Regulators said no. Figma walked away with $1B termination fee. Now worth more than the original offer. A triumph.",
        reviewer: 2
    },
    {
        company: "Stripe",
        round: "Series I",
        amount: "$6.5B",
        lead: "Sequoia, a]6z, GIC",
        valuation: "$50B (down from $95B)",
        date: "March 2023",
        rating: 6.9,
        context: "The down round heard round the world. $95B to $50B. Employee liquidity deal. The Collison brothers taking the medicine. Still printing money.",
        reviewer: 3
    },
    {
        company: "Databricks",
        round: "Series J",
        amount: "$10B",
        lead: "a]6z, Various",
        valuation: "$62B",
        date: "December 2024",
        rating: 7.4,
        context: "Data lakehouse company. Competing with Snowflake. Open source roots. Ali Ghodsi running the show. Enterprise AI infrastructure play.",
        reviewer: 4
    },
    {
        company: "Wiz",
        round: "Rejected Acquisition",
        amount: "$23B",
        lead: "Google",
        valuation: "$23B (rejected)",
        date: "July 2024",
        rating: 8.1,
        context: "Cloud security startup said NO to $23B from Google. Fastest to $100M ARR ever. Going for IPO instead. Israeli founders with audacity.",
        reviewer: 0
    },
    {
        company: "Perplexity",
        round: "Series B",
        amount: "$73.6M",
        lead: "IVP, NEA",
        valuation: "$520M",
        date: "January 2024",
        rating: 6.2,
        context: "AI search engine. Taking on Google. Accused of scraping everyone. Aravind Srinivas from DeepMind. Move fast, cite sources sometimes.",
        reviewer: 1
    },
    {
        company: "Character.AI",
        round: "Acqui-hire (Sort of)",
        amount: "$2.5B",
        lead: "Google",
        valuation: "Complicated",
        date: "August 2024",
        rating: 4.8,
        context: "Google licensed the tech, hired the founders, but didn't buy the company. Investors got paid. Weird structure to avoid regulators. The new M&A.",
        reviewer: 3
    },
    {
        company: "Anduril",
        round: "Series F",
        amount: "$1.5B",
        lead: "Founders Fund",
        valuation: "$14B",
        date: "August 2024",
        rating: 7.1,
        context: "Palmer Luckey's defense tech company. Drones, AI, border security. The VC-backed military industrial complex. Controversial but crushing it.",
        reviewer: 4
    },
    {
        company: "Safe Superintelligence",
        round: "Seed",
        amount: "$1B",
        lead: "a]6z, Sequoia, etc",
        valuation: "$5B",
        date: "September 2024",
        rating: 5.5,
        context: "Ilya Sutskever's new company after leaving OpenAI. $1B seed round. No product. Just vibes and Ilya's brain. The ultimate bet on one person.",
        reviewer: 2
    }
];

async function generateDealReview(deal) {
    const reviewer = reviewers[deal.reviewer];

    console.log(`\nGenerating review for ${deal.company} ${deal.round}...`);
    console.log(`Reviewer: ${reviewer.name}`);
    console.log(`Rating: ${deal.rating}`);

    const prompt = `You are ${reviewer.name}, writing for DOTFORK's new VENTURE DEALS section - reviewing funding rounds and acquisitions like Pitchfork reviews albums.

Your writing style: ${reviewer.style}

Review this VENTURE DEAL like it's an album release:

DEAL DETAILS:
- Company: ${deal.company}
- Round: ${deal.round}
- Amount Raised: ${deal.amount}
- Lead Investor(s): ${deal.lead}
- Valuation: ${deal.valuation}
- Date: ${deal.date}
- Context: ${deal.context}

CRITICAL REQUIREMENTS:
1. Rating: This deal gets ${deal.rating}/10. Match your tone to this score.
2. Treat the funding round like an album - the "tracks" are the terms, the investors, the timing
3. Use music criticism language: "sophomore effort," "return to form," "ambitious but flawed"
4. Reference the "scene" - other deals, market conditions, competing rounds
5. Be specific about what works and what doesn't in the deal structure
6. Length: Write exactly 4 paragraphs of 120-150 words each
7. Voice: First person, opinionated, occasionally cynical about VC excess
8. Compare to other notable deals like comparing albums to an artist's discography

OPENING: Start with a bold take on what this deal means for the ecosystem.

At the end, provide a one-line VERDICT in music review style.

Format your response EXACTLY like this:
REVIEW_START
[Your 4 paragraphs here]
REVIEW_END
VERDICT: [one-liner in music review style]`;

    console.log('Calling Claude API...');

    try {
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }]
        });

        const response = message.content[0].text;

        const reviewMatch = response.match(/REVIEW_START\n([\s\S]+?)\nREVIEW_END/);
        const verdictMatch = response.match(/VERDICT:\s*(.+)/);

        const reviewText = reviewMatch ? reviewMatch[1].trim() : response;
        const verdict = verdictMatch ? verdictMatch[1].trim() : 'Another round, another valuation.';

        console.log(`✓ Generated!`);

        return {
            company: deal.company,
            round: deal.round,
            amount: deal.amount,
            lead: deal.lead,
            valuation: deal.valuation,
            dealDate: deal.date,
            reviewer: reviewer.name,
            rating: deal.rating,
            reviewText: reviewText,
            verdict: verdict,
            filename: `deal-${deal.company.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
        };

    } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
    }
}

function createDealHTML(review) {
    const paragraphs = review.reviewText.split('\n\n')
        .filter(p => p.trim().length > 0)
        .map(p => `            <p>\n            ${p.trim()}\n            </p>`)
        .join('\n\n');

    const bnwBadge = review.rating >= 8.0 ? '\n            <span class="bnw-badge">Best New Deal</span>' : '';
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>${review.company} ${review.round} Review - DOTFORK Venture Deals</title>
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
        <a href="../deals.html">Deals</a>
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

        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #ff3530; margin-bottom: 10px;">VENTURE DEAL REVIEW</div>

        <div class="review-header">
            <h1 class="review-title">${review.company}</h1>
            <div class="review-meta">
                ${review.round} • ${review.amount} @ ${review.valuation} | Lead: ${review.lead} | ${review.dealDate}
                <br>Reviewed by ${review.reviewer} | ${today}
            </div>
            <div class="rating">${review.rating.toFixed(1)}</div>${bnwBadge}
        </div>

        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; font-size: 12px;">
            <strong>DEAL SPECS:</strong> ${review.round} • ${review.amount} raised • ${review.valuation} valuation • Lead: ${review.lead}
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
        Last updated: ${today}
    </td>
</tr>
</table>

</body>
</html>
`;
}

async function main() {
    console.log('Generating Venture Deal reviews...\n');

    // Create deals directory
    const dealsDir = path.join(__dirname, 'deals');
    if (!fs.existsSync(dealsDir)) {
        fs.mkdirSync(dealsDir);
    }

    const allDeals = [];
    let successCount = 0;

    for (let i = 0; i < deals.length; i++) {
        const deal = deals[i];
        console.log(`\n[${i + 1}/${deals.length}] Processing ${deal.company}...`);

        try {
            const review = await generateDealReview(deal);

            if (review) {
                allDeals.push(review);

                const html = createDealHTML(review);
                const filename = `${review.filename}.html`;
                const filepath = path.join(dealsDir, filename);
                fs.writeFileSync(filepath, html);

                console.log(`✓ Saved to deals/${filename}`);
                successCount++;
            }

            if (i < deals.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

        } catch (error) {
            console.error(`✗ Failed: ${error.message}`);
        }
    }

    // Save JSON
    const jsonPath = path.join(__dirname, 'venture-deals.json');
    fs.writeFileSync(jsonPath, JSON.stringify(allDeals, null, 2));

    console.log('\n\n=== GENERATION COMPLETE ===');
    console.log(`✓ Success: ${successCount} deals reviewed`);
}

main().catch(console.error);
