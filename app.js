// app.js - Client-side logic for BizForge MVP
// Vanilla JS only - Client-side data simulation with localStorage

let businessData = [];

// Sample data for Nigerian entrepreneurs
const sampleData = [
    {
        id: 1,
        title: "Eco-friendly Pure Water Production",
        stage: "mvp",
        segment: "agriculture",
        progress: 65,
        location: "Abuja",
        date: "2026-05-10"
    },
    {
        id: 2,
        title: "AgroTech - Cassava Processing",
        stage: "revenue",
        segment: "agriculture",
        progress: 40,
        location: "Oyo",
        date: "2026-04-28"
    },
    {
        id: 3,
        title: "Fashion Rental Platform (Lagos)",
        stage: "idea",
        segment: "services",
        progress: 15,
        location: "Lagos",
        date: "2026-05-18"
    }
];

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('bizforge_data');
    if (saved) {
        businessData = JSON.parse(saved);
    } else {
        businessData = [...sampleData];
        saveData();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('bizforge_data', JSON.stringify(businessData));
}

// Render the business journey list
function renderList(filteredData = businessData) {
    const listRoot = document.getElementById('list-root');
    if (!listRoot) return;

    listRoot.innerHTML = '';

    if (filteredData.length === 0) {
        listRoot.innerHTML = `
            <li style="text-align:center; padding:40px 20px; color:#64748b;">
                No business journeys found.<br>
                Start by adding your idea above!
            </li>
        `;
        return;
    }

    filteredData.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${item.title}</strong>
                <p style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">${item.location} • ${item.date}</p>
                <span class="segment-badge">${item.segment || 'general'}</span>
            </div>
            <span style="margin-left:auto; font-size:0.85rem; color:#10b981; white-space: nowrap;">
                ${item.stage.toUpperCase()} • ${item.progress}%
            </span>
        `;
        listRoot.appendChild(li);
    });
}

// Render insights panel with dynamic data
function renderInsights() {
    const panel = document.getElementById('insights-panel');
    if (!panel) return;

    const total = businessData.length;
    const avgProgress = businessData.length ? 
        Math.round(businessData.reduce((sum, item) => sum + item.progress, 0) / businessData.length) : 0;

    // Build insights HTML
    let insightsHTML = `
        <div class="insight-card">
            <strong>Market Opportunity</strong>
            <p>Nigerian SME sector growing at 8.4% yearly</p>
        </div>
    `;

    if (total > 0) {
        const segmentCounts = businessData.reduce((counts, item) => {
            const segment = item.segment || 'general';
            counts[segment] = (counts[segment] || 0) + 1;
            return counts;
        }, {});

        const topSegment = Object.entries(segmentCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([segment]) => segment)[0] || 'general';

        insightsHTML += `
            <div class="insight-card">
                <strong>Your Progress</strong>
                <p>${total} business idea${total !== 1 ? 's' : ''} • Average progress: ${avgProgress}%</p>
            </div>
            <div class="insight-card">
                <strong>Top Segment</strong>
                <p>${topSegment.charAt(0).toUpperCase() + topSegment.slice(1)} (${segmentCounts[topSegment]} idea${segmentCounts[topSegment] !== 1 ? 's' : ''})</p>
            </div>
            <div class="insight-card">
                <strong>Recommended Next Step</strong>
                <p>Focus on customer validation for your next stage</p>
            </div>
        `;
    } else {
        insightsHTML += `
            <div class="insight-card">
                <strong>Recommended Next Step</strong>
                <p>Start by adding your first business idea above</p>
            </div>
        `;
    }

    // Update the panel content (keep h3, update cards)
    const h3 = panel.querySelector('h3');
    const panelContent = h3.parentElement;
    const cardsContainer = document.createElement('div');
    cardsContainer.innerHTML = insightsHTML;
    
    // Remove old cards
    const oldCards = panel.querySelectorAll('.insight-card');
    oldCards.forEach(card => card.remove());
    
    // Append new cards
    Array.from(cardsContainer.children).forEach(card => panel.appendChild(card));
}

// Handle hero button click - scroll to form
function setupHeroButton() {
    const heroBtnEl = document.getElementById('btn-hero-cta');
    if (heroBtnEl) {
        heroBtnEl.addEventListener('click', () => {
            const formEl = document.querySelector('.cta-form');
            if (formEl) {
                formEl.scrollIntoView({ behavior: 'smooth' });
                const ideaInput = document.getElementById('idea-input');
                if (ideaInput) ideaInput.focus();
            }
        });
    }
}

// Setup form submission handler
function setupFormHandler() {
    const formButton = document.getElementById('btn-form-submit');
    if (formButton) {
        formButton.addEventListener('click', (e) => {
            e.preventDefault();

            const ideaInput = document.getElementById('idea-input');
            const nameInput = document.getElementById('name-input');
            const stageSelect = document.getElementById('stage-select');
            const segmentSelect = document.getElementById('segment-select');

            if (!ideaInput || !ideaInput.value.trim()) {
                alert("Please enter your business idea");
                return;
            }

            const newBusiness = {
                id: Date.now(),
                title: ideaInput.value.trim(),
                stage: stageSelect ? stageSelect.value || 'idea' : 'idea',
                segment: segmentSelect ? segmentSelect.value || 'general' : 'general',
                progress: 10,
                location: "Nigeria",
                date: new Date().toISOString().split('T')[0]
            };

            businessData.unshift(newBusiness); // Add to top
            saveData();
            renderList();
            renderInsights();

            // Clear form
            if (ideaInput) ideaInput.value = '';
            if (nameInput) nameInput.value = '';
            if (stageSelect) stageSelect.value = '';
            if (segmentSelect) segmentSelect.value = '';

            alert("✅ Your business idea has been added to your journey!");
        });
    }
}

// Setup search and filter handlers
function setupFilterHandlers() {
    const searchInput = document.getElementById('input-search');
    const filterSelect = document.getElementById('input-filter-status');
    const segmentSelect = document.getElementById('input-filter-segment');

    if (searchInput) {
        searchInput.addEventListener('input', () => applyFilters());
    }
    if (filterSelect) {
        filterSelect.addEventListener('change', () => applyFilters());
    }
    if (segmentSelect) {
        segmentSelect.addEventListener('change', () => applyFilters());
    }
}

// Apply search and filter to list
function applyFilters() {
    const searchInput = document.getElementById('input-search');
    const filterSelect = document.getElementById('input-filter-status');
    const segmentSelect = document.getElementById('input-filter-segment');
    
    let filtered = businessData;

    // Search filter
    if (searchInput && searchInput.value.trim()) {
        const term = searchInput.value.toLowerCase().trim();
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(term) ||
            (item.segment && item.segment.toLowerCase().includes(term))
        );
    }

    // Stage filter
    if (filterSelect && filterSelect.value) {
        filtered = filtered.filter(item => item.stage === filterSelect.value);
    }

    // Segment filter
    if (segmentSelect && segmentSelect.value) {
        filtered = filtered.filter(item => item.segment === segmentSelect.value);
    }

    renderList(filtered);
}

// Initialize the entire app
function init() {
    loadData();
    renderList();
    renderInsights();

    // Set current year in footer
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Setup all event handlers
    setupHeroButton();
    setupFormHandler();
    setupFilterHandlers();
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
