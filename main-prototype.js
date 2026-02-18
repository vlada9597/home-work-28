function Slider(selector, config) {
  this.slider = document.querySelector(selector);
  this.slidesContainer = this.slider.querySelector('.slides');
  this.slides = Array.from(this.slider.querySelectorAll('.slide'));
  this.current = 0;
  this.auto = config.autoPlay ?? true;
  this.intervalTime = config.interval ?? 3000;
  this.showIndicators = config.showIndicators ?? true;

  this.indicatorsContainer = document.createElement('div');
  this.indicatorsContainer.className = 'indicators';
  this.slider.appendChild(this.indicatorsContainer);

  this.controlsContainer = document.createElement('div');
  this.controlsContainer.className = 'controls';
  this.slider.appendChild(this.controlsContainer);

  this.toggleAutoBtn = document.createElement('button');
  this.toggleAutoBtn.className = 'auto-button';
  this.toggleAutoBtn.textContent = 'Pause';
  this.slider.appendChild(this.toggleAutoBtn);

  this.init();
}

Slider.prototype.init = function () {
  this.createControls();
  if (this.showIndicators) this.createIndicators();
  this.update();

  this.controlsContainer.querySelector('#prev').addEventListener('click', this.prevSlide.bind(this));
  this.controlsContainer.querySelector('#next').addEventListener('click', this.nextSlide.bind(this));
  this.toggleAutoBtn.addEventListener('click', this.toggleAuto.bind(this));
  document.addEventListener('keydown', this.handleKey.bind(this));

  if (this.auto) this.startAuto();
};

Slider.prototype.createControls = function () {
  this.controlsContainer.innerHTML = `
    <button id="prev">&#10094;</button>
    <button id="next">&#10095;</button>
  `;
};

Slider.prototype.createIndicators = function () {
  this.indicatorsContainer.innerHTML = '';
  this.slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'indicator';
    if (i === this.current) dot.classList.add('active');
    dot.addEventListener('click', () => this.goToSlide(i));
    this.indicatorsContainer.appendChild(dot);
  });
};

Slider.prototype.updateIndicators = function () {
  const dots = this.indicatorsContainer.querySelectorAll('.indicator');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === this.current);
  });
};

Slider.prototype.goToSlide = function (index) {
  this.current = (index + this.slides.length) % this.slides.length;
  this.update();
};

Slider.prototype.nextSlide = function () {
  this.goToSlide(this.current + 1);
};

Slider.prototype.prevSlide = function () {
  this.goToSlide(this.current - 1);
};

Slider.prototype.update = function () {
  this.slidesContainer.style.transform = `translateX(-${this.current * 100}%)`;
  if (this.showIndicators) this.updateIndicators();
};

Slider.prototype.startAuto = function () {
  this.stopAuto();
  this.interval = setInterval(this.nextSlide.bind(this), this.intervalTime);
};

Slider.prototype.stopAuto = function () {
  clearInterval(this.interval);
};

Slider.prototype.toggleAuto = function () {
  this.auto = !this.auto;
  this.toggleAutoBtn.textContent = this.auto ? 'Pause' : 'Play';
  this.auto ? this.startAuto() : this.stopAuto();
};

Slider.prototype.handleKey = function (e) {
  if (e.key === 'ArrowRight') this.nextSlide();
  else if (e.key === 'ArrowLeft') this.prevSlide();
};

//  AdvancedSlider 

function AdvancedSlider(selector, config) {
  Slider.call(this, selector, config);
  this.startX = 0;
  this.isDragging = false;

  this.slider.addEventListener('touchstart', this.handleTouchStart.bind(this));
  this.slider.addEventListener('touchend', this.handleTouchEnd.bind(this));

  this.slider.addEventListener('mousedown', this.handleMouseDown.bind(this));
  this.slider.addEventListener('mouseup', this.handleMouseUp.bind(this));
}

AdvancedSlider.prototype = Object.create(Slider.prototype);
AdvancedSlider.prototype.constructor = AdvancedSlider;

AdvancedSlider.prototype.handleTouchStart = function (e) {
  this.startX = e.touches[0].clientX;
};

AdvancedSlider.prototype.handleTouchEnd = function (e) {
  const dx = e.changedTouches[0].clientX - this.startX;
  if (dx > 50) this.prevSlide();
  else if (dx < -50) this.nextSlide();
};

AdvancedSlider.prototype.handleMouseDown = function (e) {
  this.isDragging = true;
  this.startX = e.clientX;
};

AdvancedSlider.prototype.handleMouseUp = function (e) {
  if (!this.isDragging) return;
  const dx = e.clientX - this.startX;
  if (dx > 50) this.prevSlide();
  else if (dx < -50) this.nextSlide();
  this.isDragging = false;
};

//  Ініціалізація 
const config = {
  autoPlay: true,
  interval: 3000,
  showIndicators: true,
};

new AdvancedSlider('#slider', config);
