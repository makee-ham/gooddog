$(document).ready(function () {
  const totalSlides = $("#topSwiper .swiper-slide").length - 1;

  const topSwiper = new Swiper("#topSwiper", {
    direction: "horizontal",
    slidesPerView: 1,
    allowTouchMove: false,
    speed: 800,
  });

  const bottomSwiper = new Swiper("#bottomSwiper", {
    direction: "horizontal",
    slidesPerView: 1,
    allowTouchMove: false,
    speed: 800,
    initialSlide: totalSlides,
  });

  let currentIndex = 0;

  $("#fullpage").fullpage({
    menu: "#menu",
    anchors: ["welcome", "aboutUs", "programs", "contact"],
    autoScrolling: true,
    fitToSection: true,
    scrollingSpeed: 700,
    css3: true,
    onLeave: function (origin, destination, direction) {
      // #aboutUs 섹션에서만 currentIndex를 기준으로 동작
      if (origin.index === 1) {
        // 아래로 이동 시 currentIndex가 totalSlides에 도달해야 섹션 전환 허용
        if (direction === "down" && currentIndex !== totalSlides) {
          return false;
        }
        // 위로 이동 시 currentIndex가 0이어야 섹션 전환 허용
        if (direction === "up" && currentIndex !== 0) {
          return false;
        }
      }
      return true;
    },
  });

  // 메뉴가 제 기능 수행하게 하기..
  $("#menu li a").on("click", function (e) {
    e.preventDefault();
    var anchor = $(this).attr("href").substring(1); // # 제거
    // index.html 상 섹션 순서 (0-based):
    // 0: Welcome, 1: About us, 2: values, 3: doctors, 4: Programs, 5: Contact, 6: 파트너
    if (anchor === "welcome") {
      fullpage_api.moveTo(1); // 만약 fullpage.js가 1-based로 동작하면 1번(Welcome)으로 이동
    } else if (anchor === "aboutUs") {
      fullpage_api.moveTo(2); // About us 섹션 (index 1, 1-based이면 moveTo(2))
    } else if (anchor === "programs") {
      fullpage_api.moveTo(5); // Programs 섹션 (index 4, 1-based이면 moveTo(5))
    } else if (anchor === "contact") {
      fullpage_api.moveTo(6); // Contact 섹션 (index 5, 1-based이면 moveTo(6))
    }
  });

  // #aboutUs 섹션에 진입하면 초기화
  $(document).on("afterLoad", function (event, origin, destination) {
    if (destination.index === 1) {
      currentIndex = 0;
      topSwiper.slideTo(0, 0, false);
      fullpage_api.setAllowScrolling(false);
    } else {
      fullpage_api.setAllowScrolling(true);
    }
  });

  // #section-aboutUs 내 휠 이벤트 처리
  $("#section-aboutUs").on("wheel", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const delta = e.originalEvent.deltaY;

    if (delta > 0 && currentIndex < totalSlides) {
      // 아래로 스크롤 -> 슬라이드 전환
      currentIndex++;
      topSwiper.slideTo(currentIndex);
      bottomSwiper.slideTo(totalSlides - currentIndex);
    } else if (delta < 0 && currentIndex > 0) {
      // 위로 스크롤 -> 슬라이드 전환
      currentIndex--;
      topSwiper.slideTo(currentIndex);
      bottomSwiper.slideTo(totalSlides - currentIndex);
    } else if (delta > 0 && currentIndex === totalSlides) {
      // 마지막 슬라이드에서 아래로 스크롤 -> 다음 섹션으로 이동
      fullpage_api.setAllowScrolling(true);
      fullpage_api.moveSectionDown();
    } else if (delta < 0 && currentIndex === 0) {
      // 첫 슬라이드에서 위로 스크롤 -> 이전 섹션으로 이동
      fullpage_api.setAllowScrolling(true);
      fullpage_api.moveSectionUp();
    }
  });
});
