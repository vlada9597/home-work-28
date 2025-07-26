class Slider {
  constructor(selector, config = {}) {
    this.slider = document.querySelector(selector);
    this.slidesContainer = this.slider.querySelector('.slides');
    this.slides = Array.from(this.slider.querySelectorAll('.slide'));
    this.current = 0;

    // Конфігурація з дефолтами
    this.auto = config.autoPlay ?? true;
    this.intervalTime = config.interval ?? 3000;
    this.showIndicators = config.showIndicators ?? true;

    // Генерація елементів керування
    this.controlsContainer = document.createElement('div');
    this.controlsContainer.className = 'controls';
    this.slider.appendChild(this.controlsContainer);

    this.indicatorsContainer = document.createElement('div');
    this.indicatorsContainer.className = 'indicators';
    this.slider.appendChild(this.indicatorsContainer);

    this.toggleAutoBtn = document.createElement('button');
    this.toggleAutoBtn.className = 'auto-button';
    this.toggleAutoBtn.textContent = 'Pause';
    this.slider.appendChild(this.toggleAutoBtn);

    this.init();
  }

  init() {
    this.createControls();
    if (this.showIndicators) this.createIndicators();
    this.update();

    this.controlsContainer.querySelector('#prev').addEventListener('click', () => this.prevSlide());
    this.controlsContainer.querySelector('#next').addEventListener('click', () => this.nextSlide());
    this.toggleAutoBtn.addEventListener('click', () => this.toggleAuto());
    document.addEventListener('keydown', (e) => this.handleKey(e));

    // Автопрогортання
    if (this.auto) this.startAuto();

    // Автопауза при наведенні
    this.slider.addEventListener('mouseenter', () => this.stopAuto());
    this.slider.addEventListener('mouseleave', () => this.auto && this.startAuto());
  }

  createControls() {
    this.controlsContainer.innerHTML = `
      <button id="prev">&#10094;</button>
      <button id="next">&#10095;</button>
    `;
  }

  createIndicators() {
    this.indicatorsContainer.innerHTML = '';
    this.slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'indicator';
      if (i === this.current) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(i));
      this.indicatorsContainer.appendChild(dot);
    });
  }

  updateIndicators() {
    this.indicatorsContainer.querySelectorAll('.indicator').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.current);
    });
  }

  goToSlide(index) {
    this.current = (index + this.slides.length) % this.slides.length;
    this.update();
  }

  nextSlide() {
    this.goToSlide(this.current + 1);
  }

  prevSlide() {
    this.goToSlide(this.current - 1);
  }

  update() {
    this.slidesContainer.style.transform = `translateX(-${this.current * 100}%)`;
    if (this.showIndicators) this.updateIndicators();
  }

  startAuto() {
    this.stopAuto();
    this.interval = setInterval(() => this.nextSlide(), this.intervalTime);
  }

  stopAuto() {
    clearInterval(this.interval);
  }

  toggleAuto() {
    this.auto = !this.auto;
    this.toggleAutoBtn.textContent = this.auto ? 'Pause' : 'Play';
    this.auto ? this.startAuto() : this.stopAuto();
  }

  handleKey(e) {
    if (e.key === 'ArrowRight') this.nextSlide();
    else if (e.key === 'ArrowLeft') this.prevSlide();
  }
}

class AdvancedSlider extends Slider {
  constructor(selector, config) {
    super(selector, config);
    this.startX = 0;
    this.isDragging = false;

    this.slider.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.slider.addEventListener('touchend', (e) => this.handleTouchEnd(e));

    this.slider.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.slider.addEventListener('mouseup', (e) => this.handleMouseUp(e));
  }

  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
  }

  handleTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - this.startX;
    if (dx > 50) this.prevSlide();
    else if (dx < -50) this.nextSlide();
  }

  handleMouseDown(e) {
    this.isDragging = true;
    this.startX = e.clientX;
  }

  handleMouseUp(e) {
    if (!this.isDragging) return;
    const dx = e.clientX - this.startX;
    if (dx > 50) this.prevSlide();
    else if (dx < -50) this.nextSlide();
    this.isDragging = false;
  }
}

//  Створення слайдера 
const config = {
  autoPlay: true,
  interval: 3000,
  showIndicators: true,
};

new AdvancedSlider('#slider', config);
