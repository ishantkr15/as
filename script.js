document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('appGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    let appsData = [];

    // Load Apps from Global Data (data.js)
    // Load Apps from Global Data (data.js)
    if (window.appsData) {
        appsData = window.appsData;
    } else {
        console.warn('appsData not found. Checking if data.js is loaded.');
        appsData = [];
    }
    renderApps(appsData);

    // Search Functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = appsData.filter(app =>
                app.name.toLowerCase().includes(query) ||
                app.tags.some(tag => tag.toLowerCase().includes(query))
            );
            renderApps(filtered);
        });
    }

    // Render Apps
    function renderApps(apps) {
        grid.innerHTML = '';
        if (apps.length === 0) {
            grid.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">No apps found.</p>';
            return;
        }

        apps.forEach((app, index) => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.style.animationDelay = `${index * 0.1}s`; // Staggered animation

            // Determine Badge
            let badge = '';
            if (app.tags.includes('New')) {
                badge = '<span class="tag-badge">NEW</span>';
            } else if (app.tags.includes('Popular')) {
                badge = '<span class="tag-badge popular">POPULAR</span>';
            }

            card.innerHTML = `
                ${badge}
                <div class="app-header">
                    <img src="${app.iconUrl}" alt="${app.name}" class="app-icon" onerror="this.src='https://via.placeholder.com/60'">
                    <div class="app-info">
                        <h3>${app.name}</h3>
                        <p>${app.developer}</p>
                    </div>
                </div>
                <div class="app-meta">
                    <span class="meta-item"><i class="fas fa-code-branch"></i> ${app.version}</span>
                    <span class="meta-item"><i class="fas fa-download"></i> ${app.downloads}</span>
                    <span class="meta-item"><i class="fas fa-hdd"></i> ${app.size}</span>
                </div>
                <div class="action-buttons">
                    <a href="details.html?id=${app.id}" class="btn btn-download"><i class="fas fa-download"></i> Download</a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Filter Functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            if (filterValue === 'all') {
                renderApps(appsData);
            } else {
                const filtered = appsData.filter(app => app.tags.includes(filterValue));
                renderApps(filtered);
            }
        });
    });
});
