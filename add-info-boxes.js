// Script to add info boxes to all review pages
const fs = require('fs');
const path = require('path');

// Site data with founding dates and pithy descriptions
const siteData = {
    // AI Platform
    "replicate": { founded: "2019", pithy: "ML Models as a Service" },
    "descript": { founded: "2017", pithy: "AI-Powered Video Editing" },
    "runway": { founded: "2018", pithy: "Creative AI Tools" },
    "hugging-face": { founded: "2016", pithy: "Open Source AI Hub" },
    "anthropic": { founded: "2021", pithy: "AI Safety Research" },
    "perplexity": { founded: "2022", pithy: "AI Search Engine" },
    "stability-ai": { founded: "2019", pithy: "Open Source Image AI" },
    "midjourney": { founded: "2021", pithy: "AI Art Generator" },
    "openai": { founded: "2015", pithy: "The AI Hegemon" },

    // Analytics
    "posthog": { founded: "2020", pithy: "Open Source Product Analytics" },
    "amplitude": { founded: "2012", pithy: "Product Analytics Platform" },

    // CRM
    "zendesk": { founded: "2007", pithy: "Customer Service Software" },
    "salesforce": { founded: "1999", pithy: "CRM Empire" },

    // Collaboration
    "miro": { founded: "2011", pithy: "Digital Whiteboard" },

    // Communication
    "hey": { founded: "2020", pithy: "Opinionated Email" },
    "loom": { founded: "2015", pithy: "Async Video Messaging" },
    "mmhmm": { founded: "2020", pithy: "Video Presentation Tool" },
    "intercom": { founded: "2011", pithy: "Customer Messaging Platform" },
    "slack": { founded: "2013", pithy: "Workplace Chat" },
    "zoom": { founded: "2011", pithy: "Video Conferencing" },

    // Creator Economy
    "kickstarter": { founded: "2009", pithy: "Crowdfunding Pioneer" },
    "metalabel": { founded: "2022", pithy: "Collective Creativity Platform" },
    "the-creative-independent": { founded: "2016", pithy: "Artist Interviews & Guides" },
    "are-na": { founded: "2014", pithy: "Visual Bookmarking for Thinkers" },
    "ghost": { founded: "2013", pithy: "Open Source Publishing" },
    "artist-corporations": { founded: "2023", pithy: "Conceptual Art x Business" },
    "gumroad": { founded: "2011", pithy: "Creator Commerce" },
    "beehiiv": { founded: "2021", pithy: "Newsletter Growth Platform" },
    "podia": { founded: "2014", pithy: "All-in-One Creator Store" },
    "substack": { founded: "2017", pithy: "Newsletter Platform" },
    "circle": { founded: "2020", pithy: "Community Platform" },
    "convertkit": { founded: "2013", pithy: "Email for Creators" },
    "patreon": { founded: "2013", pithy: "Creator Membership Platform" },
    "ko-fi": { founded: "2012", pithy: "Digital Tip Jar" },
    "thinkific": { founded: "2012", pithy: "Online Course Platform" },
    "teachable": { founded: "2013", pithy: "Course Creation Platform" },
    "buy-me-a-coffee": { founded: "2018", pithy: "Creator Support Platform" },
    "stan-store": { founded: "2021", pithy: "Creator Link-in-Bio Store" },
    "kajabi": { founded: "2010", pithy: "Knowledge Commerce Platform" },
    "linktree": { founded: "2016", pithy: "Link-in-Bio Tool" },

    // Database
    "planetscale": { founded: "2018", pithy: "Serverless MySQL" },
    "neon": { founded: "2021", pithy: "Serverless Postgres" },
    "supabase": { founded: "2020", pithy: "Open Source Firebase" },
    "airtable": { founded: "2012", pithy: "Spreadsheet-Database Hybrid" },

    // Design Tools
    "figma": { founded: "2012", pithy: "Collaborative Design Tool" },
    "pitch": { founded: "2018", pithy: "Presentation Software" },
    "framer": { founded: "2013", pithy: "Interactive Design Tool" },
    "canva": { founded: "2012", pithy: "Design for Everyone" },
    "typeform": { founded: "2012", pithy: "Interactive Forms" },
    "webflow": { founded: "2013", pithy: "No-Code Web Design" },
    "squarespace": { founded: "2003", pithy: "Website Builder" },
    "adobe-creative-cloud": { founded: "2011", pithy: "Creative Software Suite" },

    // Developer Tools
    "resend": { founded: "2022", pithy: "Email API for Developers" },
    "railway": { founded: "2020", pithy: "Deploy Anything" },
    "linear": { founded: "2019", pithy: "Issue Tracking Reimagined" },
    "hashnode": { founded: "2020", pithy: "Developer Blogging" },
    "replit": { founded: "2016", pithy: "Browser-Based IDE" },
    "vercel": { founded: "2015", pithy: "Frontend Cloud Platform" },
    "liveblocks": { founded: "2020", pithy: "Real-Time Collaboration APIs" },
    "cursor": { founded: "2022", pithy: "AI Code Editor" },
    "github": { founded: "2008", pithy: "Code Hosting Platform" },
    "retool": { founded: "2017", pithy: "Internal Tools Builder" },

    // E-commerce
    "shopify": { founded: "2006", pithy: "E-commerce Platform" },
    "wix": { founded: "2006", pithy: "Website Builder" },

    // Enterprise
    "servicenow": { founded: "2003", pithy: "IT Service Management" },
    "sap": { founded: "1972", pithy: "Enterprise Software Giant" },
    "box": { founded: "2005", pithy: "Cloud Content Management" },
    "oracle-cloud": { founded: "2016", pithy: "Enterprise Cloud" },
    "workday": { founded: "2005", pithy: "HR & Finance Software" },

    // Marketing
    "mailchimp": { founded: "2001", pithy: "Email Marketing Platform" },
    "hubspot": { founded: "2006", pithy: "Marketing Automation" },

    // Payments
    "stripe": { founded: "2010", pithy: "Payment Infrastructure" },

    // Productivity
    "obsidian": { founded: "2020", pithy: "Local-First Notes" },
    "superhuman": { founded: "2014", pithy: "Fastest Email Experience" },
    "arc": { founded: "2022", pithy: "Reimagined Browser" },
    "raycast": { founded: "2020", pithy: "Productivity Launcher" },
    "craft": { founded: "2019", pithy: "Beautiful Docs" },
    "cron": { founded: "2021", pithy: "Calendar Reimagined" },
    "notion": { founded: "2016", pithy: "All-in-One Workspace" },
    "dropbox": { founded: "2007", pithy: "Cloud Storage Pioneer" },
    "readwise": { founded: "2017", pithy: "Highlight Aggregator" },
    "evernote": { founded: "2004", pithy: "Digital Note-Taking" },
    "calendly": { founded: "2013", pithy: "Scheduling Automation" },
    "google-workspace": { founded: "2006", pithy: "Productivity Suite" },
    "docusign": { founded: "2003", pithy: "Electronic Signatures" },
    "microsoft-365": { founded: "2011", pithy: "Office in the Cloud" },

    // Project Management
    "trello": { founded: "2011", pithy: "Kanban Boards" },
    "asana": { founded: "2008", pithy: "Work Management" },
    "monday-com": { founded: "2012", pithy: "Work OS" },
    "clickup": { founded: "2017", pithy: "All-in-One Productivity" }
};

// Process all review files
const reviewsDir = path.join(__dirname, 'reviews');
const files = fs.readdirSync(reviewsDir).filter(f => f.endsWith('.html'));

let updatedCount = 0;

files.forEach(filename => {
    const filepath = path.join(reviewsDir, filename);
    let html = fs.readFileSync(filepath, 'utf8');

    // Skip if already has info-box
    if (html.includes('class="info-box"')) {
        console.log(`⏭️  Skipped (already has info box): ${filename}`);
        return;
    }

    // Get site key from filename
    const siteKey = filename.replace('.html', '');
    const data = siteData[siteKey];

    if (!data) {
        console.log(`⚠️  No data for: ${filename}`);
        return;
    }

    // Extract site name and URL from review
    const titleMatch = html.match(/<h1 class="review-title">([^<]+)<\/h1>/);
    const urlMatch = html.match(/<a href="([^"]+)" target="_blank">([^<]+)<\/a>/);

    const siteName = titleMatch ? titleMatch[1] : siteKey;
    const siteUrl = urlMatch ? urlMatch[2] : siteKey + '.com';
    const fullUrl = urlMatch ? urlMatch[1] : 'https://' + siteKey + '.com';

    // Create info box HTML
    const infoBox = `
        <div class="info-box">
            <div class="info-box-title">Site Information</div>
            <div class="info-box-row"><span class="info-box-label">Name:</span> ${siteName}</div>
            <div class="info-box-row"><span class="info-box-label">URL:</span> <a href="${fullUrl}" target="_blank">${siteUrl}</a></div>
            <div class="info-box-row"><span class="info-box-label">Founded:</span> ${data.founded}</div>
            <div class="info-box-row"><span class="info-box-label">Type:</span> ${data.pithy}</div>
        </div>
`;

    // Insert info box after the review-header div
    html = html.replace(
        /(<\/div>\s*<div class="review-body">)/,
        `</div>\n${infoBox}\n        <div class="review-body">`
    );

    fs.writeFileSync(filepath, html);
    console.log(`✓ Updated: ${filename}`);
    updatedCount++;
});

console.log(`\n✓ Done! Updated ${updatedCount} review files.`);
