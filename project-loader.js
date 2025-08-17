class ProjectLoader {
    constructor() {
        this.projects = {};
        console.log('ProjectLoader initializing...');
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.loadProject();
        console.log('ProjectLoader initialized successfully');
    }

    async loadProjects() {
        try {
            console.log('Loading projects from JSON...');
            const response = await fetch('src/data/portfolio-dev.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Convert the data to the expected format
            data.projects.forEach(project => {
                this.projects[project.id] = {
                    title: project.title,
                    description: project.description,
                    images: project.images
                };
            });
            
            console.log(`Loaded ${Object.keys(this.projects).length} projects:`, Object.keys(this.projects));
        } catch (error) {
            console.error('Error loading projects:', error);
            console.log('Falling back to hardcoded data...');
            // Fallback to hardcoded data
            this.projects = {
                labirinto: {
                    title: "Il Labirinto Della Mente",
                    description: `
                        <p>This editorial collection showcases innovative makeup techniques that push the boundaries of traditional beauty standards.</p>
                        <p>The collection explores themes of transformation and self-expression using bold colors and experimental methods.</p>
                    `,
                    images: [
                        "https://drive.google.com/uc?export=view&id=1s8txbOxSuKQJwIsIaLkPE5CwZoddwCTI",
                        "https://drive.google.com/uc?export=view&id=19zsvXcumSKvm8V-ru9WJF5Oa6oD-a11h",
                        "https://drive.google.com/uc?export=view&id=16J1IKfrxGRfpWTe0X4qaA9yq-Rtx98Py",
                        "https://drive.google.com/uc?export=view&id=1Q8qV5cr3sf6-N6QjbP-luq6DxNl5w5Y2",
                        "https://drive.google.com/uc?export=view&id=1yqDf2gU8BGsTz_Vq4cql7QsmvwWROCyk",
                        "https://drive.google.com/uc?export=view&id=15MdEVBWzAX36pcCxBqNYmhef0pfnt_Nu"
                    ]
                },
                bodypainting: {
                    title: "Body Painting",
                    description: "<p>Artistic full-body makeup for creative and expressive storytelling.</p>",
                    images: [
                        "https://drive.google.com/uc?export=view&id=1ihc8vwgfa9Muj4d9DnzYL4DBK00taVSj",
                        "https://drive.google.com/uc?export=view&id=1gZHHAFoIxutkJjwYkbnV2yv-0ioCUrcZ",
                        "https://drive.google.com/uc?export=view&id=1oHT7qf1hMAe9-FMQD_cGfzEL2HRlzxpP",
                        "https://drive.google.com/uc?export=view&id=1pw7bN0Lf4srIfF128lEqFmL1wuGCa684",
                        "https://drive.google.com/uc?export=view&id=1FHiz6XYYYdevLxfbDv6CKWQavoGUalxl"
                    ]
                },
                popeart: {
                    title: "Pope Art Parco Forlanini",
                    description: "<p>An outdoor shoot blending pop art styling with natural landscapes.</p>",
                    images: [
                        "https://drive.google.com/uc?export=view&id=19BQdhg1sE_CYUGuhQ7JCFncWn6qSDs1g",
                        "https://drive.google.com/uc?export=view&id=1BScMkq3P3xXo50bab2MfFeSeUqixjofm",
                        "https://drive.google.com/uc?export=view&id=1Dst-Ez6VSbiTsCp09uZjlE-UyO--OwQL",
                        "https://drive.google.com/uc?export=view&id=1mPk9dBr82s1R6qZmRJDNhGIi6MzEbc3n",
                        "https://drive.google.com/uc?export=view&id=1pJS40Pt2_qbHJHVAaRP3AY9COzlQGBQS",
                        "https://drive.google.com/uc?export=view&id=1OjCogZhZp42cJJpwX1nyA6NzgFGyT_Xa"
                    ]
                },
                sfxfinal: {
                    title: "SFX Final Exam",
                    description: "<p>Final special effects makeup exam with prosthetics and illusion makeup.</p>",
                    images: [
                        "https://drive.google.com/uc?export=view&id=1FahwjokMFOGUJYEprWfo506hsFB4RMtX",
                        "https://drive.google.com/uc?export=view&id=1U9OMFbH80AG3tdDwnJvi1z1HiXv0aUDC",
                        "https://drive.google.com/uc?export=view&id=1dD6ieVbr3Ks84rCcEjyzRps5bFoQTZCt",
                        "https://drive.google.com/uc?export=view&id=1LhoXx-LnIBmyjWNvVsqI9mWpZiNw05Hz"
                    ]
                }
            };
        }
    }

    loadProject() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        console.log(`Loading project with ID: ${id}`);
        
        const project = this.projects[id];

        if (project) {
            console.log(`Found project: ${project.title} with ${project.images.length} images`);
            document.getElementById("projectTitle").textContent = project.title;
            document.getElementById("projectDescription").innerHTML = project.description;

            const imgContainer = document.getElementById("projectImages");
            imgContainer.innerHTML = ''; // Clear existing content
            
            project.images.forEach((imageUrl, index) => {
                console.log(`Loading image ${index + 1}: ${imageUrl}`);
                const div = document.createElement("div");
                div.className = "project-image";
                
                // Add loading state
                div.innerHTML = `
                    <div class="image-loading-container">
                        <div class="loading-spinner"></div>
                        <p>Loading image ${index + 1}...</p>
                    </div>
                `;
                
                const img = document.createElement("img");
                img.src = imageUrl;
                img.loading = "lazy";
                img.alt = `${project.title} - Image ${index + 1}`;
                img.style.opacity = '0.6';
                img.style.transition = 'opacity 0.4s ease';
                img.style.filter = 'blur(1px)';
                
                // Add error handling for Google Drive images with improved fallback and timeout
                const timeoutId = setTimeout(() => {
                    if (!img.complete || img.naturalWidth === 0) {
                        console.warn(`Project image load timeout ${index + 1}: ${imageUrl}`);
                        if (typeof img.onerror === 'function') img.onerror();
                    }
                }, 10000);

                img.onerror = function() {
                    console.warn(`Failed to load image ${index + 1}: ${imageUrl}`);
                    
                    // Try alternative Google Drive format
                    if (imageUrl.includes('drive.google.com/thumbnail')) {
                        const newSrc = imageUrl.replace('/thumbnail?id=', '/uc?export=view&id=').replace('&sz=w800', '').replace('&sz=w400', '');
                        console.log(`Trying export format for image ${index + 1}: ${newSrc}`);
                        this.src = newSrc;
                    } else if (imageUrl.includes('drive.google.com/uc?export=view')) {
                        const newSrc = imageUrl.replace('/uc?export=view&id=', '/thumbnail?id=') + '&sz=w800';
                        console.log(`Trying thumbnail format for image ${index + 1}: ${newSrc}`);
                        this.src = newSrc;
                    } else {
                        // Use placeholder as final fallback
                        this.src = 'https://via.placeholder.com/800x600/cccccc/666666?text=Image+Loading...';
                        this.style.opacity = '0.7';
                        this.style.filter = 'none';
                    }
                    clearTimeout(timeoutId);
                };
                
                img.onload = function() {
                    console.log(`Image ${index + 1} loaded successfully: ${imageUrl}`);
                    this.style.opacity = '1';
                    this.style.filter = 'blur(0px)';
                    // Remove loading state
                    div.querySelector('.image-loading-container').remove();
                    clearTimeout(timeoutId);
                };
                
                div.appendChild(img);
                imgContainer.appendChild(div);
            });
        } else {
            console.error(`Project not found: ${id}`);
            document.getElementById("projectTitle").textContent = "Project Not Found";
            document.getElementById("projectDescription").textContent = "Sorry, the project you're looking for does not exist.";
        }
    }
}

// Initialize the project loader
console.log('Creating ProjectLoader instance...');
const projectLoader = new ProjectLoader();
