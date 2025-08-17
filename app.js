// Minimal Makeup Portfolio App
// All functionality consolidated into one file

class PortfolioApp {
    constructor() {
        this.projects = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        console.log('PortfolioApp initializing...');
        await this.loadProjects();
        this.setupEventListeners();
        this.renderPortfolio();
        console.log('PortfolioApp initialized successfully');
    }

    async loadProjects() {
        try {
            console.log('Loading projects from JSON...');
            const response = await fetch('src/data/portfolio-dev.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.projects = data.projects || this.getSampleData();
            console.log(`Loaded ${this.projects.length} projects:`, this.projects.map(p => p.title));
        } catch (error) {
            console.error('Error loading projects:', error);
            console.log('Falling back to sample data...');
            this.projects = this.getSampleData();
        }
    }

    getSampleData() {
        return [
            {
                id: 'labirinto',
                title: 'Il Labirinto Della Mente',
                category: 'Editorial',
                images: [
                    'https://drive.google.com/uc?export=view&id=1s8txbOxSuKQJwIsIaLkPE5CwZoddwCTI',
                    'https://drive.google.com/uc?export=view&id=19zsvXcumSKvm8V-ru9WJF5Oa6oD-a11h',
                    'https://drive.google.com/uc?export=view&id=16J1IKfrxGRfpWTe0X4qaA9yq-Rtx98Py',
                    'https://drive.google.com/uc?export=view&id=1Q8qV5cr3sf6-N6QjbP-luq6DxNl5w5Y2',
                    'https://drive.google.com/uc?export=view&id=1yqDf2gU8BGsTz_Vq4cql7QsmvwWROCyk',
                    'https://drive.google.com/uc?export=view&id=15MdEVBWzAX36pcCxBqNYmhef0pfnt_Nu'
                ],
                thumbnail: 'https://drive.google.com/thumbnail?id=1s8txbOxSuKQJwIsIaLkPE5CwZoddwCTI&sz=w400'
            },
            {
                id: 'bodypainting',
                title: 'Body Painting',
                category: 'Artistic',
                images: [
                    'https://drive.google.com/uc?export=view&id=1ihc8vwgfa9Muj4d9DnzYL4DBK00taVSj',
                    'https://drive.google.com/uc?export=view&id=1gZHHAFoIxutkJjwYkbnV2yv-0ioCUrcZ',
                    'https://drive.google.com/uc?export=view&id=1oHT7qf1hMAe9-FMQD_cGfzEL2HRlzxpP',
                    'https://drive.google.com/uc?export=view&id=1pw7bN0Lf4srIfF128lEqFmL1wuGCa684',
                    'https://drive.google.com/uc?export=view&id=1FHiz6XYYYdevLxfbDv6CKWQavoGUalxl'
                ],
                thumbnail: 'https://drive.google.com/thumbnail?id=1ihc8vwgfa9Muj4d9DnzYL4DBK00taVSj&sz=w400'
            },
            {
                id: 'popeart',
                title: 'Pope Art Parco Forlanini',
                category: 'Outdoor',
                images: [
                    'https://drive.google.com/uc?export=view&id=19BQdhg1sE_CYUGuhQ7JCFncWn6qSDs1g',
                    'https://drive.google.com/uc?export=view&id=1BScMkq3P3xXo50bab2MfFeSeUqixjofm',
                    'https://drive.google.com/uc?export=view&id=1Dst-Ez6VSbiTsCp09uZjlE-UyO--OwQL',
                    'https://drive.google.com/uc?export=view&id=1mPk9dBr82s1R6qZmRJDNhGIi6MzEbc3n',
                    'https://drive.google.com/uc?export=view&id=1pJS40Pt2_qbHJHVAaRP3AY9COzlQGBQS',
                    'https://drive.google.com/uc?export=view&id=1OjCogZhZp42cJJpwX1nyA6NzgFGyT_Xa'
                ],
                thumbnail: 'https://drive.google.com/thumbnail?id=19BQdhg1sE_CYUGuhQ7JCFncWn6qSDs1g&sz=w400'
            },
            {
                id: 'sfxfinal',
                title: 'SFX Final Exam',
                category: 'SFX',
                images: [
                    'https://drive.google.com/uc?export=view&id=1FahwjokMFOGUJYEprWfo506hsFB4RMtX',
                    'https://drive.google.com/uc?export=view&id=1U9OMFbH80AG3tdDwnJvi1z1HiXv0aUDC',
                    'https://drive.google.com/uc?export=view&id=1dD6ieVbr3Ks84rCcEjyzRps5bFoQTZCt',
                    'https://drive.google.com/uc?export=view&id=1LhoXx-LnIBmyjWNvVsqI9mWpZiNw05Hz'
                ],
                thumbnail: 'https://drive.google.com/thumbnail?id=1FahwjokMFOGUJYEprWfo506hsFB4RMtX&sz=w400'
            }
        ];
    }

    // Utility function to handle Google Drive image loading with fallback
    createImageElement(src, alt, className = '') {
        const img = document.createElement('img');
        img.alt = alt;
        img.loading = 'lazy';
        img.className = className;
        
        // Add loading state
        img.style.opacity = '0.6';
        img.style.transition = 'opacity 0.4s ease';
        img.style.filter = 'blur(1px)';
        
        // Handle successful load
        img.onload = function() {
            console.log(`Image loaded successfully: ${src}`);
            this.style.opacity = '1';
            this.style.filter = 'blur(0px)';
        };
        
        // Handle errors with improved fallback strategy
        img.onerror = function() {
            console.warn(`Failed to load image: ${src}`);
            
            // Try to convert to alternative format if it's a Google Drive URL
            if (src.includes('drive.google.com/thumbnail')) {
                // Convert thumbnail to export format
                const newSrc = src.replace('/thumbnail?id=', '/uc?export=view&id=').replace('&sz=w800', '').replace('&sz=w400', '');
                console.log(`Trying export format: ${newSrc}`);
                this.src = newSrc;
            } else if (src.includes('drive.google.com/uc?export=view')) {
                // Convert export to thumbnail format
                const newSrc = src.replace('/uc?export=view&id=', '/thumbnail?id=') + '&sz=w800';
                console.log(`Trying thumbnail format: ${newSrc}`);
                this.src = newSrc;
            } else {
                // Use placeholder as final fallback
                this.src = 'https://via.placeholder.com/400x600/cccccc/666666?text=Image+Loading...';
                this.style.opacity = '0.7';
                this.style.background = '#f8f9fa';
                this.style.filter = 'none';
            }
        };
        
        // Set the source after setting up error handling
        img.src = src;
        
        return img;
    }
    
    renderPortfolio() {
        const grid = document.getElementById('portfolioGrid');
        if (!grid) {
            console.error('Portfolio grid element not found');
            return;
        }

        console.log('Rendering portfolio...');

        // Only render if the grid is empty (preserve existing HTML)
        if (grid.children.length === 0) {
            const filtered = this.currentFilter === 'all' 
                ? this.projects 
                : this.projects.filter(p => p.category.toLowerCase() === this.currentFilter.toLowerCase());

            console.log(`Rendering ${filtered.length} filtered projects`);

            grid.innerHTML = filtered.map(project => {
                const thumbnailUrl = project.thumbnail || project.images[0];
                console.log(`Rendering project: ${project.title} with thumbnail: ${thumbnailUrl}`);
                
                return `
                    <div class="portfolio-item" onclick="app.openProject('${project.id}')">
                        <div class="portfolio-image-container">
                            <img src="${thumbnailUrl}" 
                                 alt="${project.title}" 
                                 loading="lazy"
                                 class="portfolio-thumbnail"
                                 onerror="this.onerror=null; this.src='https://via.placeholder.com/400x600/cccccc/666666?text=Image+Loading...'; console.warn('Portfolio image failed to load:', '${thumbnailUrl}');"
                                 onload="this.style.opacity='1'; this.style.filter='blur(0px)'; console.log('Portfolio image loaded:', '${thumbnailUrl}');">
                            <div class="portfolio-loading-overlay">
                                <div class="loading-spinner"></div>
                            </div>
                        </div>
                        <div class="portfolio-overlay">
                            <h3>${project.title}</h3>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    openProject(id) {
        console.log(`Opening project: ${id}`);
        const project = this.projects.find(p => p.id === id);
        if (project) {
            // Redirect to projects.html with the project ID
            window.location.href = `projects.html?id=${id}`;
        } else {
            console.error(`Project not found: ${id}`);
        }
    }

    openLightbox(project) {
        const lightbox = document.getElementById('lightbox');
        const img = lightbox.querySelector('img');
        const title = lightbox.querySelector('.title');
        const desc = lightbox.querySelector('.description');

        img.src = project.images[0];
        title.textContent = project.title;
        desc.textContent = project.description;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    filterByCategory(category) {
        this.currentFilter = category;
        this.renderPortfolio();
        
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    setupEventListeners() {

        // Lightbox close
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) this.closeLightbox();
            });
        }

        // Close button
        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLightbox());
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeLightbox();
        });
    }
}

// Initialize app
console.log('Creating PortfolioApp instance...');
const app = new PortfolioApp();

// Global functions for HTML onclick
window.app = app;
