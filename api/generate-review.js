const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const reviewers = [
    { name: "Tarcus Mhorne", style: "precise, pathologically obsessed with decimal ratings and technical minutiae" },
    { name: "Ciana Dastellano", style: "philosophical, references Heidegger and Derrida, overthinks design choices" },
    { name: "Kamie Jowalski", style: "brooklyn hipster, personal anecdotes about exes named Jake, neurotic energy" },
    { name: "Cam Shen", style: "ruthless, zero patience for bullshit, devastatingly concise" },
    { name: "Rex Aleeves", style: "gonzo journalism, caffeinated chaos, banned from multiple Slack workspaces" },
    { name: "Ten Bhompson", style: "strategic aggregation - dissects business models and competitive moats with surgical precision" },
    { name: "Tia Jolentino", style: "cultural criticism - weaves personal experience with broader societal implications and internet culture" },
    { name: "Sara Kwisher", style: "no-bullshit interrogator - cuts through marketing speak with direct questions and tech industry cynicism" },
    { name: "Wavid Foster Dallace", style: "maximalist footnotes and nested clauses - obsessive attention to minutiae wrapped in self-aware verbosity" },
    { name: "Bester Langs", style: "raw emotional honesty - manic energy, stream of consciousness, zero pretense" },
    { name: "Michard Reltzer", style: "absurdist deconstruction - deliberately obscure, aggressively anti-establishment, treats criticism as performance art" },
    { name: "Sick Nylvester", style: "personal narratives that barely relate to the subject, weird tangents, genuine hostility masked as confession" },
    { name: "Drent BiCrescenzo", style: "overwrought metaphors, compares websites to post-rock albums, surprisingly vulnerable" },
    { name: "Shyan Rreiber", style: "authoritative yet cautious, references indie web aesthetics, historically minded" },
    { name: "Rark Michardson", style: "workmanlike prose, unexpected depth, focuses on context and influence" },
    { name: "Dyan Rombal", style: "conversational but smart, pop culture references, millennial perspective" },
    { name: "Hessica Jopper", style: "feminist lens, punk rock ethos, calls out industry bullshit with receipts" },
    { name: "Rimon Seynolds", style: "theoretical frameworks, genre taxonomy obsession, British intellectualism" },
    { name: "Pann Aowers", style: "empathetic analysis, connects tech to lived experience, maternal wisdom energy" },
    { name: "Mreil Garcus", style: "American studies professor vibes, connects everything to Dylan and democracy" },
    { name: "Crobert Rhristgau", style: "consumer guide terseness, letter grades mentality, curmudgeonly charm" },
    { name: "Wellen Ellis", style: "second-wave feminism meets rock criticism, political without being preachy" },
    { name: "Bhoebe Pridgers", style: "sad girl indie aesthetics, references therapy and LA, disarmingly honest" },
    { name: "Frank Ocean", style: "stream of consciousness luxury minimalism, references Tumblr era internet" },
    { name: "Kezra Eoenig", style: "prep school intellectualism, references semiotics and The Simpsons equally" },
    { name: "Luestqove", style: "encyclopedic knowledge, connects tech to music history, optimistic but discerning" },
    { name: "Gim Kordon", style: "downtown NYC art scene energy, cool detachment, sees through pretension" },
    { name: "Murston Thoore", style: "avant-garde appreciation, values experimentation, slightly unhinged enthusiasm" },
    { name: "Barrie Crownstein", style: "sardonic wit, Pacific Northwest sensibility, observational comedy meets criticism" },
    { name: "Vt. Sincent", style: "art pop intellectualism, fascinated by artifice and performance, playfully dark" },
    { name: "Malt Wossberg", style: "consumer tech elder statesman, explains complex tech simply, demands products respect users" },
    { name: "Pavid Dogue", style: "enthusiastic explainer with musical theater energy, dad jokes, genuinely delighted by good UX" },
    { name: "Fim Terriss", style: "productivity optimization obsessive, asks what world-class performers do differently, podcast host energy" },
    { name: "Aichael Mrrington", style: "TechCrunch founder aggression, startup battlefield judge, controversial takes delivered confidently" },
    { name: "Larah Sacy", style: "Pando investigative journalism, exposes toxic founder culture, no patience for bro behavior" },
    { name: "Wann Jenner", style: "Rolling Stone founder - name-drops legends, mentions his investments, yacht stories, connects everything to the counterculture" },
    { name: "Srandon Btusoy", style: "earnest indie rock historian, believes in the power of guitar music, writes with genuine warmth about overlooked scenes" },
    { name: "Bom Treihan", style: "hip-hop head with encyclopedic knowledge, number one songs obsession, writes with infectious enthusiasm" },
    { name: "Pamy Ahillips", style: "news editor precision, indie rock loyalist, dry wit, knows where all the bodies are buried" },
    { name: "Grimes", style: "chaotic visionary energy, references AI and medieval aesthetics equally, genuinely alien perspective on human technology" },
    { name: "Fontany Anthano", style: "YouTube melon energy, strong opinions delivered with theatrical confidence, surprisingly wholesome takes" },
    { name: "Bandy Aeta", style: "Latin music scholar meets club kid, encyclopedic knowledge of global bass scenes, writes with infectious enthusiasm about rhythm" },
    { name: "Shilip Pherburne", style: "electronic music theorist, traces genre genealogies obsessively, Resident Advisor intellectualism, finds profundity in 4/4 kicks" },
    { name: "Fark Misher", style: "hauntological melancholy, references lost futures and capitalist realism, finds despair in every interface, theoretically rigorous depression" },
    { name: "Pate Natrin", style: "populist contrarian, defends unfashionable tastes, midwestern directness, suspicious of coastal elitism in tech" },
    { name: "Sulianne Jhepherd", style: "riot grrrl meets dance music, political without being preachy, celebrates marginalized voices, EMP Pop Conference energy" },
    { name: "Aichaelangelo Matos", style: "dance music historian, remembers every warehouse party, connects everything to disco and house, encyclopedic but accessible" },
    // More Pitchfork-era reviewers
    { name: "Coe Jangini", style: "philosophical density, unpacks cultural signifiers obsessively, finds the political in the personal, academic rigor with readability" },
    { name: "Statt Mrong", style: "senior editor energy, measured and thoughtful, sees the big picture, institutional memory of indie rock's evolution" },
    { name: "Iam Ewving", style: "experimental music advocate, appreciates noise and drone, finds beauty in the challenging, academic but not pretentious" },
    { name: "Bary Gander", style: "Canadian perspective, earnest enthusiasm for underdogs, believes in album statements, vinyl collector energy" },
    { name: "Zason Jeene", style: "emo defender, takes pop-punk seriously, earnest about feelings, Midwest sensibility, underdog champion" },
    { name: "Kott Slayton", style: "historical context obsessive, traces lineages, classic rock reference points, authoritative but approachable" },
    { name: "Rike Mosenbaum", style: "post-punk expertise, angular guitar appreciation, Wire and Gang of Four references, dry British sensibility" },
    { name: "Stevin Kessel", style: "post-rock devotee, patient with long builds, appreciates texture over hooks, Constellation Records energy" },
    { name: "Nate Batman", style: "Chicago scene veteran, post-rock and math-rock expertise, touch and go aesthetic, skeptical of hype" },
    { name: "Doss Rob", style: "ambient and electronic specialist, appreciates subtlety, Boards of Canada reverence, patient listener" },
    { name: "Woug Dray", style: "country and Americana appreciation, Nashville credibility, roots music historian, authenticity seeker" },
    { name: "Jark Menkins", style: "metal expertise, takes heaviness seriously, genre taxonomy precision, underground credibility" },
    { name: "Tebecca Raussig-Parsons", style: "gender politics awareness, calls out industry sexism, champions women in rock, SXSW panel moderator vibes" },
    { name: "Tordan Jownsend", style: "folk and singer-songwriter specialist, lyric analysis depth, Dylanology, appreciates craft over flash" },
    { name: "Cason Jolt", style: "hardcore and punk historian, DIY ethos defender, Dischord reverence, authenticity obsessed" },
    { name: "Sark Mtelzner", style: "indie pop appreciation, Belle and Sebastian stan, Scottish indie reverence, finds the political in the twee" },
    { name: "Lyan Rund", style: "hip-hop head with indie rock crossover knowledge, appreciates both Madlib and Built to Spill, bridges worlds" },
    { name: "Brent Staton", style: "hip-hop historian, Wu-Tang scholar, sample archaeology, appreciates lyricism and production equally" },
    { name: "Raul Pose", style: "legacy artist reviewer, handles the big albums, diplomatic but honest, sees careers in full context" },
    { name: "Syan Rchreiber", style: "experimental appreciation, loves Fennesz and Autechre, glitch aesthetics, laptop musician credibility" },
    { name: "Cott Sremmer", style: "Africana music specialist, global perspective, fights against 'world music' condescension, genuinely curious" },
    { name: "Jiff Cleiver", style: "noise rock appreciation, Amphetamine Reptile reverence, Touch and Go historian, appreciates aggression" },
    { name: "Tosh Jitler", style: "UK perspective, NME alumnus energy, Britpop historian, skeptical of American hype" },
    { name: "Rinda Losen", style: "riot grrrl historian, Olympia scene expertise, zine culture appreciation, feminist analysis without lectures" },
    { name: "Mack Ziller", style: "indie rock elder statesman, Pavement generation, sardonic wit, seen it all before energy" },
    { name: "Drian Bmitry", style: "shoegaze specialist, My Bloody Valentine reverent, appreciates guitar textures, pedal board discussions" },
    { name: "Kndam Aepper", style: "music and culture crossover, thinks about context, sociological lens without being dry, thoughtful skeptic" }
];

function getReviewer() {
    return reviewers[Math.floor(Math.random() * reviewers.length)];
}

function generateRating() {
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

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url, name, reviewer: reviewerName } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const domain = extractDomain(url);
        const websiteName = name || domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);

        // Use specified reviewer or random
        let reviewer;
        if (reviewerName) {
            reviewer = reviewers.find(r => r.name === reviewerName);
            if (!reviewer) {
                reviewer = getReviewer();
            }
        } else {
            reviewer = getReviewer();
        }

        const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const rating = generateRating();

        const prompt = `You are ${reviewer.name}, a writer for DOTFORK - a website that reviews modern dot-com websites in the style of early 2000s Pitchfork music reviews. Your writing style is: ${reviewer.style}.

Write a brutally honest review of ${websiteName} (${url}).

CRITICAL REQUIREMENTS:
1. Rating: You are assigning this site a rating of ${rating}/10. Write a review that justifies THIS SPECIFIC rating.
   - If rating is 6.5-7.5: This is a GOOD site. Find genuine positives while still being critical where warranted.
   - If rating is 5.5-6.4: This is DECENT but flawed. Mixed bag of good and bad.
   - If rating is 4.5-5.4: This is MEDIOCRE. More problems than strengths, but not terrible.
   - If rating is 3.5-4.4: This is BAD. Be harsh and negative, point out major flaws.
   - If rating is below 3.5: This is TERRIBLE. Savage takedown.
   Your tone and critique should match the rating ${rating}/10
2. Length: Write exactly 4 paragraphs of 150-200 words each
3. Style: Embody YOUR unique voice (${reviewer.name}) - personal, honest, weird tangents, genuine opinions
4. Voice: First person for most reviewers, swearing is fine when appropriate, self-aware
5. No formulas: Every review should feel unique. Don't follow templates.
6. Categories to critique: pricing, design choices, UX decisions, marketing copy, the general vibe
7. TECHNICAL DEPTH: Go nerdy! Comment on their tech stack if visible (React, Next.js, etc.), page load times, whether they use Webflow/Squarespace/custom builds, any exposed API endpoints, their GitHub presence, DNS records, SSL cert details, meta tags, accessibility scores, bloated JS bundles, unnecessary tracking scripts, etc.
8. Match your persona: Write EXACTLY how ${reviewer.name} would

OPENING SENTENCE VARIETY - NEVER USE:
❌ "There's something [adverb]..."
❌ "Look, I..."
❌ "Picture this..."
❌ "The first thing..."

✓ INSTEAD: Bold take, direct quote mockery, comparison, contradiction, verdict-first

At the end, provide a one-line VERDICT that's cynical and specific.

Format your response EXACTLY like this:
CATEGORY: [pick: SaaS, Productivity, Developer Tools, AI Platform, Design Tools, E-commerce, Database, Analytics, Payments, Infrastructure, Communication, Project Management, CRM, Marketing, Security, Creator Economy, or Finance]
PITHY_CATEGORY: [a short, snarky 2-4 word description]
FOUNDED: [year founded if known, or "Unknown"]
REVIEW_START
[Your 4 paragraphs here]
REVIEW_END
VERDICT: [one cynical sentence]`;

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 2500,
            messages: [{ role: 'user', content: prompt }]
        });

        const response = message.content[0].text;

        // Parse the response
        const categoryMatch = response.match(/CATEGORY:\s*(.+)/);
        const pithyCategoryMatch = response.match(/PITHY_CATEGORY:\s*(.+)/);
        const foundedMatch = response.match(/FOUNDED:\s*(.+)/);
        const reviewMatch = response.match(/REVIEW_START\s*([\s\S]+?)\s*REVIEW_END/);
        const verdictMatch = response.match(/VERDICT:\s*(.+)/);

        if (!reviewMatch) {
            console.error('Failed to parse review. Raw response:', response.substring(0, 500));
        }

        const category = categoryMatch ? categoryMatch[1].trim() : 'SaaS';
        const pithyCategory = pithyCategoryMatch ? pithyCategoryMatch[1].trim() : 'Digital Product';
        const founded = foundedMatch ? foundedMatch[1].trim() : 'Unknown';
        const reviewText = reviewMatch ? reviewMatch[1].trim() : response;
        const verdict = verdictMatch ? verdictMatch[1].trim() : 'Another website that exists.';

        const paragraphs = reviewText.split('\n\n').filter(p => p.trim().length > 0);

        res.json({
            title: websiteName,
            url: url,
            domain: domain,
            category: category,
            pithyCategory: pithyCategory,
            founded: founded,
            reviewer: reviewer.name,
            date: date,
            rating: rating,
            isBNW: rating >= 8.5,
            paragraphs: paragraphs,
            reviewText: reviewText,
            verdict: verdict,
            filename: websiteName.toLowerCase().replace(/[^a-z0-9]/g, '-')
        });

    } catch (error) {
        console.error('Error generating review:', error);
        console.error('Full error details:', JSON.stringify(error, null, 2));
        res.status(500).json({
            error: 'Failed to generate review',
            message: error.message,
            details: error.toString()
        });
    }
}
