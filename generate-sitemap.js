const fs = require('fs');
const path = require('path');

// Mock window object for Node environment
global.window = {};

try {
    const dataJsPath = path.join(__dirname, 'data.js');
    const dataJs = fs.readFileSync(dataJsPath, 'utf8');
    
    // Execute data.js to populate window.appsData
    eval(dataJs);

    if (!window.appsData || !Array.isArray(window.appsData)) {
        throw new Error('window.appsData is not an array or is missing.');
    }

    const apps = window.appsData;

    // Define Static Pages
    const staticPages = [
        { url: 'index.html', changefreq: 'weekly', priority: '1.0' },
        { url: 'about.html', changefreq: 'monthly', priority: '0.8' },
        { url: 'contact.html', changefreq: 'monthly', priority: '0.8' },
        { url: 'details.html', changefreq: 'weekly', priority: '0.8' },
        { url: 'privacy.html', changefreq: 'yearly', priority: '0.7' },
        { url: 'terms.html', changefreq: 'yearly', priority: '0.7' },
        { url: 'thankyou.html', changefreq: 'yearly', priority: '0.3' }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const today = new Date().toISOString().split('T')[0];

    // 1. Generate Static Pages
    staticPages.forEach(page => {
        xml += `  <url>\n`;
        xml += `    <loc>https://asmultiverse.in/${page.url}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += `  </url>\n`;
    });

    // 2. Generate Dynamic App Pages
    apps.forEach(app => {
        if (app.id) {
            // URL encode the id for spaces and special characters
            const encodedId = encodeURIComponent(app.id);
            // Some IDs are already encoded in the original sitemap, but typically you want to encode it properly.
            // Let's check if there are any specific cases.
            const url = `https://asmultiverse.in/details.html?id=${encodedId}`;
            
            // Priority logic: if tags contain "Popular" or "New", 0.9, else 0.8
            let priority = '0.8';
            if (app.tags && Array.isArray(app.tags)) {
                if (app.tags.includes('Popular') || app.tags.includes('New')) {
                    priority = '0.9';
                }
            }

            xml += `  <url>\n`;
            xml += `    <loc>${url}</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>${priority}</priority>\n`;
            xml += `  </url>\n`;
        }
    });

    xml += `</urlset>\n`;

    const sitemapPath = path.join(__dirname, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, xml, 'utf8');

    console.log('✅ Sitemap generated successfully to:', sitemapPath);
    console.log(`📊 Total URLs: ${staticPages.length + apps.length}`);

} catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
}
