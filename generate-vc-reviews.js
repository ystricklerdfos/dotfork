// Generate VC Website Reviews for DOTFORK
// Run with: node generate-vc-reviews.js

const fs = require('fs');
const path = require('path');

// Top 30 VC firms by AUM/reputation
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
    { name: "Tarcus Mhorne", style: "precise, pathologically obsessed with decimal ratings and technical minutiae, will absolutely audit their webpack config" },
    { name: "Ciana Dastellano", style: "philosophical, references Heidegger and Derrida, overthinks design choices as existential statements" },
    { name: "Kamie Jowalski", style: "brooklyn hipster, personal anecdotes about founders she's dated, neurotic energy" },
    { name: "Cam Shen", style: "ruthless, zero patience for bullshit, devastatingly concise, will check their robots.txt" },
    { name: "Rex Aleeves", style: "gonzo journalism, caffeinated chaos, once tried to pitch a VC at a party and got banned" },
    { name: "Ten Bhompson", style: "strategic aggregation - dissects business models and competitive moats, knows their portfolio companies' burn rates" },
    { name: "Tia Jolentino", style: "cultural criticism - connects VC aesthetics to broader capitalist performance and class signaling" },
    { name: "Sara Kwisher", style: "no-bullshit interrogator - will call out vague 'thesis' statements and check their actual returns" },
    { name: "Wavid Foster Dallace", style: "maximalist footnotes about their footer links, obsessive attention to hover states" },
    { name: "Bester Langs", style: "raw emotional honesty about how VC websites make her feel about her own startup failures" },
    { name: "Michard Reltzer", style: "absurdist deconstruction - treats VC websites as performance art pieces about money" },
    { name: "Sick Nylvester", style: "personal narratives about founders he's known, weird tangents about Sand Hill Road" },
    { name: "Drent BiCrescenzo", style: "compares VC websites to album art, surprisingly vulnerable about wealth anxiety" },
    { name: "Shyan Rreiber", style: "historically minded, connects modern VCs to the original whaling venture capitalists" },
    { name: "Hessica Jopper", style: "feminist lens, calls out the bro culture embedded in design choices" }
];

function getRandomReviewer() {
    return reviewers[Math.floor(Math.random() * reviewers.length)];
}

function generateRating() {
    // VCs tend toward mediocre ratings - they're not trying to be good websites
    const base = 3.5 + Math.random() * 3.5;
    return Math.round(base * 10) / 10;
}

function generateReviewHTML(vc, review, reviewer, rating) {
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

// For now, just output the list - actual generation needs the Anthropic API
console.log('VC Firms to review:');
vcFirms.forEach((vc, i) => {
    console.log(`${i + 1}. ${vc.name} (${vc.url}) - ${vc.slug}.html`);
});

console.log('\nTo generate reviews, you need to call the Anthropic API.');
console.log('Export this list and structure for use in review generation.');

// Export for use
module.exports = { vcFirms, reviewers, generateReviewHTML, getRandomReviewer, generateRating };
