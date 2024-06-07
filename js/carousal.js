"use strict";

function homeCarousal() {
  const carousalItems = document.querySelectorAll(".header .carousal__item");
  const carousalDotsContainer = document.querySelector(
    ".header .carousal__dots"
  );
  const carousalDots = document.querySelectorAll(".header .carousal__dot");

  const carousalIntervalDuration = 5000;
  let activeItem = 1;

  const updateCarousal = function (slideTo) {
    if (slideTo > carousalItems.length) {
      activeItem = 1;
    } else {
      activeItem = slideTo;
    }
    carousalItems.forEach((item) => {
      item.classList.remove("carousal__item--active");
    });
    carousalItems[activeItem - 1].classList.add("carousal__item--active");

    // Activate dot
    carousalDots.forEach((dot) =>
      dot.classList.remove("carousal__dot--active")
    );
    carousalDots[activeItem - 1].classList.add("carousal__dot--active");
  };

  const startInterval = function () {
    return setInterval(() => {
      activeItem++;
      updateCarousal(activeItem);
    }, carousalIntervalDuration);
  };

  updateCarousal(activeItem);

  let timer = startInterval();

  // Event Listeners
  carousalDotsContainer.addEventListener("click", function (e) {
    if (!e.target.classList.contains("carousal__dot")) return;
    clearInterval(timer);
    const activeIndex = e.target.dataset.index;
    updateCarousal(activeIndex);
    timer = startInterval();
  });
}
homeCarousal();
