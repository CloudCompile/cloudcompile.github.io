// GitHub API Configuration
const GITHUB_USERNAME = 'CloudCompile';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

// DOM Elements
const projectsGrid = document.getElementById('projects-grid');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// Language colors for GitHub projects
const languageColors = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C#': '#178600',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#A97BFF',
    'PHP': '#4F5D95',
    'Vue': '#41b883',
    'React': '#61dafb',
    'default': '#8b5cf6'
};

// Fetch and display GitHub projects
async function fetchGitHubProjects() {
    try {
        const response = await fetch(`${GITHUB_API_URL}?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        
        const repos = await response.json();
        displayProjects(repos);
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        displayFallbackProjects();
    }
}

// Display projects in the grid
function displayProjects(repos) {
    projectsGrid.innerHTML = '';
    
    // Filter out forked repos and get the most relevant ones
    const filteredRepos = repos
        .filter(repo => !repo.fork)
        .slice(0, 6);
    
    if (filteredRepos.length === 0) {
        displayFallbackProjects();
        return;
    }
    
    filteredRepos.forEach((repo, index) => {
        const projectCard = createProjectCard(repo);
        projectCard.style.animationDelay = `${index * 0.1}s`;
        projectsGrid.appendChild(projectCard);
        
        // Trigger animation
        setTimeout(() => {
            projectCard.classList.add('visible');
        }, index * 100);
    });
}

// Create a project card element
function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'glass-card project-card';
    
    const languageColor = languageColors[repo.language] || languageColors['default'];
    
    card.innerHTML = `
        <h3 class="project-name">${repo.name}</h3>
        <p class="project-description">${repo.description || 'No description available'}</p>
        <div class="project-meta">
            ${repo.language ? `
                <span class="project-language">
                    <span class="language-dot" style="background: ${languageColor}"></span>
                    ${repo.language}
                </span>
            ` : ''}
            <span class="project-stars">
                ⭐ ${repo.stargazers_count}
            </span>
        </div>
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
            View on GitHub →
        </a>
    `;
    
    return card;
}

// Fallback projects if GitHub API fails
function displayFallbackProjects() {
    const fallbackProjects = [
        {
            name: 'Pollinations.ai',
            description: 'AI-powered creative tools and image generation platform',
            language: 'JavaScript',
            stars: 0,
            url: 'https://github.com/CloudCompile'
        },
        {
            name: 'PrismAI',
            description: 'Advanced AI assistant and automation platform',
            language: 'Python',
            stars: 0,
            url: 'https://github.com/CloudCompile'
        },
        {
            name: 'CloudCompile',
            description: 'Cloud-based compilation and development tools',
            language: 'TypeScript',
            stars: 0,
            url: 'https://github.com/CloudCompile'
        }
    ];
    
    projectsGrid.innerHTML = '';
    
    fallbackProjects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'glass-card project-card';
        
        const languageColor = languageColors[project.language] || languageColors['default'];
        
        card.innerHTML = `
            <h3 class="project-name">${project.name}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-meta">
                <span class="project-language">
                    <span class="language-dot" style="background: ${languageColor}"></span>
                    ${project.language}
                </span>
            </div>
            <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-link">
                View on GitHub →
            </a>
        `;
        
        projectsGrid.appendChild(card);
        
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100);
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
}

// Close mobile menu when clicking a link
function closeMobileMenu() {
    navLinks.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
}

// Intersection Observer for scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe about cards
    document.querySelectorAll('.about-card').forEach(card => {
        card.classList.add('animate');
        observer.observe(card);
    });
    
    // Observe hobby cards
    document.querySelectorAll('.hobby-card').forEach(card => {
        card.classList.add('animate');
        observer.observe(card);
    });
}

// Smooth scroll for navigation links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                closeMobileMenu();
            }
        });
    });
}

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Parallax effect for background shapes
function setupParallax() {
    const handleScroll = throttle(() => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.1 * (index + 1);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, 16); // ~60fps
    
    window.addEventListener('scroll', handleScroll);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Fetch GitHub projects
    fetchGitHubProjects();
    
    // Setup mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup smooth scrolling
    setupSmoothScroll();
    
    // Setup parallax effect
    setupParallax();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.glass-nav')) {
            closeMobileMenu();
        }
    });
});

// Add subtle hover glow effect to cards with throttling
const handleMouseMove = throttle((e) => {
    const cards = document.querySelectorAll('.glass-card:hover');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
}, 16);

document.addEventListener('mousemove', handleMouseMove);
