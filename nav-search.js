// DOTFORK Global Nav Search
// Provides search functionality in the navigation bar

(function() {
    // Review index - comprehensive list of all reviews
    const reviewIndex = [
        // Creator Economy
        { name: 'Kickstarter', href: 'reviews/kickstarter.html', rating: 8.9, category: 'Creator Economy' },
        { name: 'Metalabel', href: 'reviews/metalabel.html', rating: 8.7, category: 'Creator Economy' },
        { name: 'The Creative Independent', href: 'reviews/the-creative-independent.html', rating: 8.6, category: 'Creator Economy' },
        { name: 'Are.na', href: 'reviews/are-na.html', rating: 8.5, category: 'Creator Economy' },
        { name: 'Ghost', href: 'reviews/ghost.html', rating: 8.4, category: 'Creator Economy' },
        { name: 'Artist Corporations', href: 'reviews/artist-corporations.html', rating: 8.2, category: 'Creator Economy' },
        { name: 'Gumroad', href: 'reviews/gumroad.html', rating: 7.1, category: 'Creator Economy' },
        { name: 'Beehiiv', href: 'reviews/beehiiv.html', rating: 6.9, category: 'Creator Economy' },
        { name: 'Substack', href: 'reviews/substack.html', rating: 6.2, category: 'Creator Economy' },
        { name: 'Patreon', href: 'reviews/patreon.html', rating: 5.9, category: 'Creator Economy' },
        { name: 'ConvertKit', href: 'reviews/convertkit.html', rating: 5.8, category: 'Creator Economy' },
        { name: 'Linktree', href: 'reviews/linktree.html', rating: 5.5, category: 'Creator Economy' },
        { name: 'Ko-fi', href: 'reviews/ko-fi.html', rating: 5.4, category: 'Creator Economy' },
        { name: 'Buy Me a Coffee', href: 'reviews/buy-me-a-coffee.html', rating: 5.2, category: 'Creator Economy' },
        { name: 'Stan Store', href: 'reviews/stan-store.html', rating: 4.8, category: 'Creator Economy' },
        { name: 'Kajabi', href: 'reviews/kajabi.html', rating: 4.6, category: 'Creator Economy' },
        { name: 'Teachable', href: 'reviews/teachable.html', rating: 4.4, category: 'Creator Economy' },
        { name: 'Thinkific', href: 'reviews/thinkific.html', rating: 4.2, category: 'Creator Economy' },
        { name: 'Podia', href: 'reviews/podia.html', rating: 4.1, category: 'Creator Economy' },
        { name: 'Circle', href: 'reviews/circle.html', rating: 3.9, category: 'Creator Economy' },

        // Productivity
        { name: 'Obsidian', href: 'reviews/obsidian.html', rating: 7.8, category: 'Productivity' },
        { name: 'Superhuman', href: 'reviews/superhuman.html', rating: 7.6, category: 'Productivity' },
        { name: 'Arc', href: 'reviews/arc.html', rating: 7.2, category: 'Productivity' },
        { name: 'Raycast', href: 'reviews/raycast.html', rating: 6.7, category: 'Productivity' },
        { name: 'Readwise', href: 'reviews/readwise.html', rating: 6.8, category: 'Productivity' },
        { name: 'Notion', href: 'reviews/notion.html', rating: 6.0, category: 'Productivity' },
        { name: 'Craft', href: 'reviews/craft.html', rating: 5.8, category: 'Productivity' },
        { name: 'Cron', href: 'reviews/cron.html', rating: 5.6, category: 'Productivity' },

        // Developer Tools
        { name: 'Resend', href: 'reviews/resend.html', rating: 7.5, category: 'Developer Tools' },
        { name: 'Railway', href: 'reviews/railway.html', rating: 7.2, category: 'Developer Tools' },
        { name: 'Linear', href: 'reviews/linear.html', rating: 6.9, category: 'Developer Tools' },
        { name: 'Cursor', href: 'reviews/cursor.html', rating: 6.9, category: 'Developer Tools' },
        { name: 'Vercel', href: 'reviews/vercel.html', rating: 6.8, category: 'Developer Tools' },
        { name: 'GitHub', href: 'reviews/github.html', rating: 5.7, category: 'Developer Tools' },
        { name: 'Replit', href: 'reviews/replit.html', rating: 5.5, category: 'Developer Tools' },
        { name: 'Retool', href: 'reviews/retool.html', rating: 5.3, category: 'Developer Tools' },
        { name: 'Liveblocks', href: 'reviews/liveblocks.html', rating: 5.1, category: 'Developer Tools' },

        // Database
        { name: 'Planetscale', href: 'reviews/planetscale.html', rating: 6.6, category: 'Database' },
        { name: 'Neon', href: 'reviews/neon.html', rating: 6.1, category: 'Database' },
        { name: 'Supabase', href: 'reviews/supabase.html', rating: 6.0, category: 'Database' },

        // AI Platform
        { name: 'Replicate', href: 'reviews/replicate.html', rating: 7.4, category: 'AI Platform' },
        { name: 'Descript', href: 'reviews/descript.html', rating: 6.8, category: 'AI Platform' },
        { name: 'Runway', href: 'reviews/runway.html', rating: 6.5, category: 'AI Platform' },
        { name: 'Hugging Face', href: 'reviews/hugging-face.html', rating: 6.2, category: 'AI Platform' },
        { name: 'Midjourney', href: 'reviews/midjourney.html', rating: 6.0, category: 'AI Platform' },
        { name: 'Anthropic', href: 'reviews/anthropic.html', rating: 5.8, category: 'AI Platform' },
        { name: 'Perplexity', href: 'reviews/perplexity.html', rating: 5.7, category: 'AI Platform' },
        { name: 'OpenAI', href: 'reviews/openai.html', rating: 5.4, category: 'AI Platform' },
        { name: 'Stability AI', href: 'reviews/stability-ai.html', rating: 5.2, category: 'AI Platform' },

        // Communication
        { name: 'Hey', href: 'reviews/hey.html', rating: 7.6, category: 'Communication' },
        { name: 'Loom', href: 'reviews/loom.html', rating: 5.4, category: 'Communication' },
        { name: 'mmhmm', href: 'reviews/mmhmm.html', rating: 5.1, category: 'Communication' },
        { name: 'Slack', href: 'reviews/slack.html', rating: 4.9, category: 'Communication' },
        { name: 'Zoom', href: 'reviews/zoom.html', rating: 4.5, category: 'Communication' },

        // Design Tools
        { name: 'Figma', href: 'reviews/figma.html', rating: 6.3, category: 'Design Tools' },
        { name: 'Pitch', href: 'reviews/pitch.html', rating: 6.3, category: 'Design Tools' },
        { name: 'Framer', href: 'reviews/framer.html', rating: 5.7, category: 'Design Tools' },
        { name: 'Canva', href: 'reviews/canva.html', rating: 5.5, category: 'Design Tools' },
        { name: 'Webflow', href: 'reviews/webflow.html', rating: 5.3, category: 'Design Tools' },
        { name: 'Squarespace', href: 'reviews/squarespace.html', rating: 4.8, category: 'Design Tools' },
        { name: 'Adobe Creative Cloud', href: 'reviews/adobe-creative-cloud.html', rating: 4.2, category: 'Design Tools' },

        // Analytics
        { name: 'PostHog', href: 'reviews/posthog.html', rating: 6.7, category: 'Analytics' },
        { name: 'Amplitude', href: 'reviews/amplitude.html', rating: 5.6, category: 'Analytics' },

        // Project Management
        { name: 'Trello', href: 'reviews/trello.html', rating: 5.1, category: 'Project Management' },
        { name: 'Asana', href: 'reviews/asana.html', rating: 4.3, category: 'Project Management' },
        { name: 'Monday.com', href: 'reviews/monday-com.html', rating: 3.9, category: 'Project Management' },
        { name: 'ClickUp', href: 'reviews/clickup.html', rating: 3.7, category: 'Project Management' },

        // E-commerce
        { name: 'Stripe', href: 'reviews/stripe.html', rating: 6.8, category: 'Payments' },
        { name: 'Shopify', href: 'reviews/shopify.html', rating: 4.7, category: 'E-commerce' },
        { name: 'Wix', href: 'reviews/wix.html', rating: 3.8, category: 'E-commerce' },

        // Enterprise
        { name: 'Zendesk', href: 'reviews/zendesk.html', rating: 5.3, category: 'CRM' },
        { name: 'Intercom', href: 'reviews/intercom.html', rating: 4.8, category: 'CRM' },
        { name: 'HubSpot', href: 'reviews/hubspot.html', rating: 3.8, category: 'Marketing' },
        { name: 'Mailchimp', href: 'reviews/mailchimp.html', rating: 4.6, category: 'Marketing' },
        { name: 'ServiceNow', href: 'reviews/servicenow.html', rating: 4.0, category: 'Enterprise' },
        { name: 'SAP', href: 'reviews/sap.html', rating: 3.7, category: 'Enterprise' },
        { name: 'Salesforce', href: 'reviews/salesforce.html', rating: 3.5, category: 'Enterprise' },
        { name: 'Box', href: 'reviews/box.html', rating: 3.4, category: 'Enterprise' },
        { name: 'Workday', href: 'reviews/workday.html', rating: 3.2, category: 'Enterprise' },
        { name: 'Oracle Cloud', href: 'reviews/oracle-cloud.html', rating: 2.9, category: 'Enterprise' },

        // Collaboration
        { name: 'Miro', href: 'reviews/miro.html', rating: 4.7, category: 'Collaboration' },
        { name: 'Airtable', href: 'reviews/airtable.html', rating: 4.5, category: 'Collaboration' },
        { name: 'Typeform', href: 'reviews/typeform.html', rating: 4.3, category: 'Collaboration' },
        { name: 'Calendly', href: 'reviews/calendly.html', rating: 4.1, category: 'Collaboration' },
        { name: 'DocuSign', href: 'reviews/docusign.html', rating: 3.8, category: 'Collaboration' },

        // Web Classics
        { name: 'Craigslist', href: 'reviews/craigslist.html', rating: 10.0, category: 'Web Classics' },
        { name: 'Wikipedia', href: 'reviews/wikipedia.html', rating: 9.2, category: 'Reference' },
        { name: 'Tumblr', href: 'reviews/tumblr.html', rating: 7.4, category: 'Web Classics' },
        { name: 'Glassdoor', href: 'reviews/glassdoor.html', rating: 6.8, category: 'Web Classics' },
        { name: 'eBay', href: 'reviews/ebay.html', rating: 5.5, category: 'Web Classics' },
        { name: 'Yahoo', href: 'reviews/yahoo.html', rating: 4.2, category: 'Web Classics' },
        { name: 'AOL', href: 'reviews/aol.html', rating: 3.5, category: 'Web Classics' },
        { name: 'MySpace', href: 'reviews/myspace.html', rating: 3.2, category: 'Web Classics' },
        { name: 'GeoCities', href: 'reviews/geocities.html', rating: 2.8, category: 'Web Classics' },

        // Misc
        { name: 'Dropbox', href: 'reviews/dropbox.html', rating: 4.4, category: 'Productivity' },
        { name: 'Evernote', href: 'reviews/evernote.html', rating: 3.6, category: 'Productivity' },
        { name: 'Google Workspace', href: 'reviews/google-workspace.html', rating: 5.2, category: 'Productivity' },
        { name: 'Microsoft 365', href: 'reviews/microsoft-365.html', rating: 4.8, category: 'Productivity' },
        { name: 'Hashnode', href: 'reviews/hashnode.html', rating: 5.0, category: 'Creator Economy' },
        { name: 'DOTFORK', href: 'reviews/dotfork.html', rating: 0.0, category: 'Meta' }
    ];

    function searchReviews(query) {
        if (!query || query.length < 2) return [];

        query = query.toLowerCase();
        const results = reviewIndex.filter(item => {
            return item.name.toLowerCase().includes(query) ||
                   item.category.toLowerCase().includes(query);
        });

        // Sort by relevance (name matches first, then by rating)
        results.sort((a, b) => {
            const aNameMatch = a.name.toLowerCase().startsWith(query);
            const bNameMatch = b.name.toLowerCase().startsWith(query);
            if (aNameMatch && !bNameMatch) return -1;
            if (!aNameMatch && bNameMatch) return 1;
            return b.rating - a.rating;
        });

        return results.slice(0, 8);
    }

    function getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/reviews/') || path.includes('/vc-reviews/') || path.includes('/deal-reviews/') || path.includes('/deals/')) {
            return '../';
        }
        return '';
    }

    function initNavSearch() {
        const searchInput = document.getElementById('navSearchInput');
        const searchResults = document.getElementById('navSearchResults');

        if (!searchInput || !searchResults) return;

        const basePath = getBasePath();

        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();

            if (query.length < 2) {
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                return;
            }

            const results = searchReviews(query);

            if (results.length === 0) {
                searchResults.innerHTML = '<div class="nav-search-result"><span style="color: #999;">No results found</span></div>';
                searchResults.classList.add('active');
                return;
            }

            let html = '';
            results.forEach(item => {
                html += `
                    <div class="nav-search-result">
                        <a href="${basePath}${item.href}">${item.name}</a>
                        <span class="rating-small" style="margin-left: 8px; vertical-align: middle;">${item.rating}</span>
                        <div class="nav-search-result-meta">${item.category}</div>
                    </div>
                `;
            });

            searchResults.innerHTML = html;
            searchResults.classList.add('active');
        });

        // Close on click outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });

        // Close on escape
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                searchResults.classList.remove('active');
                searchInput.value = '';
            }
        });

        // Navigate results with keyboard
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const firstResult = searchResults.querySelector('.nav-search-result a');
                if (firstResult) {
                    window.location.href = firstResult.href;
                }
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavSearch);
    } else {
        initNavSearch();
    }
})();
