document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", function () {
      this.querySelector(".card-inner").classList.toggle("flipped"); // 個別翻轉
    });
});

// ======輪播圖========
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".carousel").forEach((carousel, index) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = carousel.querySelectorAll(".carousel-slide");
    const prevBtn = carousel.querySelector(".prev");
    const nextBtn = carousel.querySelector(".next");
    const dotsContainer = carousel.querySelector(".carousel-dots");

    let currentIndex = 0;
    let interval;
    let isPausedByUser = false;
    let resumeTimeout;
    let isAnimating = false; // 防止快速連點或滑動時跳兩張

    // 生成小圓點
    slides.forEach((_, i) => {
      if (i < slides.length - 1) {
        const dot = document.createElement("div");
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);
      }
    });

    const dots = carousel.querySelectorAll(".carousel-dots div");
    dots[0].classList.add("active");

    function updateCarousel(index) {
      if (isAnimating) return;
      isAnimating = true;
      track.style.transition = "transform 0.5s ease-in-out";
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot) => dot.classList.remove("active"));
      if (index < dots.length) dots[index].classList.add("active");
      setTimeout(() => (isAnimating = false), 500);
    }

    function nextSlide() {
      if (currentIndex >= slides.length - 1) {
        track.style.transition = "none";
        currentIndex = 0;
        track.style.transform = "translateX(0)";
        setTimeout(() => {
          track.style.transition = "transform 0.5s ease-in-out";
          nextSlide();
        }, 50);
      } else {
        currentIndex++;
        updateCarousel(currentIndex);
      }
    }

    function prevSlide() {
      if (isAnimating) return;
      if (currentIndex <= 0) {
        track.style.transition = "none";
        currentIndex = slides.length - 2;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        setTimeout(() => {
          track.style.transition = "transform 0.5s ease-in-out";
          updateCarousel(currentIndex);
        }, 50);
      } else {
        currentIndex--;
        updateCarousel(currentIndex);
      }
    }

    function startAutoSlide() {
      stopAutoSlide();
      interval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
      clearInterval(interval);
    }

    function pauseAutoSlide() {
      isPausedByUser = true;
      stopAutoSlide();
    }

    function delayedResumeAutoSlide() {
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        isPausedByUser = false;
        startAutoSlide();
      }, 2000);
    }

    prevBtn.addEventListener("click", () => {
      pauseAutoSlide();
      prevSlide();
    });

    nextBtn.addEventListener("click", () => {
      pauseAutoSlide();
      nextSlide();
    });

    dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        pauseAutoSlide();
        currentIndex = Number(e.target.dataset.index);
        updateCarousel(currentIndex);
      });
    });

    carousel.addEventListener("mouseenter", stopAutoSlide);
    carousel.addEventListener("mouseleave", () => {
      if (isPausedByUser) {
        delayedResumeAutoSlide();
      } else {
        startAutoSlide();
      }
    });

    let startX;
    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", (e) => {
      let endX = e.changedTouches[0].clientX;
      if (startX > endX + 50) {
        pauseAutoSlide();
        nextSlide();
      } else if (startX < endX - 50) {
        pauseAutoSlide();
        prevSlide();
      }
    });

    setTimeout(() => startAutoSlide(), index * 1000); // 設定時間差開始自動播放
  });
});

