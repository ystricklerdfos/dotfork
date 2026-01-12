// DOTFORK Search Functionality
// Builds a search index from all reviews and provides instant search

(function() {
    // Search data will be populated from reviews
    let searchIndex = [];
    let searchInitialized = false;

    // Extract review data from the page (for archive.html)
    function buildSearchIndexFromPage() {
        const reviews = [];

        // Get all review items from category sections
        document.querySelectorAll('.category-section').forEach(section => {
            const category = section.getAttribute('data-category');
            if (category === 'recent' || category === 'all') return; // Skip meta categories

            section.querySelectorAll('a[href*="reviews/"]').forEach(link => {
                const container = link.closest('div[style*="margin-bottom"]');
                if (!container) return;

                const name = link.textContent.trim();
                const href = link.getAttribute('href');
                const ratingEl = container.querySelector('.rating-small');
                const rating = ratingEl ? parseFloat(ratingEl.textContent) : null;
                const metaEl = container.querySelector('div[style*="color: #999"]');
                const metaText = metaEl ? metaEl.textContent : '';

                // Extract URL and reviewer from meta
                const urlMatch = metaText.match(/^([^\|]+)/);
                const reviewerMatch = metaText.match(/Reviewed by (.+)$/);

                reviews.push({
                    name: name,
                    href: href,
                    rating: rating,
                    category: formatCategory(category),
                    url: urlMatch ? urlMatch[1].trim() : '',
                    reviewer: reviewerMatch ? reviewerMatch[1].trim() : ''
                });
            });
        });

        // Also get VC reviews
        document.querySelectorAll('a[href*="vc-reviews/"]').forEach(link => {
            const container = link.closest('div[style*="margin-bottom"]');
            if (!container) return;

            const name = link.textContent.trim();
            const href = link.getAttribute('href');
            const ratingEl = container.querySelector('.rating-small');
            const rating = ratingEl ? parseFloat(ratingEl.textContent) : null;

            reviews.push({
                name: name,
                href: href,
                rating: rating,
                category: 'Venture Capital',
                url: '',
                reviewer: ''
            });
        });

        return reviews;
    }

    function formatCategory(cat) {
        return cat.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Fuzzy search matching
    function searchMatch(query, text) {
        if (!text) return false;
        query = query.toLowerCase();
        text = text.toLowerCase();

        // Exact substring match
        if (text.includes(query)) return true;

        // Word-start matching
        const words = text.split(/\s+/);
        for (const word of words) {
            if (word.startsWith(query)) return true;
        }

        return false;
    }

    // Perform search
    function performSearch(query) {
        if (!query || query.length < 2) return [];

        const results = searchIndex.filter(item => {
            return searchMatch(query, item.name) ||
                   searchMatch(query, item.category) ||
                   searchMatch(query, item.url) ||
                   searchMatch(query, item.reviewer);
        });

        // Sort by relevance (name matches first, then by rating)
        results.sort((a, b) => {
            const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase());
            const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase());
            if (aNameMatch && !bNameMatch) return -1;
            if (!aNameMatch && bNameMatch) return 1;
            return (b.rating || 0) - (a.rating || 0);
        });

        return results.slice(0, 20); // Limit to 20 results
    }

    // Render search results
    function renderSearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="search-no-results">No reviews found</div>';
            return;
        }

        let html = '';
        results.forEach(item => {
            html += `
                <div class="search-result-item">
                    <a href="${item.href}">${item.name}</a>
                    ${item.rating ? `<span class="rating-small">${item.rating}</span>` : ''}
                    <div class="search-result-meta">${item.category}${item.reviewer ? ' | ' + item.reviewer : ''}</div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Initialize search on page
    function initSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');

        if (!searchInput || !searchResults) return;

        // Build index from page
        searchIndex = buildSearchIndexFromPage();
        searchInitialized = true;

        // Set up event listeners
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();

            if (query.length < 2) {
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                // Show category sections again
                document.querySelectorAll('.category-section').forEach(s => {
                    if (s.classList.contains('hidden') === false ||
                        s.getAttribute('data-category') === document.querySelector('.category-btn.active')?.getAttribute('data-category')) {
                        s.style.display = '';
                    }
                });
                document.querySelector('.category-filter')?.style.removeProperty('display');
                return;
            }

            // Hide category sections during search
            document.querySelectorAll('.category-section').forEach(s => s.style.display = 'none');
            document.querySelector('.category-filter').style.display = 'none';

            const results = performSearch(query);
            searchResults.classList.add('active');
            renderSearchResults(results, searchResults);
        });

        // Clear search on escape
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
                document.querySelectorAll('.category-section').forEach(s => s.style.display = '');
                document.querySelector('.category-filter').style.display = '';
            }
        });
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }

    // Expose for external use
    window.DotforkSearch = {
        search: performSearch,
        getIndex: () => searchIndex
    };
})();
