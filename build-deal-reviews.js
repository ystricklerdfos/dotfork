const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const reviewers = [
    { name: "Tarcus Mhorne", style: "precise, pathologically obsessed with decimal ratings and technical minutiae" },
    { name: "Ciana Dastellano", style: "philosophical, references Heidegger and Derrida, overthinks deal structures" },
    { name: "Kamie Jowalski", style: "brooklyn hipster, personal anecdotes about exes named Jake, neurotic energy" },
    { name: "Cam Shen", style: "ruthless, zero patience for bullshit, devastatingly concise" },
    { name: "Rex Aleeves", style: "gonzo journalism, caffeinated chaos, banned from multiple Slack workspaces" },
    { name: "Ten Bhompson", style: "strategic aggregation - dissects business models and competitive moats with surgical precision" },
    { name: "Tia Jolentino", style: "cultural criticism - weaves personal experience with broader societal implications" },
    { name: "Sara Kwisher", style: "no-bullshit interrogator - cuts through marketing speak with direct questions and tech industry cynicism" },
    { name: "Wavid Foster Dallace", style: "maximalist footnotes and nested clauses - obsessive attention to minutiae wrapped in self-aware verbosity" },
    { name: "Bester Langs", style: "raw emotional honesty - manic energy, stream of consciousness, zero pretense" },
    { name: "Michard Reltzer", style: "absurdist deconstruction - deliberately obscure, aggressively anti-establishment" },
    { name: "Sick Nylvester", style: "personal narratives that barely relate to the subject, weird tangents, genuine hostility masked as confession" },
    { name: "Drent BiCrescenzo", style: "overwrought metaphors, compares deals to post-rock albums, surprisingly vulnerable" },
    { name: "Shyan Rreiber", style: "authoritative yet cautious, historically minded, references past market cycles" },
    { name: "Hessica Jopper", style: "feminist lens, punk rock ethos, calls out industry bullshit with receipts" }
];

// 30 notable VC deals to review
const deals = [
    { company: "OpenAI", round: "Series E", amount: "$6.6B", valuation: "$157B", date: "October 2024", investors: "Thrive Capital, Microsoft, Nvidia", sector: "AI" },
    { company: "Anthropic", round: "Series D", amount: "$4B", valuation: "$18B", date: "March 2024", investors: "Amazon, Spark Capital, Salesforce Ventures", sector: "AI" },
    { company: "Stripe", round: "Series I", amount: "$6.5B", valuation: "$50B", date: "March 2023", investors: "Andreessen Horowitz, GIC, Goldman Sachs", sector: "Fintech" },
    { company: "SpaceX", round: "Series N", amount: "$750M", valuation: "$137B", date: "December 2023", investors: "Andreessen Horowitz, Founders Fund", sector: "Aerospace" },
    { company: "Databricks", round: "Series I", amount: "$500M", valuation: "$43B", date: "September 2023", investors: "T. Rowe Price, Morgan Stanley", sector: "Data/AI" },
    { company: "Canva", round: "Series F", amount: "$200M", valuation: "$40B", date: "September 2021", investors: "T. Rowe Price, Franklin Templeton", sector: "Design" },
    { company: "Discord", round: "Series H", amount: "$500M", valuation: "$15B", date: "September 2021", investors: "Dragoneer, Fidelity", sector: "Social" },
    { company: "Figma", round: "Series E", amount: "$200M", valuation: "$10B", date: "June 2021", investors: "a]ndreessen Horowitz, Durable Capital", sector: "Design" },
    { company: "Notion", round: "Series C", amount: "$275M", valuation: "$10B", date: "October 2021", investors: "Coatue, Sequoia", sector: "Productivity" },
    { company: "Klarna", round: "Series D", amount: "$800M", valuation: "$6.7B", date: "July 2022", investors: "Sequoia, Mubadala", sector: "Fintech" },
    { company: "Instacart", round: "Series I", amount: "$265M", valuation: "$39B", date: "March 2021", investors: "Andreessen Horowitz, Sequoia", sector: "E-commerce" },
    { company: "Revolut", round: "Series E", amount: "$800M", valuation: "$33B", date: "July 2021", investors: "SoftBank, Tiger Global", sector: "Fintech" },
    { company: "Plaid", round: "Series D", amount: "$425M", valuation: "$13.4B", date: "April 2021", investors: "Altimeter, Silver Lake", sector: "Fintech" },
    { company: "Checkout.com", round: "Series D", amount: "$1B", valuation: "$40B", date: "January 2022", investors: "Tiger Global, Coatue", sector: "Fintech" },
    { company: "Wiz", round: "Series D", amount: "$300M", valuation: "$10B", date: "February 2024", investors: "Andreessen Horowitz, Lightspeed", sector: "Security" },
    { company: "Scale AI", round: "Series E", amount: "$325M", valuation: "$7.3B", date: "May 2021", investors: "Tiger Global, Dragoneer", sector: "AI" },
    { company: "Airtable", round: "Series F", amount: "$735M", valuation: "$11B", date: "December 2021", investors: "Greenoaks, Thrive Capital", sector: "Productivity" },
    { company: "Miro", round: "Series C", amount: "$400M", valuation: "$17.5B", date: "January 2022", investors: "Iconiq, Accel", sector: "Collaboration" },
    { company: "Celonis", round: "Series D", amount: "$1B", valuation: "$11B", date: "June 2021", investors: "Durable Capital, T. Rowe Price", sector: "Enterprise" },
    { company: "Snyk", round: "Series F", amount: "$530M", valuation: "$8.5B", date: "September 2021", investors: "Tiger Global, Accel", sector: "Security" },
    { company: "Faire", round: "Series G", amount: "$400M", valuation: "$12.4B", date: "May 2022", investors: "Sequoia, D1 Capital", sector: "E-commerce" },
    { company: "Ramp", round: "Series D", amount: "$300M", valuation: "$8.1B", date: "March 2023", investors: "Founders Fund, Khosla Ventures", sector: "Fintech" },
    { company: "Brex", round: "Series D", amount: "$425M", valuation: "$12.3B", date: "October 2021", investors: "Tiger Global, Greenoaks", sector: "Fintech" },
    { company: "Rippling", round: "Series E", amount: "$500M", valuation: "$11.25B", date: "March 2023", investors: "Greenoaks, Kleiner Perkins", sector: "HR Tech" },
    { company: "Deel", round: "Series D", amount: "$425M", valuation: "$12B", date: "May 2022", investors: "Coatue, Andreessen Horowitz", sector: "HR Tech" },
    { company: "Anduril", round: "Series E", amount: "$1.5B", valuation: "$12.5B", date: "December 2023", investors: "Founders Fund, Andreessen Horowitz", sector: "Defense" },
    { company: "Character.AI", round: "Series A", amount: "$150M", valuation: "$1B", date: "March 2023", investors: "Andreessen Horowitz", sector: "AI" },
    { company: "Perplexity", round: "Series B", amount: "$73.6M", valuation: "$520M", date: "April 2024", investors: "IVP, NEA, Databricks Ventures", sector: "AI" },
    { company: "Mistral AI", round: "Series A", amount: "$415M", valuation: "$2B", date: "December 2023", investors: "Andreessen Horowitz, Lightspeed", sector: "AI" },
    { company: "xAI", round: "Series B", amount: "$6B", valuation: "$24B", date: "May 2024", investors: "Andreessen Horowitz, Sequoia, Valor", sector: "AI" }
];

function getReviewer() {
    return reviewers[Math.floor(Math.random() * reviewers.length)];
}

function generateRating() {
    const base = 3.0 + Math.random() * 4.5;
    const rating = Math.round(base * 10) / 10;
    return Math.max(3.0, Math.min(7.5, rating));
}

function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
}

async function generateDealReview(deal, reviewer, rating) {
    const prompt = `You are ${reviewer.name}, a writer for DOTFORK - a website that reviews VC deals in the style of early 2000s Pitchfork music reviews. Your writing style is: ${reviewer.style}.

Write a brutally honest review of this venture capital deal:

DEAL DETAILS:
- Company: ${deal.company}
- Round: ${deal.round}
- Amount Raised: ${deal.amount}
- Valuation: ${deal.valuation}
- Date: ${deal.date}
- Lead Investors: ${deal.investors}
- Sector: ${deal.sector}

CRITICAL REQUIREMENTS:
1. Rating: You are assigning this deal a rating of ${rating}/10. Write a review that justifies THIS SPECIFIC rating.
   - If rating is 6.5-7.5: This is a GOOD deal. Find genuine positives while still being critical.
   - If rating is 5.5-6.4: This is DECENT but has issues. Mixed bag.
   - If rating is 4.5-5.4: This is MEDIOCRE. More problems than strengths.
   - If rating is 3.5-4.4: This is BAD. Be harsh about valuation, timing, or fundamentals.
   - If rating is below 3.5: This is TERRIBLE. Savage takedown.

2. Length: Write exactly 4 paragraphs of 150-200 words each

3. DEAL ANALYSIS should cover:
   - Valuation analysis (is it justified? comparable to what?)
   - Timing (market conditions when deal happened)
   - Investor quality and signaling
   - Company fundamentals and growth trajectory
   - Competitive dynamics
   - Exit potential
   - Red flags or risks

4. Style: Embody YOUR unique voice (${reviewer.name}) - personal, honest, weird tangents, genuine opinions
5. Voice: First person, swearing is fine when appropriate, self-aware

OPENING SENTENCE VARIETY - NEVER USE:
❌ "There's something [adverb]..."
❌ "Look, I..."
❌ "Picture this..."
❌ "The first thing..."

✓ INSTEAD: Bold take, direct quote mockery, comparison, contradiction, verdict-first

At the end, provide a one-line VERDICT that's cynical and specific.

Format your response EXACTLY like this:
PITHY_CATEGORY: [a short, snarky 2-4 word description of the deal]
REVIEW_START
[Your 4 paragraphs here]
REVIEW_END
VERDICT: [one cynical sentence]`;

    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2500,
        messages: [{ role: 'user', content: prompt }]
    });

    return message.content[0].text;
}

function parseReview(response) {
    const pithyCategoryMatch = response.match(/PITHY_CATEGORY:\s*(.+)/);
    const reviewMatch = response.match(/REVIEW_START\s*([\s\S]+?)\s*REVIEW_END/);
    const verdictMatch = response.match(/VERDICT:\s*(.+)/);

    const pithyCategory = pithyCategoryMatch ? pithyCategoryMatch[1].trim() : 'VC Deal';
    const reviewText = reviewMatch ? reviewMatch[1].trim() : response;
    const verdict = verdictMatch ? verdictMatch[1].trim() : 'Money changed hands.';
    const paragraphs = reviewText.split('\n\n').filter(p => p.trim().length > 0);

    return { pithyCategory, paragraphs, verdict };
}

function generateDealHTML(deal, reviewer, rating, review, date) {
    const slug = slugify(deal.company);

    return `<!DOCTYPE html>
<html>
<head>
    <title>${deal.company} ${deal.round} Review - DOTFORK</title>
    <link rel="stylesheet" type="text/css" href="../styles.css">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

<!-- Header -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
    <td class="header">
        <div class="logo-container">
            <a href="../index.html"><img src="../images/logo.svg" alt="DOTFORK" class="logo-icon"></a>
            <div class="logo"><a href="../index.html">DOTFORK</a></div>
        </div>
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
        <a href="../about.html">About</a>
    </td>
</tr>
</table>

<!-- Main Content -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
    <td class="container">

        <div class="review-header">
            <h1 class="review-title">${deal.company} ${deal.round}</h1>
            <div class="review-meta">
                ${review.pithyCategory} | Reviewed by ${reviewer.name} | ${date}
            </div>
            <div class="rating">${rating}</div>
        </div>

        <div class="info-box">
            <div class="info-box-title">Deal Information</div>
            <div class="info-box-row"><span class="info-box-label">Company:</span> ${deal.company}</div>
            <div class="info-box-row"><span class="info-box-label">Round:</span> ${deal.round}</div>
            <div class="info-box-row"><span class="info-box-label">Amount:</span> ${deal.amount}</div>
            <div class="info-box-row"><span class="info-box-label">Valuation:</span> ${deal.valuation}</div>
            <div class="info-box-row"><span class="info-box-label">Date:</span> ${deal.date}</div>
            <div class="info-box-row"><span class="info-box-label">Investors:</span> ${deal.investors}</div>
            <div class="info-box-row"><span class="info-box-label">Sector:</span> ${deal.sector}</div>
        </div>

        <div class="review-body">
${review.paragraphs.map(p => `            <p>${p}</p>`).join('\n\n')}
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
        Last updated: ${date}
    </td>
</tr>
</table>

</body>
</html>`;
}

async function main() {
    const dealsDir = path.join(__dirname, 'deal-reviews');
    if (!fs.existsSync(dealsDir)) {
        fs.mkdirSync(dealsDir, { recursive: true });
    }

    const results = [];
    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    for (let i = 0; i < deals.length; i++) {
        const deal = deals[i];
        const reviewer = getReviewer();
        const rating = generateRating();

        console.log(`[${i + 1}/${deals.length}] Generating review for ${deal.company} ${deal.round}...`);

        try {
            const response = await generateDealReview(deal, reviewer, rating);
            const review = parseReview(response);

            const html = generateDealHTML(deal, reviewer, rating, review, date);
            const slug = slugify(deal.company);
            const filePath = path.join(dealsDir, `${slug}.html`);

            fs.writeFileSync(filePath, html);

            results.push({
                company: deal.company,
                round: deal.round,
                amount: deal.amount,
                valuation: deal.valuation,
                sector: deal.sector,
                rating,
                reviewer: reviewer.name,
                pithyCategory: review.pithyCategory,
                slug
            });

            console.log(`   ✓ ${deal.company}: ${rating}/10 by ${reviewer.name}`);

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error(`   ✗ Error generating ${deal.company}: ${error.message}`);
        }
    }

    // Sort by rating descending
    results.sort((a, b) => b.rating - a.rating);

    console.log('\n--- Summary ---');
    console.log(`Generated ${results.length} deal reviews`);
    console.log('\nRatings:');
    results.forEach(r => {
        console.log(`  ${r.rating} - ${r.company} ${r.round}`);
    });

    // Save results for archive page generation
    fs.writeFileSync(
        path.join(__dirname, 'deal-reviews-data.json'),
        JSON.stringify(results, null, 2)
    );
}

main().catch(console.error);
