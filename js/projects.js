/**
 * Projects Loader
 * Loads projects from data/projects.json and renders them on homepage and work page
 * 
 * To add a project, edit data/projects.json
 * 
 * Image folder structure:
 *   images/projects/{project-id}/thumb.jpg
 *   images/projects/{project-id}/screenshot1.jpg
 *   images/projects/{project-id}/screenshot2.jpg
 *   etc.
 */

(function() {
  // Determine if we're on homepage or pages subdirectory
  const isHomepage = !window.location.pathname.includes('/pages/');
  const basePath = isHomepage ? '' : '../';
  const jsonPath = basePath + 'data/projects.json?v=' + Date.now();

  // Topic filter mapping
  const topicFilters = {
    'Web Development': 'web',
    'Instructional Design': 'instructional',
    'E-Learning': 'elearning',
    'VR/AR': 'vr',
    'Illustration': 'illustration',
    'Video Production': 'video',
    'Graphic Design': 'graphic'
  };

  // Load projects from JSON
  fetch(jsonPath)
    .then(response => response.json())
    .then(projects => {
      renderHomepageProjects(projects);
      renderWorkPageProjects(projects);
    })
    .catch(error => {
      console.error('Error loading projects:', error);
      console.log('Note: If testing locally, run a local server (e.g., python -m http.server 8000)');
    });

  // Render projects on homepage (featured only, random order)
  function renderHomepageProjects(projects) {
    const container = document.getElementById('homepage-projects');
    if (!container) return;

    // Filter featured projects and shuffle
    const featured = projects.filter(p => p.featured);
    const shuffled = shuffleArray([...featured]);
    
    // Take up to 3 for homepage
    const toShow = shuffled.slice(0, 3);

    container.innerHTML = toShow.map(project => createProjectCard(project, true)).join('');
  }

  // Render projects on work page (all projects)
  function renderWorkPageProjects(projects) {
    const container = document.getElementById('work-projects');
    if (!container) return;

    container.innerHTML = projects.map(project => createProjectCard(project, false)).join('');

    // Re-initialize filter buttons
    initializeFilters();
  }

  // Get topics - handles both old "topic" (string) and new "topics" (array) format
  function getTopics(project) {
    if (project.topics && Array.isArray(project.topics)) {
      return project.topics;
    } else if (project.topic) {
      return [project.topic];
    }
    return [];
  }

  // Get filter categories for a project
  function getFilterCategories(project) {
    const topics = getTopics(project);
    return topics.map(t => topicFilters[t] || 'other').join(' ');
  }

  // Get display label for topics as individual pill spans
  function getTopicsDisplay(project) {
    const topics = getTopics(project);
    return topics.map(t => `<span class="topic-pill">${t}</span>`).join('');
  }

  // Create a project card HTML
  function createProjectCard(project, isHomepage) {
    const filterCategories = getFilterCategories(project);
    const topicsDisplay = getTopicsDisplay(project);
    const projectPageUrl = isHomepage ? 'pages/' + project.page : project.page;

    // Image path: derived from project page path, hero.jpg inside the project's images folder
    const projectFolder = project.page.replace('index.html', '');
    const imgPath = isHomepage
      ? 'pages/' + projectFolder + 'images/hero.jpg'
      : projectFolder + 'images/hero.jpg';

    if (isHomepage) {
      // Homepage card style (work__item)
      return `
        <a href="${projectPageUrl}" class="work-item animate-on-scroll">
          <img src="${imgPath}" alt="${project.name}" class="work-item__image">
          <div class="work-item__overlay">
            <h3 class="work-item__title">${project.name}</h3>
            <span class="work-item__category">${topicsDisplay}</span>
          </div>
        </a>
      `;
    } else {
      // Work page card style (project-card) - no scroll animation
      return `
        <a href="${project.page}" class="project-card" data-categories="${filterCategories}">
          <div class="project-card__image">
            <img src="${imgPath}" alt="${project.name}" style="width:100%;height:100%;object-fit:cover;">
          </div>
          <div class="project-card__content">
            <div class="project-card__category">${topicsDisplay}</div>
            <h3 class="project-card__title">${project.name}</h3>
            <p class="project-card__desc">${project.description}</p>
            <span class="project-card__link">View Project →</span>
          </div>
        </a>
      `;
    }
  }

  // Shuffle array (Fisher-Yates)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Initialize filter buttons on work page
  function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;

    function applyFilter(filter) {
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      const active = document.querySelector('.filter-btn[data-filter="' + filter + '"]');
      if (active) active.classList.add('filter-btn--active');
      document.querySelectorAll('.project-card').forEach(card => {
        const categories = card.dataset.categories || '';
        card.style.display = (filter === 'all' || categories.includes(filter)) ? 'block' : 'none';
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        applyFilter(this.dataset.filter);
      });
    });

    // Apply filter from URL param on load
    const params = new URLSearchParams(window.location.search);
    const urlFilter = params.get('filter');
    if (urlFilter) applyFilter(urlFilter);
  }
})();
