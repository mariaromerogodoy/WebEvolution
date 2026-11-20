
const eras = [
  { year: '1990', screen: 'screen-level1', backdrop: 'backdrops/1990.jpg', rect: { x: 32.97, y: 16.71, w: 55.08, h: 49.52 } },
  { year: '1994', screen: 'screen-level2', backdrop: 'backdrops/1994.jpg', rect: { x: 32.97, y: 16.71, w: 55.08, h: 49.52 } },
  { year: '1995', screen: 'screen-1995', backdrop: 'backdrops/1995.jpg', rect: { x: 32.97, y: 16.71, w: 55.08, h: 49.52 } },
  { year: '1998', screen: 'screen-1998', backdrop: 'backdrops/1998.jpg', rect: { x: 32.81, y: 9.38,  w: 55.31, h: 67.55 } },
  { year: '2001', screen: 'screen-2001', backdrop: 'backdrops/2001.jpg', rect: { x: 32.81, y: 9.38,  w: 55.31, h: 67.55 } },
  { year: '2005', screen: 'screen-2005', backdrop: 'backdrops/2005.jpg', rect: { x: 32.97, y: 15.87, w: 55.16, h: 51.44 } },
  { year: '2007', screen: 'screen-2007', backdrop: 'backdrops/2007.jpg', rect: { x: 32.97, y: 15.87, w: 55.16, h: 51.44 } },
  { year: '2010', screen: 'screen-2010', backdrop: 'backdrops/2010.jpg', rect: { x: 32.97, y: 16.71, w: 55.08, h: 49.52 } },
  { year: '2012', screen: 'screen-2012', backdrop: 'backdrops/2012.jpg', rect: { x: 31.88, y: 16.71, w: 57.42, h: 49.52 } },
  { year: '2014', screen: 'screen-2014', backdrop: 'backdrops/2014.jpg', rect: { x: 31.88, y: 16.71, w: 57.42, h: 49.52 } },
  { year: '2015', screen: 'screen-2015', backdrop: 'backdrops/2015.jpg', rect: { x: 31.64, y: 16.71, w: 57.58, h: 49.52 } },
  { year: '2020', screen: 'screen-2020', backdrop: 'backdrops/2020.jpg', rect: { x: 32.89, y: 14.66, w: 55.23, h: 53.85 } }
];

const timeline = document.getElementById('timeline');
const backdrop = document.getElementById('backdrop');
const screenWindow = document.getElementById('screenWindow');
const iframe = document.getElementById('historicalFrame');
const computerWrap = document.getElementById('computerWrap');

let currentIndex = 0;
let furthestIndex = 0;
let frameReady = false;
let currentScale = 1;

function renderTimeline() {
  timeline.innerHTML = '';
  eras.forEach((era, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'timeline-btn';
    button.textContent = era.year;
    if (index <= furthestIndex) button.classList.add('visited');
    if (index === currentIndex) button.classList.add('active');
    button.addEventListener('click', () => setEra(index, true));
    timeline.appendChild(button);
  });
}

function resizeIframe() {
  const baseWidth = 1512;
  const baseHeight = 900;
  const frameArea = screenWindow.getBoundingClientRect();
  currentScale = Math.min(frameArea.width / baseWidth, frameArea.height / baseHeight);
  iframe.style.width = baseWidth + 'px';
  iframe.style.height = baseHeight + 'px';
  iframe.style.transform = `scale(${currentScale})`;
}

function applyRect(rect) {
  screenWindow.style.left = rect.x + '%';
  screenWindow.style.top = rect.y + '%';
  screenWindow.style.width = rect.w + '%';
  screenWindow.style.height = rect.h + '%';
  resizeIframe();
}

function setEra(index, postMessageToIframe = false) {
  currentIndex = index;
  furthestIndex = Math.max(furthestIndex, index);
  const era = eras[index];
  backdrop.src = era.backdrop;
  applyRect(era.rect);
  renderTimeline();
  if (postMessageToIframe && frameReady) {
    iframe.contentWindow.postMessage({ type: 'web-evolution-goto', screen: era.screen }, '*');
  }
}

iframe.addEventListener('load', () => {
  frameReady = true;
  setEra(0, true);
});

window.addEventListener('message', (event) => {
  if (event.source !== iframe.contentWindow || event.data?.type !== 'web-evolution-era') return;
  const foundIndex = eras.findIndex(era => era.year === String(event.data.year));
  if (foundIndex !== -1) {
    currentIndex = foundIndex;
    furthestIndex = Math.max(furthestIndex, foundIndex);
    renderTimeline();
  }
});

window.addEventListener('resize', resizeIframe);
setEra(0, false);
