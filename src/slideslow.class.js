export class Slideshow {
    constructor(containerSelector, interval = 3000) {
        this.container = document.querySelector(containerSelector);
        this.slides = this.container.querySelectorAll('.slide');
        this.prevButton = this.container.querySelector('.prev');
        this.nextButton = this.container.querySelector('.next');
        this.currentIndex = 0;
        this.interval = interval;
        this.timer = null;

        this.init();
    }

    init() {
        // Show the first slide
        this.showSlide(this.currentIndex);

        // Set up event listeners for navigation
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());

        // Start auto-slide
        this.startAutoSlide();

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.container.addEventListener('mouseleave', () => this.startAutoSlide());
    }

    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => slide.classList.remove('active'));

        // Show the current slide
        this.slides[index].classList.add('active');
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(this.currentIndex);
    }

    prevSlide() {
        this.currentIndex =
            (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentIndex);
    }

    startAutoSlide() {
        this.stopAutoSlide(); // Clear any existing timer
        this.timer = setInterval(() => this.nextSlide(), this.interval);
    }

    stopAutoSlide() {
        clearInterval(this.timer);
    }
}
