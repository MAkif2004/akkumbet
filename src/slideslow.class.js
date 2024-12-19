export class Slideshow {
    constructor(containerSelector, interval = 3000) {
        this.container = document.querySelector(containerSelector);
        this.track = this.container.querySelector('.slider-track');
        this.slides = Array.from(this.track.children);
        this.totalSlides = this.slides.length;
        this.currentIndex = 0;
        this.interval = interval;
        this.timer = null;

        // Buttons
        this.prevButton = this.container.querySelector('.prev');
        this.nextButton = this.container.querySelector('.next');

        this.init();
    }

    init() {
        // Dynamically set the track's width based on the number of slides
        this.track.style.width = `${this.totalSlides * 100}%`;

        // Add event listeners for buttons
        this.prevButton.addEventListener('click', () => {
            this.prevSlide();
            this.stopAutoSlide();
            this.startAutoSlide();
        });
        this.nextButton.addEventListener('click', () => {
            this.nextSlide();
            this.stopAutoSlide();
            this.startAutoSlide();
        });

        // Start auto-slide
        this.startAutoSlide();
    }

    updateSlidePosition() {
        const offset = -this.currentIndex * 100; // Calculate offset in percentage
        this.track.style.transform = `translateX(${offset}%)`;
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides; // Loop back to the first slide
        this.updateSlidePosition();
    }

    prevSlide() {
        this.currentIndex =
            (this.currentIndex - 1 + this.totalSlides) % this.totalSlides; // Loop back to the last slide
        this.updateSlidePosition();
    }

    startAutoSlide() {
        this.stopAutoSlide(); // Clear any existing timer
        this.timer = setInterval(() => this.nextSlide(), this.interval);
    }

    stopAutoSlide() {
        clearInterval(this.timer);
    }
}
