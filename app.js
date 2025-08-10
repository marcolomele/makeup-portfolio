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
                images: ['https://drive.google.com/thumbnail?id=1R2UDOltgoka-MsmmvLshXdjG2gevgq_K&sz=w800'],
                thumbnail: 'https://drive.google.com/thumbnail?id=1s8txbOxSuKQJwIsIaLkPE5CwZoddwCTI&sz=w400'
            },
            {
                id: 'bodypainting',
                title: 'Body Painting',
                category: 'Artistic',
                images: ['https://drive.google.com/thumbnail?id=1ihc8vwgfa9Muj4d9DnzYL4DBK00taVSj&sz=w800'],
                thumbnail: 'https://drive.google.com/thumbnail?id=1s8txbOxSuKQJwIsIaLkPE5CwZoddwCTI&sz=w400'
            },
            {
                id: 'popeart',
                title: 'Pope Art Parco Forlanini',
                category: 'Outdoor',
                images: ['https://drive.google.com/thumbnail?id=19BQdhg1sE_CYUGuhQ7JCFncWn6qSDs1g&sz=w800'],
                thumbnail: 'https://drive.google.com/thumbnail?id=19BQdhg1sE_CYUGuhQ7JCFncWn6qSDs1g&sz=w400'
            },
            {
                id: 'sfxfinal',
                title: 'SFX Final Exam',
                category: 'SFX',
                images: ['https://drive.google.com/thumbnail?id=1FahwjokMFOGUJYEprWfo506hsFB4RMtX&sz=w800'],
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
        img.style.opacity = '0.8';
        img.style.transition = 'opacity 0.3s ease';
        
        // Handle successful load
        img.onload = function() {
            console.log(`Image loaded successfully: ${src}`);
            this.style.opacity = '1';
        };
        
        // Handle errors with fallback to alternative Google Drive format
        img.onerror = function() {
            console.warn(`Failed to load image: ${src}`);
            
            // Try to convert to alternative format if it's a Google Drive URL
            if (src.includes('drive.google.com/thumbnail')) {
                // Convert thumbnail to export format
                const newSrc = src.replace('/thumbnail?id=', '/uc?export=view&id=').replace('&sz=w800', '');
                console.log(`Trying alternative format: ${newSrc}`);
                this.src = newSrc;
            } else if (src.includes('drive.google.com/uc?export=view')) {
                // Convert export to thumbnail format
                const newSrc = src.replace('/uc?export=view&id=', '/thumbnail?id=') + '&sz=w800';
                console.log(`Trying alternative format: ${newSrc}`);
                this.src = newSrc;
            } else {
                // Use placeholder as final fallback
                this.src = 'https://via.placeholder.com/400x600/cccccc/666666?text=Image+Loading...';
                this.style.opacity = '0.7';
                this.style.background = '#f8f9fa';
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
                        <img src="${thumbnailUrl}" 
                             alt="${project.title}" 
                             loading="lazy"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/400x600/cccccc/666666?text=Image+Loading...'; console.warn('Portfolio image failed to load:', '${thumbnailUrl}');"
                             onload="this.style.opacity='1'; console.log('Portfolio image loaded:', '${thumbnailUrl}');">
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

    openSampleProject(id) {
        // Handle sample projects with hardcoded data
        const sampleProjects = {
            'sample-1': {
                title: 'Fashion Editorial',
                description: 'Modern fashion makeup for editorial shoots featuring bold colors and innovative techniques.',
                images: ['https://picsum.photos/seed/fashion1/800/1200']
            },
            'sample-2': {
                title: 'Bridal Beauty',
                description: 'Natural bridal makeup for special occasions, ensuring the bride looks radiant and camera-ready.',
                images: ['https://picsum.photos/seed/bridal1/800/1200']
            },
            'sample-3': {
                title: 'Commercial Shoot',
                description: 'Professional makeup for commercial photography and advertising campaigns.',
                images: ['https://picsum.photos/seed/commercial1/800/1200']
            },
            'sample-4': {
                title: 'Natural Beauty',
                description: 'Enhancing natural beauty with subtle makeup techniques for everyday glamour.',
                images: ['https://picsum.photos/seed/beauty1/800/1200']
            },
            'sample-5': {
                title: 'Artistic Expression',
                description: 'Creative and artistic makeup designs that push boundaries and explore new forms of self-expression.',
                images: ['https://picsum.photos/seed/editorial1/800/1200']
            },
            'sample-6': {
                title: 'Runway Show',
                description: 'Bold and dramatic makeup looks designed for the runway, ensuring models stand out under bright lights.',
                images: ['https://picsum.photos/seed/runway1/800/1200']
            }
        };

        const project = sampleProjects[id];
        if (project) {
            this.openLightbox(project);
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
