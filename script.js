const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  observer.observe(element);
});

const teaser = document.querySelector('.media-hero');
const teaserVideo = teaser?.querySelector('video');
const teaserDuration = teaser?.querySelector('.hero-video-duration');
let teaserOverlayTimer;

function formatVideoDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds)) return '--:--';
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  const parts = hours > 0 ? [hours, minutes, seconds] : [minutes, seconds];
  return parts.map((part) => String(part).padStart(2, '0')).join(':');
}

function updateTeaserDuration() {
  if (teaserDuration && teaserVideo) {
    teaserDuration.textContent = formatVideoDuration(teaserVideo.duration);
  }
}

function showTeaserOverlay(delay = null) {
  if (!teaser) return;
  window.clearTimeout(teaserOverlayTimer);
  teaser.classList.remove('overlay-hidden');
  if (delay !== null && teaserVideo && !teaserVideo.paused) {
    teaserOverlayTimer = window.setTimeout(() => teaser.classList.add('overlay-hidden'), delay);
  }
}

teaserVideo?.addEventListener('playing', () => showTeaserOverlay(3000));
teaserVideo?.addEventListener('loadedmetadata', updateTeaserDuration);
if (teaserVideo?.readyState >= 1) updateTeaserDuration();
teaser?.addEventListener('pointerenter', () => showTeaserOverlay());
teaser?.addEventListener('pointermove', () => showTeaserOverlay());
teaser?.addEventListener('pointerdown', () => showTeaserOverlay(2200));
teaser?.addEventListener('pointerleave', () => showTeaserOverlay(800));
teaser?.addEventListener('focusin', () => showTeaserOverlay());
teaser?.addEventListener('focusout', () => showTeaserOverlay(800));

document.querySelectorAll('.interactive-feature-video').forEach((container) => {
  const video = container.querySelector('video');
  let overlayTimer;

  const showOverlay = (delay = null) => {
    window.clearTimeout(overlayTimer);
    container.classList.remove('overlay-hidden');
    if (delay !== null && video && !video.paused) {
      overlayTimer = window.setTimeout(() => container.classList.add('overlay-hidden'), delay);
    }
  };

  video?.addEventListener('playing', () => showOverlay(3000));
  container.addEventListener('pointerenter', () => showOverlay());
  container.addEventListener('pointermove', () => showOverlay());
  container.addEventListener('pointerdown', () => showOverlay(2200));
  container.addEventListener('pointerleave', () => showOverlay(800));
  container.addEventListener('focusin', () => showOverlay());
  container.addEventListener('focusout', () => showOverlay(800));
});

const copyButton = document.querySelector('.copy-button');
copyButton?.addEventListener('click', async () => {
  const citation = document.querySelector('.code-block code')?.textContent ?? '';
  await navigator.clipboard.writeText(citation);
  copyButton.textContent = 'Copied';
  window.setTimeout(() => { copyButton.textContent = 'Copy'; }, 1600);
});

const demoFilters = document.querySelectorAll('.demo-filter');
const taskDemoGrid = document.querySelector('#task-demo-grid');
const taskPagePrevious = document.querySelector('.task-page-prev');
const taskPageNext = document.querySelector('.task-page-next');
const taskPageCurrent = document.querySelector('.task-page-current');
const taskPageTotal = document.querySelector('.task-page-total');
const taskDemosPerPage = 6;
let activeTaskFilter = 'all';
let taskDemoPage = 1;

const cleaningTasks = new Set(['brush_toilet', 'clean_bed', 'mop_floor', 'wipe_basin', 'wipe_table']);
const locoTasks = new Set(['move_table_with_human', 'push_chair']);
const dualViewTaskSlugs = [
  'arrange_fruit_in_closet', 'brush_toilet', 'classify_gadgets', 'clean_bed',
  'close_wardrobe_door', 'collect_books', 'collect_fruits_from_the_closet',
  'collect_toys_from_the_bed', 'fruit_bucket_arrangement', 'grab_fruit_bucket',
  'hang_clothes', 'mop_floor', 'move_table_with_human', 'pick_and_place',
  'pick_clothes_from_washing_machine', 'pick_garbage', 'push_chair',
  'put_apple_and_close_drawer', 'put_clothes_into_bucket',
  'put_the_beverage_in_the_lower_fridge', 'put_the_bottle_in_the_upper_fridge',
  'put_towel_into_washing_machine', 'retrieve_from_upper_fridge', 'wipe_basin', 'wipe_table'
];

function taskTitle(slug) {
  return slug.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function taskCategory(slug) {
  if (cleaningTasks.has(slug)) return 'cleaning';
  if (locoTasks.has(slug)) return 'loco';
  return 'household';
}

const taskDemos = dualViewTaskSlugs.map((slug) => ({
  slug,
  title: taskTitle(slug),
  category: taskCategory(slug),
  ego: `assets/videos/dataset_demos/${slug}/ego.mp4`,
  egoPoster: `assets/videos/dataset_demos/${slug}/ego.jpg`,
  exo: slug === 'close_wardrobe_door' ? null : `assets/videos/dataset_demos/${slug}/exo.mp4`,
  exoPoster: slug === 'close_wardrobe_door' ? null : `assets/videos/dataset_demos/${slug}/exo.jpg`
}));

function renderTaskDemos() {
  if (!taskDemoGrid) return;
  const matches = taskDemos.filter((demo) => activeTaskFilter === 'all' || demo.category === activeTaskFilter);
  const totalPages = Math.max(1, Math.ceil(matches.length / taskDemosPerPage));
  taskDemoPage = Math.min(taskDemoPage, totalPages);
  const pageStart = (taskDemoPage - 1) * taskDemosPerPage;
  const visibleDemos = matches.slice(pageStart, pageStart + taskDemosPerPage);
  taskDemoGrid.innerHTML = visibleDemos.map((demo) => `
    <article class="result-card" data-category="${demo.category}">
      <div class="task-video-frame">
        <video controls muted playsinline preload="none" poster="${demo.egoPoster}">
          <source src="${demo.ego}" type="video/mp4" />
        </video>
        <span class="card-number">T–${String(taskDemos.indexOf(demo) + 1).padStart(2, '0')} · ${demo.category.toUpperCase()}</span>
        ${demo.exo ? `<div class="view-toggle" aria-label="Select camera view">
          <button class="active" type="button" data-view="ego" data-src="${demo.ego}" data-poster="${demo.egoPoster}">Ego</button>
          <button type="button" data-view="exo" data-src="${demo.exo}" data-poster="${demo.exoPoster}">Exo</button>
        </div>` : ''}
      </div>
      <div class="card-copy"><h3>${demo.title}</h3><p>${demo.exo ? 'Ego and exo views' : 'Single synchronized view'}</p></div>
    </article>
  `).join('');
  if (taskPageCurrent) taskPageCurrent.textContent = String(taskDemoPage);
  if (taskPageTotal) taskPageTotal.textContent = String(totalPages);
  if (taskPagePrevious) taskPagePrevious.disabled = taskDemoPage === 1;
  if (taskPageNext) taskPageNext.disabled = taskDemoPage === totalPages;
}

renderTaskDemos();

demoFilters.forEach((button) => {
  button.addEventListener('click', () => {
    activeTaskFilter = button.dataset.filter ?? 'all';
    taskDemoPage = 1;
    demoFilters.forEach((item) => item.classList.toggle('active', item === button));
    renderTaskDemos();
  });
});

taskPagePrevious?.addEventListener('click', () => {
  if (taskDemoPage > 1) {
    taskDemoPage -= 1;
    renderTaskDemos();
  }
});

taskPageNext?.addEventListener('click', () => {
  taskDemoPage += 1;
  renderTaskDemos();
});

taskDemoGrid?.addEventListener('click', (event) => {
  const button = event.target.closest('.view-toggle button');
  if (!button) return;
  const frame = button.closest('.task-video-frame');
  const video = frame?.querySelector('video');
  if (!video || button.classList.contains('active')) return;
  const currentTime = video.currentTime;
  const wasPlaying = !video.paused;
  frame.querySelectorAll('.view-toggle button').forEach((item) => item.classList.toggle('active', item === button));
  video.poster = button.dataset.poster;
  video.src = button.dataset.src;
  video.load();
  video.addEventListener('loadedmetadata', () => {
    video.currentTime = Math.min(currentTime, Number.isFinite(video.duration) ? video.duration : currentTime);
    if (wasPlaying) video.play().catch(() => {});
  }, { once: true });
});

const libraryTaskSlugs = [
  'arrange_apple', 'clean_bed', 'cross_obj_arrange_pear',
  'cross_obj_pick_clothes_from_washing_machine', 'cross_obj_retrieve_from_upper_fridge',
  'cross_scene_put_clothes_into_bucket', 'cross_scene_wipe_table',
  'pick_and_place', 'pick_clothes_from_washing_machine', 'pick_garbage',
  'put_apple_and_close_drawer', 'put_clothes_into_bucket',
  'put_towel_into_washing_machine', 'retrieve_from_upper_fridge', 'wipe_table'
];

function libraryTaskCategory(slug) {
  if (slug.startsWith('cross_obj_')) return 'cross-object';
  if (slug.startsWith('cross_scene_')) return 'cross-scene';
  return 'standard';
}

function libraryTaskTitle(slug) {
  if (slug.startsWith('cross_obj_')) return `Cross-object · ${taskTitle(slug.replace('cross_obj_', ''))}`;
  if (slug.startsWith('cross_scene_')) return `Cross-scene · ${taskTitle(slug.replace('cross_scene_', ''))}`;
  return taskTitle(slug);
}

const libraryTaskDemos = libraryTaskSlugs.map((slug, index) => ({
  id: index + 1,
  slug,
  title: libraryTaskTitle(slug),
  category: libraryTaskCategory(slug),
  ego: `assets/videos/demo_lib/${slug}/ego.mp4`,
  egoPoster: `assets/videos/demo_lib/${slug}/ego.jpg`,
  exo: `assets/videos/demo_lib/${slug}/exo.mp4`,
  exoPoster: `assets/videos/demo_lib/${slug}/exo.jpg`
}));

const libraryTaskGrid = document.querySelector('#library-task-demo-grid');
const libraryFilters = document.querySelectorAll('.library-demo-filter');
const libraryPagePrevious = document.querySelector('.library-page-prev');
const libraryPageNext = document.querySelector('.library-page-next');
const libraryPageCurrent = document.querySelector('.library-page-current');
const libraryPageTotal = document.querySelector('.library-page-total');
let activeLibraryFilter = 'all';
let libraryDemoPage = 1;

function renderLibraryTaskDemos() {
  if (!libraryTaskGrid) return;
  const matches = libraryTaskDemos.filter((demo) => activeLibraryFilter === 'all' || demo.category === activeLibraryFilter);
  const totalPages = Math.max(1, Math.ceil(matches.length / taskDemosPerPage));
  libraryDemoPage = Math.min(libraryDemoPage, totalPages);
  const pageStart = (libraryDemoPage - 1) * taskDemosPerPage;
  const visibleDemos = matches.slice(pageStart, pageStart + taskDemosPerPage);
  libraryTaskGrid.innerHTML = visibleDemos.map((demo) => `
    <article class="result-card" data-category="${demo.category}">
      <div class="task-video-frame">
        <video controls muted playsinline preload="none" poster="${demo.egoPoster}">
          <source src="${demo.ego}" type="video/mp4" />
        </video>
        <span class="card-number">L–${String(demo.id).padStart(2, '0')} · ${demo.category.toUpperCase()}</span>
        <div class="view-toggle" aria-label="Select camera view">
          <button class="active" type="button" data-view="ego" data-src="${demo.ego}" data-poster="${demo.egoPoster}">Ego</button>
          <button type="button" data-view="exo" data-src="${demo.exo}" data-poster="${demo.exoPoster}">Exo</button>
        </div>
      </div>
      <div class="card-copy"><h3>${demo.title}</h3><p>Ego and exo views</p></div>
    </article>
  `).join('');
  if (libraryPageCurrent) libraryPageCurrent.textContent = String(libraryDemoPage);
  if (libraryPageTotal) libraryPageTotal.textContent = String(totalPages);
  if (libraryPagePrevious) libraryPagePrevious.disabled = libraryDemoPage === 1;
  if (libraryPageNext) libraryPageNext.disabled = libraryDemoPage === totalPages;
}

libraryFilters.forEach((button) => {
  button.addEventListener('click', () => {
    activeLibraryFilter = button.dataset.libraryFilter ?? 'all';
    libraryDemoPage = 1;
    libraryFilters.forEach((item) => item.classList.toggle('active', item === button));
    renderLibraryTaskDemos();
  });
});

libraryPagePrevious?.addEventListener('click', () => {
  if (libraryDemoPage > 1) {
    libraryDemoPage -= 1;
    renderLibraryTaskDemos();
  }
});

libraryPageNext?.addEventListener('click', () => {
  libraryDemoPage += 1;
  renderLibraryTaskDemos();
});

libraryTaskGrid?.addEventListener('click', (event) => {
  const button = event.target.closest('.view-toggle button');
  if (!button) return;
  const frame = button.closest('.task-video-frame');
  const video = frame?.querySelector('video');
  if (!video || button.classList.contains('active')) return;
  const currentTime = video.currentTime;
  const wasPlaying = !video.paused;
  frame.querySelectorAll('.view-toggle button').forEach((item) => item.classList.toggle('active', item === button));
  video.poster = button.dataset.poster;
  video.src = button.dataset.src;
  video.load();
  video.addEventListener('loadedmetadata', () => {
    video.currentTime = Math.min(currentTime, Number.isFinite(video.duration) ? video.duration : currentTime);
    if (wasPlaying) video.play().catch(() => {});
  }, { once: true });
});

renderLibraryTaskDemos();
