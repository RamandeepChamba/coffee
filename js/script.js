"use strict";

const navEl = document.querySelector(".nav");
const navTogglerEl = document.querySelector(".nav__toggler");
const navBodyEl = document.querySelector(".nav__body");
const headerEl = document.querySelector(".header");
const featureEls = document.querySelectorAll(".feature");
let slideIntoViewEls = document.querySelectorAll(".slide-into-view");
const aboutContentEl = document.querySelector(".about__content");
const menuContentEl = document.querySelector(".menu__content");
const sectionStatsEl = document.querySelector("section-stats");
const statCountEls = document.querySelectorAll(".stat__count");
const productTypeTabsEl = document.querySelector(".product-type-tabs");
const productsForTabsListEl = document.querySelector(
  ".section-products .card__list"
);
const productsForTabsEls = document.querySelectorAll(
  ".section-products .card__item--big"
);
const testimonialEls = document.querySelectorAll(".testimonial");

navTogglerEl.addEventListener("click", function (e) {
  navBodyEl.classList.toggle("nav__body--hidden");
  navEl.classList.toggle("nav--expanded");
});

// Sticky nav
let options = {
  root: null,
  rootMargin: "0px",
  threshold: [0, 0.1],
};

let observer = new IntersectionObserver(function (entries) {
  if (!entries[0].isIntersecting) {
    // make nav sticky
    // console.log("unshrink");
    navEl.classList.remove("nav--shrinked");
    // console.log("sticky");
    navEl.classList.add("nav--sticky");
  } else {
    if (
      entries[0].intersectionRatio >= 0 &&
      entries[0].intersectionRatio <= 0.1
    ) {
      // console.log("shrink");
      if (navEl.classList.contains("nav--expanded")) return;
      navEl.classList.add("nav--shrinked");
    } else if (entries[0].intersectionRatio > 0.1) {
      // console.log("non sticky");
      navEl.classList.remove("nav--sticky");
      // console.log("unshrink");
      navEl.classList.remove("nav--shrinked");
    }
  }
}, options);

observer.observe(headerEl);

// Section about
const aboutSectionObserver = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;
    if (entry.isIntersecting) {
      entry.target.classList.remove("hidden");
      observer.unobserve(entry.target);
    }
  },
  {
    root: null,
    threshold: [0.25],
  }
);
if (aboutContentEl) aboutSectionObserver.observe(aboutContentEl);
// Show (opacity, transform) sections as they are scrolled into view
const manyObserver = new IntersectionObserver(
  function (entries, observer) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // remove hidden 1 by 1 with delay
        setTimeout(() => {
          entry.target.classList.remove("hidden");
          observer.unobserve(entry.target);
        }, index * 100);
      }
    });
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: [0.3],
  }
);
const slideIntoViewObserver = new IntersectionObserver(
  function (entries, observer) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // if target is a stat item, start the counter
        if (
          entry.target.classList.contains("stat__item") &&
          entry.target.dataset.index == 1
        ) {
          statsCounter();
        }
        // animate fade up 1 by 1 with delay
        setTimeout(() => {
          entry.target.classList.add("animate-fade-in-up");
          // If target is last (number of testimonals are odd)
          // or second last(even) testimonial, darken the even testimonials
          if (
            [...testimonialEls].indexOf(entry.target) >=
            testimonialEls.length - 2
          ) {
            darkenTestimonials();
          }
          // Remove this class after animation finishes
          setTimeout(() => {
            entry.target.classList.remove("slide-into-view");
            entry.target.classList.remove("animate-fade-in-up");
          }, 1000);
          observer.unobserve(entry.target);
        }, index * 100);
      }
    });
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: [0.3],
  }
);
// Section Features
featureEls.forEach((featureEl) => {
  manyObserver.observe(featureEl);
  featureEl.classList.add("hidden");
});

// Section Testimonials
// add slide animation to odd testimonials
testimonialEls.forEach((testimonialEl, index) => {
  if (index % 2 === 0) {
    testimonialEl.classList.add("slide-into-view");
  }
});
// update / refresh to include testimonials
slideIntoViewEls = document.querySelectorAll(".slide-into-view");
// darken even testimonials
const darkenTestimonials = function () {
  testimonialEls.forEach((testimonialEl, index) => {
    if (index % 2 !== 0) {
      testimonialEl.classList.add("testimonial--dark");
    }
  });
};

// General
slideIntoViewEls.forEach((el) => {
  slideIntoViewObserver.observe(el);
});

///////////////////////////////////////////////////////////////
// Section stats
// Stats Counter
const statsCounter = function () {
  const counters = [
    {
      val: 0, // to 100
      el: null,
      max: 100,
    },
    {
      val: 0, // to 85
      el: null,
      max: 85,
    },
    {
      val: 0, // to 10,567
      el: null,
      max: 10567,
    },
    {
      val: 0, // to 900
      el: null,
      max: 900,
    },
  ];
  const intervalDelay = 80;

  // Add element references to counters array
  counters.forEach((counter, i) => (counter.el = statCountEls[i]));

  function count(counter) {
    // 1% of max value
    counter.val += counter.max / 100;
    counter.el.textContent = Math.trunc(counter.val).toLocaleString();
    if (counter.val >= counter.max) {
      clearInterval(counter.interval);
    }
  }

  counters.forEach((counter) => {
    counter.interval = setInterval(count, intervalDelay, counter);
  });
};

///////////////////////////////////////////////////////////////
// Product type tabs
// METHOD #1
/*
const productsForTabs = [
  {
    type: "main",
    name: "grilled beef",
    info: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.",
    price: "$2.90",
    img: "resources/imgs/dish_main_1.jpg",
  },
  {
    type: "main",
    name: "grilled beef",
    info: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.",
    price: "$2.90",
    img: "resources/imgs/dish_main_2.jpg",
  },
  {
    type: "main",
    name: "grilled beef",
    info: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.",
    price: "$2.90",
    img: "resources/imgs/dish_main_3.jpg",
  },
  {
    type: "drink",
    name: "lemonade juice",
    info: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.",
    price: "$2.90",
    img: "resources/imgs/dish_drink_1.jpg",
  },
  {
    type: "drink",
    name: "pineapple juice",
    info: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.",
    price: "$2.90",
    img: "resources/imgs/dish_drink_2.jpg",
  },
  {
    type: "drink",
    name: "soda drinks",
    info: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.",
    price: "$2.90",
    img: "resources/imgs/dish_drink_3.jpg",
  },
  {
    type: "dessert",
    name: "lava cake",
    info: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.",
    price: "$2.90",
    img: "resources/imgs/dish_dessert_1.jpg",
  },
  {
    type: "dessert",
    name: "lava cake",
    info: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.",
    price: "$2.90",
    img: "resources/imgs/dish_dessert_2.jpg",
  },
  {
    type: "dessert",
    name: "lava cake",
    info: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.",
    price: "$2.90",
    img: "resources/imgs/dish_dessert_3.jpg",
  },
];
productTypeTabsEl.addEventListener("click", function (e) {
  if (!e.target.classList.contains("product-type-tab")) return;
  const activeTab = productTypeTabsEl.querySelector(".active");
  // Check if active is the same as before
  if (activeTab === e.target) return;
  const type = e.target.dataset.type;
  // Remove previous active
  activeTab.classList.remove("active");
  // Clear product list
  productsForTabsListEl.innerHTML = "";
  // Render filtered products to list
  productsForTabsListEl.insertAdjacentHTML(
    "afterbegin",
    filterProductsForTabs(type)
  );

  // Make current tab active
  e.target.classList.add("active");
});

function filterProductsForTabs(type) {
  const filteredProducts = productsForTabs.filter(
    (product) => product.type === type
  );
  return `${filteredProducts
    .map(
      (product) => `
    <li class="product__item">
      <figure class="product">
        <a href="#">
          <img
            src="${product.img}"
            alt="${product.name}"
            class="product__photo"
          />
        </a>
        <figcaption class="product__content">
          <h6 class="product__name u-ucase">
            <a href="#"> ${product.name} </a>
          </h6>
          <p class="product__info">
            ${product.info}
          </p>
          <div class="product__price">${product.price}</div>
          <button class="btn btn--empty product__cta">
            Add to Cart
          </button>
        </figcaption>
      </figure>
    </li>  
  `
    )
    .join("")}`;
}

window.addEventListener("load", function () {
  // Clear product list
  productsForTabsListEl.innerHTML = "";
  // Render filtered products to list
  productsForTabsListEl.insertAdjacentHTML(
    "afterbegin",
    filterProductsForTabs("main")
  );
});
*/
// METHOD #2
if (productTypeTabsEl) {
  productTypeTabsEl.addEventListener("click", function (e) {
    if (!e.target.classList.contains("product-type-tab")) return;
    const activeTab = productTypeTabsEl.querySelector(".active");
    // Check if active is the same as before
    if (activeTab === e.target) return;
    const type = e.target.dataset.type;
    // Remove previous active
    activeTab.classList.remove("active");
    // Loop over products
    productsForTabsEls.forEach((productEl) => {
      // if product of type
      if (productEl.dataset.type === type) {
        // show
        productEl.classList.remove("hidden");
      }
      // else
      else {
        // hide
        productEl.classList.add("hidden");
      }
    });
    // Make current tab active
    e.target.classList.add("active");
  });
}
