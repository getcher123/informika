// Main page: banner carousel
document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll("[data-carousel]");
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
    const dotsHost = carousel.querySelector("[data-carousel-dots]");
    const btnPrev = carousel.querySelector("[data-carousel-prev]");
    const btnNext = carousel.querySelector("[data-carousel-next]");

    if (!track || slides.length === 0) return;

    let index = 0;
    let timerId = null;
    const interval = Number.parseInt(carousel.getAttribute("data-interval") || "7000", 10);

    const setIndex = (nextIndex, { userAction = false } = {}) => {
      const total = slides.length;
      index = ((nextIndex % total) + total) % total;
      track.style.transform = `translateX(${-index * 100}%)`;

      if (dotsHost) {
        const dots = Array.from(dotsHost.querySelectorAll("button"));
        dots.forEach((dot, i) => {
          dot.classList.toggle("is-active", i === index);
          dot.setAttribute("aria-current", i === index ? "true" : "false");
        });
      }

      // After explicit user action, restart autoplay to avoid "double-step".
      if (userAction) restart();
    };

    const stop = () => {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    };

    const start = () => {
      if (slides.length <= 1) return;
      if (timerId) return;
      timerId = window.setInterval(() => setIndex(index + 1), interval);
    };

    const restart = () => {
      stop();
      start();
    };

    // Build dots dynamically (keeps markup simple if slide count changes).
    if (dotsHost) {
      dotsHost.innerHTML = "";
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "main-carousel__dot";
        dot.setAttribute("aria-label", `Слайд ${i + 1}`);
        dot.addEventListener("click", () => setIndex(i, { userAction: true }));
        dotsHost.appendChild(dot);
      });
    }

    btnPrev?.addEventListener("click", () => setIndex(index - 1, { userAction: true }));
    btnNext?.addEventListener("click", () => setIndex(index + 1, { userAction: true }));

    // Pause on hover/focus, resume on leave.
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);

    // Basic swipe support for mobile.
    let startX = null;
    carousel.addEventListener(
      "touchstart",
      (e) => {
        if (!e.touches || e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        stop();
      },
      { passive: true },
    );

    carousel.addEventListener(
      "touchend",
      (e) => {
        if (startX === null) return;
        const endX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : startX;
        const delta = endX - startX;
        startX = null;

        if (Math.abs(delta) > 50) {
          setIndex(index + (delta < 0 ? 1 : -1), { userAction: true });
        }

        start();
      },
      { passive: true },
    );

    // Init
    setIndex(0);
    start();
  });
});

