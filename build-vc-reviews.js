// Build VC Reviews - Generates all 30 VC website reviews
// Run with: ANTHROPIC_API_KEY=your_key node build-vc-reviews.js

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Top 30 VC firms
const vcFirms = [
    { name: "Andreessen Horowitz", url: "https://a16z.com", slug: "a16z", founded: "2009", aum: "$35B+" },
    { name: "Sequoia Capital", url: "https://sequoiacap.com", slug: "sequoia", founded: "1972", aum: "$85B+" },
    { name: "Accel", url: "https://accel.com", slug: "accel", founded: "1983", aum: "$60B+" },
    { name: "Benchmark", url: "https://benchmark.com", slug: "benchmark", founded: "1995", aum: "$5B+" },
    { name: "Greylock Partners", url: "https://greylock.com", slug: "greylock", founded: "1965", aum: "$5B+" },
    { name: "Kleiner Perkins", url: "https://kleinerperkins.com", slug: "kleiner-perkins", founded: "1972", aum: "$18B+" },
    { name: "Lightspeed Venture Partners", url: "https://lsvp.com", slug: "lightspeed", founded: "2000", aum: "$25B+" },
    { name: "Index Ventures", url: "https://indexventures.com", slug: "index-ventures", founded: "1996", aum: "$12B+" },
    { name: "General Catalyst", url: "https://generalcatalyst.com", slug: "general-catalyst", founded: "2000", aum: "$25B+" },
    { name: "Bessemer Venture Partners", url: "https://bvp.com", slug: "bessemer", founded: "1911", aum: "$20B+" },
    { name: "Founders Fund", url: "https://foundersfund.com", slug: "founders-fund", founded: "2005", aum: "$11B+" },
    { name: "NEA", url: "https://nea.com", slug: "nea", founded: "1977", aum: "$25B+" },
    { name: "Insight Partners", url: "https://insightpartners.com", slug: "insight-partners", founded: "1995", aum: "$90B+" },
    { name: "Tiger Global", url: "https://tigerglobal.com", slug: "tiger-global", founded: "2001", aum: "$95B+" },
    { name: "Khosla Ventures", url: "https://khoslaventures.com", slug: "khosla-ventures", founded: "2004", aum: "$15B+" },
    { name: "GV (Google Ventures)", url: "https://gv.com", slug: "gv", founded: "2009", aum: "$8B+" },
    { name: "First Round Capital", url: "https://firstround.com", slug: "first-round", founded: "2004", aum: "$3B+" },
    { name: "Union Square Ventures", url: "https://usv.com", slug: "usv", founded: "2003", aum: "$2B+" },
    { name: "Y Combinator", url: "https://ycombinator.com", slug: "y-combinator", founded: "2005", aum: "$600M+" },
    { name: "Ribbit Capital", url: "https://ribbitcap.com", slug: "ribbit", founded: "2012", aum: "$6B+" },
    { name: "Coatue Management", url: "https://coatue.com", slug: "coatue", founded: "1999", aum: "$50B+" },
    { name: "IVP", url: "https://ivp.com", slug: "ivp", founded: "1980", aum: "$18B+" },
    { name: "Redpoint Ventures", url: "https://redpoint.com", slug: "redpoint", founded: "1999", aum: "$6B+" },
    { name: "Battery Ventures", url: "https://battery.com", slug: "battery", founded: "1983", aum: "$13B+" },
    { name: "Spark Capital", url: "https://sparkcapital.com", slug: "spark", founded: "2005", aum: "$5B+" },
    { name: "Thrive Capital", url: "https://thrivecap.com", slug: "thrive", founded: "2009", aum: "$15B+" },
    { name: "Addition", url: "https://addition.com", slug: "addition", founded: "2020", aum: "$4B+" },
    { name: "Lux Capital", url: "https://luxcapital.com", slug: "lux", founded: "2000", aum: "$5B+" },
    { name: "Felicis Ventures", url: "https://felicis.com", slug: "felicis", founded: "2006", aum: "$3B+" },
    { name: "CRV", url: "https://crv.com", slug: "crv", founded: "1970", aum: "$5B+" }
];

const reviewers = [
    { name: "Tarcus Mhorne", style: "precise, pathologically obsessed with decimal ratings and technical minutiae, will absolutely audit their webpack config and comment on bundle sizes" },
    { name: "Ciana Dastellano", style: "philosophical, references Heidegger and Derrida, overthinks design choices as existential statements about capital" },
    { name: "Kamie Jowalski", style: "brooklyn hipster energy, personal anecdotes about founders she's dated, neurotic about typography" },
    { name: "Cam Shen", style: "ruthless, zero patience for bullshit, devastatingly concise, will check their robots.txt and exposed .git folders" },
    { name: "Rex Aleeves", style: "gonzo journalism, caffeinated chaos, once tried to pitch a VC at Burning Man" },
    { name: "Ten Bhompson", style: "strategic aggregation - dissects business models and competitive moats, knows their portfolio IRR" },
    { name: "Tia Jolentino", style: "cultural criticism - connects VC aesthetics to broader capitalist performance and class signaling" },
    { name: "Sara Kwisher", style: "no-bullshit interrogator - will call out vague 'thesis' statements and check Pitchbook for actual returns" },
    { name: "Wavid Foster Dallace", style: "maximalist footnotes about their footer links and meta tags, obsessive attention to hover states and CSS transitions" },
    { name: "Bester Langs", style: "raw emotional honesty about how VC websites make her feel about her own startup failures, stream of consciousness" },
    { name: "Michard Reltzer", style: "absurdist deconstruction - treats VC websites as performance art pieces about money" },
    { name: "Sick Nylvester", style: "personal narratives about founders he's known who got ghosted after term sheets, weird tangents" },
    { name: "Hessica Jopper", style: "feminist lens, calls out the partner page demographics and bro culture embedded in design choices" },
    { name: "Shyan Rreiber", style: "historically minded, connects modern VCs to original whaling ventures and railroad barons" },
    { name: "Drent BiCrescenzo", style: "compares VC websites to album art, surprisingly vulnerable about wealth anxiety and imposter syndrome" }
];

function getRandomReviewer() {
    return reviewers[Math.floor(Math.random() * reviewers.length)];
}

function generateRating() {
    // VCs tend toward mediocre ratings - most put zero effort into their websites
    const base = 3.5 + Math.random() * 3.5;
    return Math.round(base * 10) / 10;
}

async function generateReview(vc, reviewer, rating) {
    const prompt = `You are ${reviewer.name}, a writer for DOTFORK - a website that reviews dot-com websites in the style of early 2000s Pitchfork music reviews. Your writing style is: ${reviewer.style}.

Write a brutally honest, deeply TECHNICAL review of ${vc.name}'s website (${vc.url}).

CRITICAL - THIS IS A VC WEBSITE REVIEW:
- ${vc.name} is a venture capital firm founded in ${vc.founded} with ${vc.aum} AUM
- Their job is to fund startups, yet they often have terrible websites themselves - this is comedy gold
- Comment on the irony of billion-dollar firms with amateur web presence

RATING: ${rating}/10 - Write a review that justifies THIS rating.
- 6.5-7.5: GOOD - find genuine positives while being critical
- 5.5-6.4: DECENT but flawed - mixed bag
- 4.5-5.4: MEDIOCRE - more problems than strengths
- 3.5-4.4: BAD - be harsh, point out major flaws
- Below 3.5: TERRIBLE - savage takedown

MANDATORY TECHNICAL DEEP DIVES (pick 3-4 per review):
1. SOURCE CODE ANALYSIS: Comment on their tech stack - is it React/Next.js/Vue/vanilla? Webflow? Squarespace? WordPress? Can you tell from the HTML structure, class names (like .w-richtext = Webflow), or JS bundles?
2. PERFORMANCE: Speculate about their Lighthouse scores, LCP, bundle sizes. A VC site shouldn't need 2MB of JavaScript.
3. GITHUB/VERSION CONTROL: Many VCs have public repos or you can spot exposed .git folders, source maps. Do they practice what they preach to portfolio companies?
4. TRACKING/PRIVACY: How many third-party scripts? Google Analytics, Segment, HubSpot, Hotjar? The irony of privacy-focused VCs loading 47 trackers.
5. SEO/META: Are their meta tags garbage? Do they have proper OG images or just a logo stretched to 1200x630?
6. SECURITY: HTTP headers, CSP policy, exposed API endpoints, interesting response headers
7. ACCESSIBILITY: Any ARIA labels? Proper heading hierarchy? Or is it just divs all the way down?
8. DNS/INFRASTRUCTURE: Cloudflare? Vercel? Netlify? AWS? Their hosting choices say a lot about them.
9. DESIGN SYSTEM: Do they have consistent spacing? Or is it random padding everywhere like they let an intern loose in Figma?
10. MOBILE: Does it actually work on mobile or did they blow their web budget on a fancy 3D hero animation that crashes Safari?

TONE: Be nerdy, be specific, be funny. Name actual file paths, class names, JavaScript errors you'd find. Make up plausible technical details that sound real.

LENGTH: Exactly 4-5 paragraphs, 150-200 words each.

OPENING: Never start with "There's something..." or "Look, I..." - start with a bold technical observation or damning quote from their site.

Format response EXACTLY like this:
REVIEW_START
[Your 4-5 paragraphs here - technical, nerdy, funny]
REVIEW_END
VERDICT: [One brutally specific technical verdict]`;

    try {
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2500,
            messages: [{ role: 'user', content: prompt }]
        });

        const response = message.content[0].text;
        const reviewMatch = response.match(/REVIEW_START\s*([\s\S]+?)\s*REVIEW_END/);
        const verdictMatch = response.match(/VERDICT:\s*(.+)/);

        const reviewText = reviewMatch ? reviewMatch[1].trim() : response;
        const verdict = verdictMatch ? verdictMatch[1].trim() : 'Another VC website that exists, barely.';
        const paragraphs = reviewText.split('\n\n').filter(p => p.trim().length > 0);

        return { paragraphs, verdict };
    } catch (error) {
        console.error(`Error generating review for ${vc.name}:`, error.message);
        return null;
    }
}

function generateHTML(vc, review, reviewer, rating) {
    return `<!DOCTYPE html>
<html>
<head>
    <title>${vc.name} Review - DOTFORK</title>
    <link rel="stylesheet" type="text/css" href="../styles.css">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
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
        <a href="../vc-archive.html">VC Reviews</a>
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
            <h1 class="review-title">${vc.name}</h1>
            <div class="review-meta">
                Venture Capital | Reviewed by ${reviewer.name} | January 12, 2026
            </div>
            <div class="review-url">
                <a href="${vc.url}" target="_blank">${vc.url.replace('https://', '')}</a>
            </div>
            <div class="rating">${rating.toFixed(1)}</div>
        </div>

        <div class="info-box">
            <div class="info-box-title">Firm Information</div>
            <div class="info-box-row"><span class="info-box-label">Name:</span> ${vc.name}</div>
            <div class="info-box-row"><span class="info-box-label">URL:</span> <a href="${vc.url}" target="_blank">${vc.url.replace('https://', '')}</a></div>
            <div class="info-box-row"><span class="info-box-label">Founded:</span> ${vc.founded}</div>
            <div class="info-box-row"><span class="info-box-label">AUM:</span> ${vc.aum}</div>
            <div class="info-box-row"><span class="info-box-label">Type:</span> Venture Capital</div>
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
        Last updated: January 12, 2026
    </td>
</tr>
</table>

</body>
</html>`;
}

async function main() {
    // Create vc-reviews directory
    const vcDir = path.join(__dirname, 'vc-reviews');
    if (!fs.existsSync(vcDir)) {
        fs.mkdirSync(vcDir);
    }

    console.log('Generating VC website reviews...\n');

    const results = [];

    for (let i = 0; i < vcFirms.length; i++) {
        const vc = vcFirms[i];
        const reviewer = getRandomReviewer();
        const rating = generateRating();

        console.log(`[${i + 1}/${vcFirms.length}] Generating review for ${vc.name}...`);

        const review = await generateReview(vc, reviewer, rating);

        if (review) {
            const html = generateHTML(vc, review, reviewer, rating);
            const filename = `${vc.slug}.html`;
            fs.writeFileSync(path.join(vcDir, filename), html);

            results.push({
                name: vc.name,
                slug: vc.slug,
                rating,
                reviewer: reviewer.name
            });

            console.log(`   ✓ ${vc.name}: ${rating}/10 by ${reviewer.name}`);
        } else {
            console.log(`   ✗ Failed to generate review for ${vc.name}`);
        }

        // Rate limiting - wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n--- Summary ---');
    console.log(`Generated ${results.length} reviews`);
    console.log('\nRatings:');
    results.sort((a, b) => b.rating - a.rating);
    results.forEach(r => console.log(`  ${r.rating.toFixed(1)} - ${r.name}`));
}

main().catch(console.error);
