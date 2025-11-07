/**
 * IDEA.JS - Детальные страницы идей/запросов
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarRatings();
});

function initStarRatings() {
  const starRatings = document.querySelectorAll('.star-rating');

  starRatings.forEach(rating => {
    const buttons = rating.querySelectorAll('.star-btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();

        const value = parseInt(this.dataset.value, 10);
        rating.dataset.rating = value;

        buttons.forEach((star, index) => {
          const starPath = star.querySelector('path');
          if (index < value) {
            starPath.setAttribute('fill', '#00A8CC');
          } else {
            starPath.setAttribute('fill', 'none');
          }
        });
      });

      btn.addEventListener('mouseenter', function () {
        const value = parseInt(this.dataset.value, 10);

        buttons.forEach((star, index) => {
          const starPath = star.querySelector('path');
          if (index < value) {
            starPath.setAttribute('fill', '#00D4AA');
          }
        });
      });

      btn.addEventListener('mouseleave', function () {
        const currentValue = parseInt(rating.dataset.rating, 10);

        buttons.forEach((star, index) => {
          const starPath = star.querySelector('path');
          if (index < currentValue) {
            starPath.setAttribute('fill', '#00A8CC');
          } else {
            starPath.setAttribute('fill', 'none');
          }
        });
      });
    });
  });
}
