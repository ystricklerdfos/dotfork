// Script to generate 400 reviews for DOTFORK
// Run with: node generate-reviews.js

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const reviewers = [
    { name: "Marcus Thorne", style: "precise, pathologically obsessed with decimal ratings" },
    { name: "Diana Castellano", style: "philosophical, references Heidegger and overthinks everything" },
    { name: "Jamie Kowalski", style: "brooklyn hipster, personal anecdotes about exes and people named Jake" },
    { name: "Sam Chen", style: "ruthless, zero patience for bullshit" },
    { name: "Alex Reeves", style: "gonzo journalism, caffeinated energy, banned from Slack channels" }
];

// 400 websites organized by category
const websites = {
    "AI Platform": [
        { name: "OpenAI", url: "openai.com", desc: "ChatGPT makers, AGI hype machine" },
        { name: "Anthropic", url: "anthropic.com", desc: "Constitutional AI, safety theater" },
        { name: "Replicate", url: "replicate.com", desc: "YC: Run AI models via API" },
        { name: "Hugging Face", url: "huggingface.co", desc: "AI model hub, emoji branding" },
        { name: "Midjourney", url: "midjourney.com", desc: "AI art generator, Discord-based chaos" },
        { name: "Stability AI", url: "stability.ai", desc: "Stable Diffusion creators" },
        { name: "Runway", url: "runwayml.com", desc: "NYC: AI video editing tools" },
        { name: "Character.AI", url: "character.ai", desc: "Chat with AI personalities" },
        { name: "Jasper", url: "jasper.ai", desc: "AI marketing copy generator" },
        { name: "Copy.ai", url: "copy.ai", desc: "Another AI writing tool" },
        { name: "Lex", url: "lex.page", desc: "AI-powered writing app" },
        { name: "Tome", url: "tome.app", desc: "AI presentation maker" },
        { name: "Descript", url: "descript.com", desc: "AI video/audio editor" },
        { name: "ElevenLabs", url: "elevenlabs.io", desc: "AI voice cloning" },
        { name: "Synthesia", url: "synthesia.io", desc: "AI video avatars" },
        { name: "Perplexity", url: "perplexity.ai", desc: "AI search engine" },
        { name: "You.com", url: "you.com", desc: "AI-powered search" },
        { name: "Phind", url: "phind.com", desc: "AI search for developers" },
        { name: "Cursor", url: "cursor.sh", desc: "AI code editor" },
        { name: "Replit", url: "replit.com", desc: "Online IDE with AI" },
    ],

    "Developer Tools": [
        { name: "Linear", url: "linear.app", desc: "Issue tracking for the tasteful" },
        { name: "Vercel", url: "vercel.com", desc: "Deploy button as a business model" },
        { name: "GitHub", url: "github.com", desc: "Microsoft-owned code host" },
        { name: "GitLab", url: "gitlab.com", desc: "GitHub alternative with opinions" },
        { name: "Supabase", url: "supabase.com", desc: "YC: Open source Firebase" },
        { name: "PlanetScale", url: "planetscale.com", desc: "Serverless MySQL" },
        { name: "Railway", url: "railway.app", desc: "Heroku for Gen Z" },
        { name: "Render", url: "render.com", desc: "Another Heroku replacement" },
        { name: "Fly.io", url: "fly.io", desc: "Deploy apps globally, somehow" },
        { name: "Neon", url: "neon.tech", desc: "Serverless Postgres" },
        { name: "Convex", url: "convex.dev", desc: "YC: Backend as a service" },
        { name: "Clerk", url: "clerk.dev", desc: "YC: Auth for developers" },
        { name: "WorkOS", url: "workos.com", desc: "Enterprise features as API" },
        { name: "Resend", url: "resend.com", desc: "Email API for developers" },
        { name: "Trigger.dev", url: "trigger.dev", desc: "Background jobs platform" },
        { name: "Inngest", url: "inngest.com", desc: "Durable workflows" },
        { name: "Upstash", url: "upstash.com", desc: "Serverless Redis" },
        { name: "Axiom", url: "axiom.co", desc: "Serverless logging" },
        { name: "Sentry", url: "sentry.io", desc: "Error tracking that never shuts up" },
        { name: "PostHog", url: "posthog.com", desc: "YC: Open source analytics" },
    ],

    "Design Tools": [
        { name: "Figma", url: "figma.com", desc: "Adobe-owned design monopoly" },
        { name: "Framer", url: "framer.com", desc: "No-code for designers" },
        { name: "Webflow", url: "webflow.com", desc: "No-code website builder" },
        { name: "Canva", url: "canva.com", desc: "Design for people who can't design" },
        { name: "Spline", url: "spline.design", desc: "3D design in browser" },
        { name: "Rive", url: "rive.app", desc: "Interactive animations" },
        { name: "Miro", url: "miro.com", desc: "Infinite whiteboard hell" },
        { name: "FigJam", url: "figma.com/figjam", desc: "Figma's whiteboard spin-off" },
        { name: "Excalidraw", url: "excalidraw.com", desc: "Hand-drawn diagrams" },
        { name: "tldraw", url: "tldraw.com", desc: "Infinite canvas" },
        { name: "Pitch", url: "pitch.com", desc: "Presentation software" },
        { name: "Gamma", url: "gamma.app", desc: "AI-powered presentations" },
        { name: "Beautiful.ai", url: "beautiful.ai", desc: "Auto-formatting slides" },
        { name: "Loom", url: "loom.com", desc: "YC: Screen recording epidemic" },
        { name: "Descript", url: "descript.com", desc: "Video editing via text" },
        { name: "ScreenStudio", url: "screenstudio.lemonsqueezy.com", desc: "Pretty screen recordings" },
        { name: "Grain", url: "grain.com", desc: "Meeting recording tool" },
        { name: "tl;dv", url: "tldv.io", desc: "Meeting notes automation" },
        { name: "Whereby", url: "whereby.com", desc: "Zoom alternative nobody uses" },
        { name: "Around", url: "around.co", desc: "Video calls but aesthetic" },
    ],

    "Productivity": [
        { name: "Notion", url: "notion.so", desc: "Productivity theater as SaaS" },
        { name: "Obsidian", url: "obsidian.md", desc: "Note-taking for overthink​ers" },
        { name: "Roam Research", url: "roamresearch.com", desc: "$15/mo for a text editor" },
        { name: "Logseq", url: "logseq.com", desc: "Open source Roam clone" },
        { name: "Mem", url: "mem.ai", desc: "AI note-taking app" },
        { name: "Reflect", url: "reflect.app", desc: "Networked notes" },
        { name: "Craft", url: "craft.do", desc: "Pretty documents" },
        { name: "Coda", url: "coda.io", desc: "Docs that think they're databases" },
        { name: "Airtable", url: "airtable.com", desc: "Spreadsheets for people who hate Excel" },
        { name: "Monday.com", url: "monday.com", desc: "Colorful project management" },
        { name: "ClickUp", url: "clickup.com", desc: "Every feature ever conceived" },
        { name: "Asana", url: "asana.com", desc: "Task management from 2012" },
        { name: "Todoist", url: "todoist.com", desc: "Todo list with karma points" },
        { name: "Things", url: "culturedcode.com/things", desc: "Todo app for $50" },
        { name: "Any.do", url: "any.do", desc: "Another todo app" },
        { name: "Sunsama", url: "sunsama.com", desc: "Daily planning ritual" },
        { name: "Akiflow", url: "akiflow.com", desc: "Calendar + tasks" },
        { name: "Motion", url: "usemotion.com", desc: "AI calendar scheduling" },
        { name: "Reclaim", url: "reclaim.ai", desc: "YC: Auto-schedule habits" },
        { name: "Calendly", url: "calendly.com", desc: "Meeting scheduling hell" },
    ],

    "Communication": [
        { name: "Slack", url: "slack.com", desc: "Work chat that never sleeps" },
        { name: "Discord", url: "discord.com", desc: "Gamer chat for everyone" },
        { name: "Telegram", url: "telegram.org", desc: "Signal without the sanctimony" },
        { name: "Signal", url: "signal.org", desc: "Privacy-focused messaging" },
        { name: "WhatsApp", url: "whatsapp.com", desc: "Facebook-owned chat" },
        { name: "Twist", url: "twist.com", desc: "Async Slack alternative" },
        { name: "Campfire", url: "basecamp.com/campfire", desc: "Basecamp's chat thing" },
        { name: "Zulip", url: "zulip.com", desc: "Threaded chat nobody uses" },
        { name: "Mattermost", url: "mattermost.com", desc: "Self-hosted Slack" },
        { name: "Rocket.Chat", url: "rocket.chat", desc: "Another Slack clone" },
        { name: "Matrix", url: "matrix.org", desc: "Decentralized chat protocol" },
        { name: "Zoom", url: "zoom.us", desc: "Video calls we all hate" },
        { name: "Google Meet", url: "meet.google.com", desc: "Zoom but worse" },
        { name: "Microsoft Teams", url: "teams.microsoft.com", desc: "Enterprise video hell" },
        { name: "Gather", url: "gather.town", desc: "Virtual office nightmare" },
        { name: "Tandem", url: "tandem.chat", desc: "NYC: Always-on video" },
        { name: "Tuple", url: "tuple.app", desc: "Pair programming tool" },
        { name: "Pop", url: "pop.com", desc: "Screen sharing" },
        { name: "Loom", url: "loom.com", desc: "Async video messages" },
        { name: "Yac", url: "yac.com", desc: "Voice messaging for work" },
    ],

    "Payments": [
        { name: "Stripe", url: "stripe.com", desc: "Payment API everyone uses" },
        { name: "PayPal", url: "paypal.com", desc: "eBay-era payments" },
        { name: "Square", url: "square.com", desc: "Point of sale empire" },
        { name: "Braintree", url: "braintreepayments.com", desc: "PayPal's developer brand" },
        { name: "Adyen", url: "adyen.com", desc: "European Stripe" },
        { name: "Plaid", url: "plaid.com", desc: "Bank account connections" },
        { name: "Ramp", url: "ramp.com", desc: "NYC: Corporate cards" },
        { name: "Brex", url: "brex.com", desc: "YC: Startup credit cards" },
        { name: "Mercury", url: "mercury.com", desc: "YC: Banking for startups" },
        { name: "Lemon Squeezy", url: "lemonsqueezy.com", desc: "Stripe for digital products" },
        { name: "Paddle", url: "paddle.com", desc: "Merchant of record" },
        { name: "Gumroad", url: "gumroad.com", desc: "Sell digital products" },
        { name: "Ko-fi", url: "ko-fi.com", desc: "Buy me a coffee button" },
        { name: "Patreon", url: "patreon.com", desc: "Subscriptions for creators" },
        { name: "Substack", url: "substack.com", desc: "Newsletter platform" },
        { name: "Ghost", url: "ghost.org", desc: "Substack alternative" },
        { name: "Beehiiv", url: "beehiiv.com", desc: "Another newsletter tool" },
        { name: "ConvertKit", url: "convertkit.com", desc: "Email marketing" },
        { name: "Mailchimp", url: "mailchimp.com", desc: "Email from 2001" },
        { name: "SendGrid", url: "sendgrid.com", desc: "Transactional email" },
    ],

    "E-commerce": [
        { name: "Shopify", url: "shopify.com", desc: "Dropshipping enabler" },
        { name: "Amazon", url: "amazon.com", desc: "Everything store" },
        { name: "Etsy", url: "etsy.com", desc: "Handmade marketplace" },
        { name: "eBay", url: "ebay.com", desc: "Auction site from 1995" },
        { name: "WooCommerce", url: "woocommerce.com", desc: "WordPress shopping cart" },
        { name: "BigCommerce", url: "bigcommerce.com", desc: "Shopify alternative" },
        { name: "Wix", url: "wix.com", desc: "Website builder ads everywhere" },
        { name: "Squarespace", url: "squarespace.com", desc: "Beautiful templates tax" },
        { name: "Gumroad", url: "gumroad.com", desc: "Minimal ecommerce" },
        { name: "Lemlist", url: "lemlist.com", desc: "Cold email automation" },
        { name: "Instantly", url: "instantly.ai", desc: "Email outreach" },
        { name: "Smartlead", url: "smartlead.ai", desc: "Cold email at scale" },
        { name: "Reply.io", url: "reply.io", desc: "Sales automation" },
        { name: "Apollo", url: "apollo.io", desc: "B2B database" },
        { name: "Hunter", url: "hunter.io", desc: "Find email addresses" },
        { name: "Clearbit", url: "clearbit.com", desc: "Data enrichment" },
        { name: "ZoomInfo", url: "zoominfo.com", desc: "B2B contact data" },
        { name: "LinkedIn", url: "linkedin.com", desc: "Professional networking dystopia" },
        { name: "AngelList", url: "angellist.com", desc: "Startup jobs" },
        { name: "Wellfound", url: "wellfound.com", desc: "AngelList rebrand" },
    ],

    "CRM & Sales": [
        { name: "Salesforce", url: "salesforce.com", desc: "Enterprise CRM hell" },
        { name: "HubSpot", url: "hubspot.com", desc: "Marketing automation empire" },
        { name: "Pipedrive", url: "pipedrive.com", desc: "Sales CRM" },
        { name: "Close", url: "close.com", desc: "CRM for startups" },
        { name: "Attio", url: "attio.com", desc: "Modern CRM" },
        { name: "Folk", url: "folk.app", desc: "Relationship management" },
        { name: "Clay", url: "clay.com", desc: "Relationship tool" },
        { name: "Dex", url: "getdex.com", desc: "Personal CRM" },
        { name: "Monica", url: "monicahq.com", desc: "Open source CRM" },
        { name: "Copper", url: "copper.com", desc: "CRM for Google Workspace" },
        { name: "Freshsales", url: "freshsales.io", desc: "CRM from Freshworks" },
        { name: "Zoho", url: "zoho.com", desc: "Indian software suite" },
        { name: "Intercom", url: "intercom.com", desc: "Customer messaging" },
        { name: "Zendesk", url: "zendesk.com", desc: "Support ticketing" },
        { name: "Front", url: "front.com", desc: "Shared inbox" },
        { name: "Help Scout", url: "helpscout.com", desc: "Customer support" },
        { name: "Groove", url: "groove.co", desc: "Simple help desk" },
        { name: "Crisp", url: "crisp.chat", desc: "Live chat widget" },
        { name: "Drift", url: "drift.com", desc: "Conversational marketing" },
        { name: "Qualified", url: "qualified.com", desc: "Pipeline generation" },
    ],

    "Analytics": [
        { name: "Google Analytics", url: "analytics.google.com", desc: "Privacy nightmare analytics" },
        { name: "Plausible", url: "plausible.io", desc: "Privacy-friendly analytics" },
        { name: "Fathom", url: "usefathom.com", desc: "Simple analytics" },
        { name: "Mixpanel", url: "mixpanel.com", desc: "Product analytics" },
        { name: "Amplitude", url: "amplitude.com", desc: "Product analytics" },
        { name: "Heap", url: "heap.io", desc: "Auto-capture analytics" },
        { name: "PostHog", url: "posthog.com", desc: "YC: Open source analytics" },
        { name: "June", url: "june.so", desc: "B2B SaaS analytics" },
        { name: "Statsig", url: "statsig.com", desc: "Feature flags + analytics" },
        { name: "Split", url: "split.io", desc: "Feature flags" },
        { name: "LaunchDarkly", url: "launchdarkly.com", desc: "Feature management" },
        { name: "Segment", url: "segment.com", desc: "Customer data platform" },
        { name: "RudderStack", url: "rudderstack.com", desc: "Open source Segment" },
        { name: "Hightouch", url: "hightouch.com", desc: "Reverse ETL" },
        { name: "Census", url: "getcensus.com", desc: "Data activation" },
        { name: "dbt", url: "getdbt.com", desc: "Data transformation" },
        { name: "Fivetran", url: "fivetran.com", desc: "Data pipeline" },
        { name: "Airbyte", url: "airbyte.com", desc: "YC: Open source data integration" },
        { name: "Metabase", url: "metabase.com", desc: "Open source BI" },
        { name: "Looker", url: "looker.com", desc: "Google-owned BI" },
    ],

    "Marketing": [
        { name: "Mailchimp", url: "mailchimp.com", desc: "Email marketing OG" },
        { name: "Klaviyo", url: "klaviyo.com", desc: "Ecommerce email" },
        { name: "Customer.io", url: "customer.io", desc: "Marketing automation" },
        { name: "ActiveCampaign", url: "activecampaign.com", desc: "Email + CRM" },
        { name: "Drip", url: "drip.com", desc: "Ecommerce CRM" },
        { name: "Omnisend", url: "omnisend.com", desc: "Multi-channel marketing" },
        { name: "Sendlane", url: "sendlane.com", desc: "Email platform" },
        { name: "Sendinblue", url: "sendinblue.com", desc: "Email + SMS" },
        { name: "Brevo", url: "brevo.com", desc: "Sendinblue rebrand" },
        { name: "Twilio", url: "twilio.com", desc: "Communication APIs" },
        { name: "MessageBird", url: "messagebird.com", desc: "Twilio competitor" },
        { name: "Postmark", url: "postmarkapp.com", desc: "Transactional email" },
        { name: "SparkPost", url: "sparkpost.com", desc: "Email delivery" },
        { name: "Loops", url: "loops.so", desc: "Email for SaaS" },
        { name: "Buttondown", url: "buttondown.email", desc: "Newsletter tool" },
        { name: "Revue", url: "getrevue.co", desc: "Twitter newsletters (dead)" },
        { name: "TinyLetter", url: "tinyletter.com", desc: "Mailchimp spinoff (dead)" },
        { name: "AWeber", url: "aweber.com", desc: "Email from 1998" },
        { name: "GetResponse", url: "getresponse.com", desc: "All-in-one marketing" },
        { name: "Moosend", url: "moosend.com", desc: "Cheap email marketing" },
    ],

    "Social Media": [
        { name: "Twitter/X", url: "x.com", desc: "Elon's playground" },
        { name: "Mastodon", url: "joinmastodon.org", desc: "Decentralized Twitter" },
        { name: "Bluesky", url: "bsky.app", desc: "Jack's new Twitter" },
        { name: "Threads", url: "threads.net", desc: "Instagram's Twitter clone" },
        { name: "Reddit", url: "reddit.com", desc: "Front page of the internet" },
        { name: "Instagram", url: "instagram.com", desc: "Photos + ads" },
        { name: "TikTok", url: "tiktok.com", desc: "Attention span killer" },
        { name: "YouTube", url: "youtube.com", desc: "Google video empire" },
        { name: "Vimeo", url: "vimeo.com", desc: "Artsy video hosting" },
        { name: "Twitch", url: "twitch.tv", desc: "Amazon-owned streaming" },
        { name: "LinkedIn", url: "linkedin.com", desc: "Professional theater" },
        { name: "Facebook", url: "facebook.com", desc: "Boomer social network" },
        { name: "Pinterest", url: "pinterest.com", desc: "Image bookmarking" },
        { name: "Tumblr", url: "tumblr.com", desc: "Blogging relic" },
        { name: "Medium", url: "medium.com", desc: "Paywalled blog posts" },
        { name: "Substack", url: "substack.com", desc: "Newsletter empire" },
        { name: "Letterboxd", url: "letterboxd.com", desc: "Movie social network" },
        { name: "Goodreads", url: "goodreads.com", desc: "Amazon-owned book tracking" },
        { name: "Yelp", url: "yelp.com", desc: "Review extortion platform" },
        { name: "Polywork", url: "polywork.com", desc: "Professional timeline" },
    ],

    "Project Management": [
        { name: "Jira", url: "atlassian.com/jira", desc: "Enterprise project hell" },
        { name: "Linear", url: "linear.app", desc: "Jira for cool kids" },
        { name: "Asana", url: "asana.com", desc: "Task management" },
        { name: "Monday", url: "monday.com", desc: "Colorful chaos" },
        { name: "ClickUp", url: "clickup.com", desc: "Feature bloat as strategy" },
        { name: "Basecamp", url: "basecamp.com", desc: "DHH's opinions as SaaS" },
        { name: "Trello", url: "trello.com", desc: "Kanban boards" },
        { name: "Notion", url: "notion.so", desc: "Everything app" },
        { name: "Coda", url: "coda.io", desc: "Docs on steroids" },
        { name: "Airtable", url: "airtable.com", desc: "Spreadsheets with ambitions" },
        { name: "Height", url: "height.app", desc: "Autonomous project management" },
        { name: "Plane", url: "plane.so", desc: "Open source Linear" },
        { name: "Shortcut", url: "shortcut.com", desc: "Clubhouse rebrand" },
        { name: "Pivotal Tracker", url: "pivotaltracker.com", desc: "Agile from 2010" },
        { name: "Wrike", url: "wrike.com", desc: "Enterprise PM" },
        { name: "Smartsheet", url: "smartsheet.com", desc: "Excel cosplay" },
        { name: "Teamwork", url: "teamwork.com", desc: "Generic PM tool" },
        { name: "Workfront", url: "workfront.com", desc: "Adobe project management" },
        { name: "Hive", url: "hive.com", desc: "All-in-one PM" },
        { name: "Ora", url: "ora.pm", desc: "Task management" },
    ],

    "Content Management": [
        { name: "WordPress", url: "wordpress.org", desc: "Internet's CMS" },
        { name: "Ghost", url: "ghost.org", desc: "Open source publishing" },
        { name: "Webflow", url: "webflow.com", desc: "Visual CMS" },
        { name: "Contentful", url: "contentful.com", desc: "Headless CMS" },
        { name: "Sanity", url: "sanity.io", desc: "Structured content platform" },
        { name: "Strapi", url: "strapi.io", desc: "Open source headless CMS" },
        { name: "Prismic", url: "prismic.io", desc: "Headless CMS" },
        { name: "Storyblok", url: "storyblok.com", desc: "Headless CMS" },
        { name: "Payload", url: "payloadcms.com", desc: "Code-first CMS" },
        { name: "Directus", url: "directus.io", desc: "Open data platform" },
        { name: "KeystoneJS", url: "keystonejs.com", desc: "Node.js CMS" },
        { name: "Hygraph", url: "hygraph.com", desc: "GraphQL CMS" },
        { name: "Builder.io", url: "builder.io", desc: "Visual development platform" },
        { name: "Tina", url: "tina.io", desc: "Git-based CMS" },
        { name: "Forestry", url: "forestry.io", desc: "Static site CMS (dead)" },
        { name: "NetlifyCMS", url: "netlifycms.org", desc: "Git-based CMS" },
        { name: "Craft CMS", url: "craftcms.com", desc: "PHP CMS" },
        { name: "Drupal", url: "drupal.org", desc: "Enterprise CMS from 2000" },
        { name: "Joomla", url: "joomla.org", desc: "WordPress alternative" },
        { name: "Statamic", url: "statamic.com", desc: "Laravel CMS" },
    ],

    "Security": [
        { name: "1Password", url: "1password.com", desc: "Password manager" },
        { name: "Bitwarden", url: "bitwarden.com", desc: "Open source passwords" },
        { name: "LastPass", url: "lastpass.com", desc: "Breached password manager" },
        { name: "Dashlane", url: "dashlane.com", desc: "Password manager" },
        { name: "NordVPN", url: "nordvpn.com", desc: "VPN with YouTube ads" },
        { name: "ExpressVPN", url: "expressvpn.com", desc: "VPN ads everywhere" },
        { name: "Tailscale", url: "tailscale.com", desc: "WireGuard mesh network" },
        { name: "Cloudflare", url: "cloudflare.com", desc: "Internet infrastructure" },
        { name: "Auth0", url: "auth0.com", desc: "Authentication platform" },
        { name: "Okta", url: "okta.com", desc: "Enterprise identity" },
        { name: "Snyk", url: "snyk.io", desc: "Security scanning" },
        { name: "GitGuardian", url: "gitguardian.com", desc: "Secret scanning" },
        { name: "Vanta", url: "vanta.com", desc: "YC: Compliance automation" },
        { name: "Drata", url: "drata.com", desc: "SOC 2 compliance" },
        { name: "Secureframe", url: "secureframe.com", desc: "YC: Compliance platform" },
        { name: "OneTrust", url: "onetrust.com", desc: "Privacy management" },
        { name: "Transcend", url: "transcend.io", desc: "Data privacy" },
        { name: "Ketch", url: "ketch.com", desc: "Privacy infrastructure" },
        { name: "Enzuzo", url: "enzuzo.com", desc: "Privacy compliance" },
        { name: "Osano", url: "osano.com", desc: "Consent management" },
    ],

    "Database": [
        { name: "MongoDB", url: "mongodb.com", desc: "NoSQL database" },
        { name: "PostgreSQL", url: "postgresql.org", desc: "SQL database" },
        { name: "MySQL", url: "mysql.com", desc: "Oracle-owned database" },
        { name: "Redis", url: "redis.io", desc: "In-memory database" },
        { name: "Firebase", url: "firebase.google.com", desc: "Google backend platform" },
        { name: "Supabase", url: "supabase.com", desc: "YC: Open source Firebase" },
        { name: "PlanetScale", url: "planetscale.com", desc: "MySQL platform" },
        { name: "Neon", url: "neon.tech", desc: "Serverless Postgres" },
        { name: "CockroachDB", url: "cockroachlabs.com", desc: "Distributed SQL" },
        { name: "Xata", url: "xata.io", desc: "Serverless database" },
        { name: "Turso", url: "turso.tech", desc: "Edge SQLite" },
        { name: "Upstash", url: "upstash.com", desc: "Serverless Redis" },
        { name: "Momento", url: "gomomento.com", desc: "Serverless cache" },
        { name: "Airtable", url: "airtable.com", desc: "Database for non-developers" },
        { name: "Notion", url: "notion.so", desc: "Relational databases cosplay" },
        { name: "Coda", url: "coda.io", desc: "Docs pretending to be databases" },
        { name: "SmartSuite", url: "smartsuite.com", desc: "Work management platform" },
        { name: "Rows", url: "rows.com", desc: "Spreadsheet with APIs" },
        { name: "Baserow", url: "baserow.io", desc: "Open source Airtable" },
        { name: "NocoDB", url: "nocodb.com", desc: "Airtable alternative" },
    ],

    "Infrastructure": [
        { name: "AWS", url: "aws.amazon.com", desc: "Cloud monopoly" },
        { name: "Google Cloud", url: "cloud.google.com", desc: "AWS alternative" },
        { name: "Azure", url: "azure.microsoft.com", desc: "Microsoft cloud" },
        { name: "DigitalOcean", url: "digitalocean.com", desc: "Simple cloud" },
        { name: "Linode", url: "linode.com", desc: "Akamai-owned VPS" },
        { name: "Vultr", url: "vultr.com", desc: "Another VPS provider" },
        { name: "Hetzner", url: "hetzner.com", desc: "German cheap hosting" },
        { name: "Cloudflare", url: "cloudflare.com", desc: "CDN + everything" },
        { name: "Fastly", url: "fastly.com", desc: "Edge cloud platform" },
        { name: "Akamai", url: "akamai.com", desc: "CDN grandfather" },
        { name: "Netlify", url: "netlify.com", desc: "Jamstack hosting" },
        { name: "Vercel", url: "vercel.com", desc: "Next.js hosting" },
        { name: "Railway", url: "railway.app", desc: "Deploy anything" },
        { name: "Render", url: "render.com", desc: "Cloud platform" },
        { name: "Fly.io", url: "fly.io", desc: "Global app hosting" },
        { name: "Heroku", url: "heroku.com", desc: "Salesforce-owned platform" },
        { name: "Platform.sh", url: "platform.sh", desc: "PaaS provider" },
        { name: "Dokku", url: "dokku.com", desc: "Self-hosted Heroku" },
        { name: "Coolify", url: "coolify.io", desc: "Self-hosted Vercel" },
        { name: "CapRover", url: "caprover.com", desc: "Self-hosted PaaS" },
    ],

    "Finance": [
        { name: "Stripe", url: "stripe.com", desc: "Payment infrastructure" },
        { name: "Plaid", url: "plaid.com", desc: "Bank connections" },
        { name: "Ramp", url: "ramp.com", desc: "NYC: Corporate cards" },
        { name: "Brex", url: "brex.com", desc: "YC: Startup cards" },
        { name: "Mercury", url: "mercury.com", desc: "YC: Startup banking" },
        { name: "Deel", url: "deel.com", desc: "YC: Global payroll" },
        { name: "Remote", url: "remote.com", desc: "Employment platform" },
        { name: "Rippling", url: "rippling.com", desc: "HR + IT platform" },
        { name: "Gusto", url: "gusto.com", desc: "YC: Payroll for SMBs" },
        { name: "Carta", url: "carta.com", desc: "Cap table management" },
        { name: "AngelList", url: "angellist.com", desc: "Startup investing" },
        { name: "Republic", url: "republic.com", desc: "Crowdfunding platform" },
        { name: "Wefunder", url: "wefunder.com", desc: "YC: Startup investing" },
        { name: "StartEngine", url: "startengine.com", desc: "Equity crowdfunding" },
        { name: "Fundrise", url: "fundrise.com", desc: "Real estate investing" },
        { name: "Robinhood", url: "robinhood.com", desc: "Gamified trading" },
        { name: "Coinbase", url: "coinbase.com", desc: "Crypto exchange" },
        { name: "Gemini", url: "gemini.com", desc: "Winklevoss crypto" },
        { name: "Kraken", url: "kraken.com", desc: "Crypto exchange" },
        { name: "BlockFi", url: "blockfi.com", desc: "Crypto bank (bankrupt)" },
    ],

    "Education": [
        { name: "Coursera", url: "coursera.org", desc: "Online courses" },
        { name: "Udemy", url: "udemy.com", desc: "$10 course sales" },
        { name: "Skillshare", url: "skillshare.com", desc: "Creative classes" },
        { name: "MasterClass", url: "masterclass.com", desc: "Celebrity instructors" },
        { name: "Brilliant", url: "brilliant.org", desc: "Math and science" },
        { name: "Khan Academy", url: "khanacademy.org", desc: "Free education" },
        { name: "Duolingo", url: "duolingo.com", desc: "Gamified language learning" },
        { name: "Babbel", url: "babbel.com", desc: "Language learning" },
        { name: "Rosetta Stone", url: "rosettastone.com", desc: "Overpriced language software" },
        { name: "Codecademy", url: "codecademy.com", desc: "Learn to code" },
        { name: "freeCodeCamp", url: "freecodecamp.org", desc: "Free coding bootcamp" },
        { name: "LeetCode", url: "leetcode.com", desc: "Interview prep hell" },
        { name: "HackerRank", url: "hackerrank.com", desc: "Coding challenges" },
        { name: "Exercism", url: "exercism.org", desc: "Code practice" },
        { name: "Pluralsight", url: "pluralsight.com", desc: "Tech training" },
        { name: "LinkedIn Learning", url: "linkedin.com/learning", desc: "Lynda.com rebrand" },
        { name: "Frontend Masters", url: "frontendmasters.com", desc: "Web dev courses" },
        { name: "Egghead", url: "egghead.io", desc: "Bite-sized code lessons" },
        { name: "Wes Bos", url: "wesbos.com", desc: "JavaScript courses" },
        { name: "Execute Program", url: "executeprogram.com", desc: "Spaced repetition coding" },
    ],
};

function getRandomReviewer() {
    return reviewers[Math.floor(Math.random() * reviewers.length)];
}

function generateRating() {
    // Generate rating between 3.0 and 7.5 with truly random decimals
    // This avoids clustering at specific values
    const base = 3.0 + Math.random() * 4.5;

    // Round to 1 decimal place
    const rating = Math.round(base * 10) / 10;

    // Clamp to ensure it's within range
    return Math.max(3.0, Math.min(7.5, rating));
}

async function generateReview(site, category) {
    const reviewer = getRandomReviewer();
    const rating = generateRating();
    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const prompt = `You are ${reviewer.name}, a writer for DOTFORK - a website that reviews modern dot-com websites in the style of early 2000s Pitchfork music reviews. Your style: ${reviewer.style}.

Write a brutally honest, NEGATIVE review of ${site.name} (${site.url}).

Context: ${site.desc}
Category: ${category}
Rating: ${rating}/10 (be harsh, this is a LOW rating)

CRITICAL REQUIREMENTS:
1. Be NEGATIVE. This is rating ${rating} out of 10 - that's not good. Be cynical and critical.
2. Length: Exactly 5 paragraphs, 150-200 words each
3. Style: Nick Sylvester/Brent DiCriscio Pitchfork - personal, weird tangents, genuine hostility
4. Voice: First person, personal anecdotes, swearing encouraged, neurotic
5. NO FORMULAS: Make it unique every time
6. BE SPECIFIC: Reference the actual product (${site.name})
7. Mock: pricing, design, UX, marketing, the founder's tweets, whatever

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

✓ INSTEAD, START WITH:
- A direct quote from their marketing copy and immediately mock it
- A specific observation or detail that feels concrete and immediate
- A comparison that catches people off guard
- A bold statement or hot take
- Jump straight into the critique without preamble
- Start with a contradiction or paradox
- Start with what you heard/read about them
- Start with the verdict and work backwards

EVERY opening must feel completely different. Randomize your approach.

Format EXACTLY:
REVIEW_START
[5 paragraphs]
REVIEW_END
VERDICT: [one cynical sentence]`;

    try {
        console.log(`Generating review for ${site.name}...`);

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
        const verdict = verdictMatch ? verdictMatch[1].trim() : 'Another disappointment.';

        return {
            site,
            category,
            reviewer: reviewer.name,
            date,
            rating,
            reviewText,
            verdict
        };
    } catch (error) {
        console.error(`Error generating review for ${site.name}:`, error.message);
        return null;
    }
}

async function generateAllReviews() {
    const allReviews = [];

    for (const [category, sites] of Object.entries(websites)) {
        console.log(`\n=== Generating ${category} reviews ===`);

        for (const site of sites) {
            const review = await generateReview(site, category);
            if (review) {
                allReviews.push(review);

                // Save individual review HTML file
                const filename = site.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-');
                const htmlContent = generateReviewHTML(review);

                fs.writeFileSync(
                    path.join(__dirname, 'reviews', `${filename}.html`),
                    htmlContent
                );

                console.log(`✓ ${site.name} (${review.rating})`);
            }

            // Rate limit: 50 requests per minute for Claude
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    // Save JSON file with all reviews
    fs.writeFileSync(
        path.join(__dirname, 'all-reviews.json'),
        JSON.stringify(allReviews, null, 2)
    );

    console.log(`\n✓ Generated ${allReviews.length} reviews`);
    return allReviews;
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

// Run the script
if (require.main === module) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
        console.error('Error: ANTHROPIC_API_KEY not found or empty in .env file');
        console.error('Current value:', apiKey);
        process.exit(1);
    }

    console.log('API Key found, starting generation...');
    generateAllReviews()
        .then(() => console.log('\nDone!'))
        .catch(err => console.error('Error:', err));
}
