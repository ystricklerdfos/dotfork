// DOTFORK Review Generator

const reviewers = [
    { name: "Marcus Thorne", style: "precise" },
    { name: "Diana Castellano", style: "philosophical" },
    { name: "Jamie Kowalski", style: "brooklyn" },
    { name: "Sam Chen", style: "ruthless" },
    { name: "Alex Reeves", style: "gonzo" }
];

const categories = [
    "SaaS", "Productivity", "Developer Tools", "AI Platform", "Design Tools",
    "E-commerce", "Database", "Analytics", "Payments", "Infrastructure",
    "Communication", "Project Management", "CRM", "Marketing", "Security",
    "Social Media", "Content Management", "Collaboration", "Education", "Finance"
];

// More negative rating range
function generateRating() {
    const base = 4.5 + Math.random() * 3.5; // 4.5 to 8.0, mostly 5-7
    return Math.round(base * 10) / 10;
}

function getReviewer() {
    return reviewers[Math.floor(Math.random() * reviewers.length)];
}

function getCategory() {
    return categories[Math.floor(Math.random() * categories.length)];
}

function extractDomain(url) {
    try {
        const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return url;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateParagraphs(websiteName, rating) {
    const allOpenings = [
        `${websiteName} sent me a marketing email that said "We're changing the way teams work" and I laughed so hard I choked on my coffee. Every SaaS company thinks they're revolutionary. Most are just Trello with different colored buttons.`,
        `I've been hate-using ${websiteName} for six months. Not using it ironically, actually using it, but with this constant low-grade resentment that feels like heartburn. My therapist says I should just switch platforms but she doesn't understand sunk costs.`,
        `The landing page for ${websiteName} auto-played a video. In 2026. AUTO-PLAYED A VIDEO. I immediately wanted to give them a 0.0 but our rating system doesn't go that low. Consider this a mercy.`,
        `My coworker won't shut up about ${websiteName}. "It's a game-changer," he says. "It's transformative," he says. He also thinks Andrew Tate has good points so maybe trust his recommendations with caution.`,
        `${websiteName} is the answer to a question nobody asked. But they asked it anyway, raised $50 million in funding, and now we're all stuck pretending this is innovative.`,
        `I signed up for ${websiteName} during a moment of weakness—you know, that 2am desperation where you think a new productivity tool will finally make you the person you keep promising yourself you'll become. Spoiler: it didn't.`,
        `There's a Chrome extension that blocks ${websiteName} from loading. I should install it. I won't, but I should. That's the real review right there.`,
        `${websiteName} won a "Best of" award from some website I've never heard of and they put it on their homepage like it means something. Participation trophies for SaaS companies. This is where we're at.`
    ];

    const allPricingRoasts = [
        `The pricing page has three tiers: "Broke," "Still Broke But Pretending," and "Call Us (You Can't Afford It)." I picked the middle one and regretted it immediately.`,
        `They hide the actual price behind a "Contact Sales" button. You know what that means? It means if you have to ask, you're not the target market. I asked anyway. They quoted me a number that made my bank account file a restraining order.`,
        `Free tier caps you at three projects. THREE. My anxiety has more ongoing projects than that. This is artificial scarcity as a business model and I'm furious it works.`,
        `The pricing increases 300% between tiers. Not 30%. THREE HUNDRED. And the features you actually need are all in the expensive tier. This is extortion with good UX.`,
        `Monthly billing is $29. Annual is $290. That's not a discount, that's just the monthly price times twelve with a "fuck you" attached. They think we can't do math.`,
        `Every feature I need is listed as "Enterprise only." Great. Love paying enterprise prices for a todo list. Really makes me feel like I'm running Fortune 500 companies from my studio apartment.`,
        `The free trial lasts 14 days which sounds generous until you realize it takes 15 days to actually understand if the software does what you need. Calculated cruelty.`,
        `They email me about upgrading twice a week. TWICE A WEEK. I'm using the free tier on purpose, not because I don't know paid plans exist. Read the room.`
    ];

    const allDesignRoasts = [
        `The UI looks like someone told a designer "make it look expensive" and they just added more whitespace. Congratulations, you've reinvented empty space.`,
        `Every button is a different shade of blue and none of them do what you think they'll do. It's like playing Russian Roulette but instead of dying you just accidentally delete all your work.`,
        `They use a custom font that makes lowercase L and uppercase I look identical. This has caused problems. Many problems. Problems that haunt me.`,
        `The dark mode is just inverted colors. They didn't even try. It looks like a photographic negative and gives me headaches. But sure, call it "premium."`,
        `Tooltips appear when you hover for 0.2 seconds and disappear if you move your mouse 1 pixel. The UX designer clearly hates everyone and wants us to suffer.`,
        `The mobile app is just the website in a WebView. They charged me $4.99 for a bookmark. I paid it. I'm part of the problem.`,
        `Everything animates. EVERYTHING. Buttons fade in. Text slides. Modals bounce. I just want to check my email without feeling like I'm in a PowerPoint presentation from 2007.`,
        `The settings page has 47 options. FORTY-SEVEN. And none of them let you disable the thing that's actually annoying you. It's like they knew.`
    ];

    const allMiddleRants = [
        `I tried to cancel my subscription and they made me fill out a survey. Not optional—REQUIRED. Seven questions about why I'm leaving. The last question was "What would make you stay?" and I wrote "let me cancel without this bullshit survey" but I don't think they read it.`,
        `Customer support is a chatbot named something like "Zippy" or "Buddy" that can't actually help with anything. After fifteen minutes of "I didn't understand that, can you rephrase?" you get transferred to a human who's clearly as dead inside as you are.`,
        `They pushed an update that moved everything I'd learned where stuff was. No warning. No changelog. Just woke up to chaos. They called it "improvements." I called it violence.`,
        `The documentation is written in this cheerful corporate voice that makes me want to scream. "Let's get started!" No. I don't want to get started. I want clear instructions without the enthusiasm of a kindergarten teacher on cocaine.`,
        `They integrate with 500 other apps but not the one thing I actually use. Of course. Why would anything be easy. Why would I get to have nice things.`,
        `Every email from them has "We've been hard at work" in the subject line. Cool. So have I. The difference is I'm not sending you emails about it twice a week.`,
        `They have a community forum where people ask questions and other users respond with "Did you try turning it off and on again?" This is what passes for support. We've failed as a civilization.`,
        `The blog is 40% feature announcements, 40% thought leadership nobody asked for, and 20% "How we scaled to 10 million users" content for other SaaS companies. Nothing useful for actual users. Perfect.`
    ];

    const allEndingRants = [
        `I'm still using it. Why? Because I've already invested four hours configuring everything and the thought of doing that again somewhere else makes me want to walk into the ocean. This is how they win. Not by being good. By making leaving worse than staying.`,
        `The thing that really gets me is that it ALMOST works. Like 70% of the time it does what I need. That other 30%? Pure chaos. But that 70% is enough to keep me subscribed like a gambler at a slot machine who just needs one more spin.`,
        `Everyone I know uses this. Everyone. So even though I hate it, even though it's overpriced and broken and designed by people who've never actually done the work they claim to facilitate, I'm stuck with it. Network effects are a prison.`,
        `You know what the worst part is? They're going to read this review and send me a canned response about "valuing feedback" and "constantly improving." They won't change anything. They never do. But they'll sure as hell use "As seen in DOTFORK" in their marketing.`,
        `I would switch to a competitor but they're all exactly as bad in slightly different ways. This is the software equivalent of choosing which ankle you want broken. There are no winners here.`,
        `My annual renewal is coming up. I should cancel. I won't cancel. I'll pay the $290 or whatever and I'll complain about it for another year. This is my life now. This is all of our lives now.`,
        `If you're considering signing up: don't. But you will anyway because you're reading this review which means you're already in too deep. Welcome to hell. The password reset email will arrive in 4-6 business days.`,
        `I have dreams where I'm not using this software. Where I've figured out a better way. Where I'm free. Then I wake up and there's a push notification about a new feature I didn't ask for. The cycle continues.`
    ];

    const neutralEndings = [
        `Look, it's not completely terrible. The core functionality works. Most of the time. When it doesn't crash. Which is more than I can say for some of their competitors. This is damning with faint praise but that's all I've got.`,
        `After six months I've developed Stockholm Syndrome. The bugs feel like personality quirks now. The missing features are "room for growth." I've convinced myself this is fine. It's not fine. But it's fine.`,
        `For what it's worth, they haven't gotten hacked yet. That I know of. This is apparently the highest praise I can give software in 2026: "probably not currently leaking your data." The bar is in hell.`,
        `It does what it says on the tin. The problem is what it says on the tin is "revolutionize your workflow" when really it should say "slightly automate some stuff you could do in a spreadsheet." Truth in advertising is dead.`
    ];

    // Shuffle and pick
    const opening = shuffle([...allOpenings])[0];
    const pricing = shuffle([...allPricingRoasts])[0];
    const design = shuffle([...allDesignRoasts])[0];
    const middle = shuffle([...allMiddleRants])[0];

    let ending;
    if (rating >= 7.0) {
        ending = shuffle([...neutralEndings])[0];
    } else {
        ending = shuffle([...allEndingRants])[0];
    }

    return [opening, pricing, design, middle, ending];
}

function generateVerdict(websiteName, rating, category) {
    const verdicts = [
        `${websiteName}: because apparently we needed another ${category.toLowerCase()} tool. We didn't, but here we are.`,
        `Charging money for problems they created themselves. Capitalism working as intended.`,
        `The software equivalent of a participation trophy. It exists. That's the whole review.`,
        `My bank account is lighter, my workflow is not smoother, and my faith in humanity continues its steady decline.`,
        `They're not changing the game. They're not disrupting anything. They're just… here. Aggressively mediocre and expensive.`,
        `Rating reflects the gap between what they promise and what they deliver, minus points for every passive-aggressive tooltip.`,
        `I've wasted hours I'll never get back on this. You will too. At least we'll suffer together.`,
        `The "innovative" features are just basic functionality with marketing copy. The actual innovative part is how much they charge for it.`,
        `Congrats to ${websiteName} for making something that technically works but is absolutely no fun to use. A joyless experience all around.`,
        `This would be fine if it was free. It's not free. That's the problem.`,
        `Every feature feels half-finished and over-promised. It's like paying for a Tesla and getting a golf cart with a software subscription.`,
        `The only thing revolutionary here is how they've revolutionized my capacity for disappointment.`,
        `${rating.toFixed(1)} because nothing deserves a 10 and most things deserve less than this got.`,
        `Made by people who've clearly never experienced the actual problem they claim to solve.`,
        `If this is the future of work, I'm applying to become a lighthouse keeper.`
    ];

    return "<strong>VERDICT:</strong> " + shuffle([...verdicts])[0];
}

function generateReviewContent(websiteName, url) {
    const reviewer = getReviewer();
    const category = getCategory();
    const rating = generateRating();
    const isBNW = rating >= 8.5; // Rare now with lower ratings

    const paragraphs = generateParagraphs(websiteName, rating);
    const verdict = generateVerdict(websiteName, rating, category);

    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return {
        title: websiteName,
        url: url,
        category: category,
        reviewer: reviewer.name,
        date: date,
        rating: rating,
        isBNW: isBNW,
        paragraphs: paragraphs,
        verdict: verdict
    };
}

document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const urlInput = document.getElementById('websiteUrl').value.trim();
    const nameInput = document.getElementById('websiteName').value.trim();

    if (!urlInput) {
        alert('Please enter a website URL');
        return;
    }

    const domain = extractDomain(urlInput);
    const websiteName = nameInput || domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);

    const review = generateReviewContent(websiteName, urlInput);

    document.getElementById('outputTitle').textContent = review.title;
    document.getElementById('outputMeta').textContent = review.category + ' | Reviewed by ' + review.reviewer + ' | ' + review.date;
    document.getElementById('outputUrl').textContent = domain;
    document.getElementById('outputUrl').href = urlInput.startsWith('http') ? urlInput : 'https://' + urlInput;
    document.getElementById('outputRating').textContent = review.rating;

    if (review.isBNW) {
        document.getElementById('outputBadge').innerHTML = '<span class="bnw-badge">Best New Website</span>';
    } else {
        document.getElementById('outputBadge').innerHTML = '';
    }

    let bodyHTML = '';
    review.paragraphs.forEach(p => {
        bodyHTML += '<p>' + p + '</p>';
    });
    document.getElementById('outputBody').innerHTML = bodyHTML;

    document.getElementById('outputVerdict').innerHTML = review.verdict;

    document.getElementById('reviewOutput').style.display = 'block';
    document.getElementById('reviewOutput').scrollIntoView({ behavior: 'smooth' });
});
