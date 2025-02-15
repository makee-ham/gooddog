$(document).ready(function () {
  const totalSlides = $("#topSwiper .swiper-slide").length - 1;

  const topSwiper = new Swiper("#topSwiper", {
    direction: "horizontal",
    slidesPerView: 1,
    allowTouchMove: false,
    speed: 800,
  });

  // bottomSwiper는 역연출을 위해 초기 슬라이드를 마지막 인덱스로 설정
  const bottomSwiper = new Swiper("#bottomSwiper", {
    direction: "horizontal",
    slidesPerView: 1,
    allowTouchMove: false,
    speed: 800,
    initialSlide: totalSlides,
  });

  let currentIndex = 0;

  $("#fullpage").fullpage({
    licenseKey: "OPEN-SOURCE-GPL-V3",
    anchors: ["welcome", "aboutUs", "programs", "contact"],
    autoScrolling: true,
    fitToSection: true,
    scrollingSpeed: 700,
    css3: true,
    // onLeave: 만약 #aboutUs(섹션 index 1)에서 currentIndex가 0이 아니라면 섹션 전환을 막음
    onLeave: function (origin, destination, direction) {
      if (origin.index === 1 && currentIndex !== 0) {
        return false;
      }
      return true;
    },
  });

  // 메뉴가 제 기능 수행하게 하기..
  $("#menu li a").on("click", function (e) {
    e.preventDefault();
    var anchor = $(this).attr("href").substring(1);
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

  // #aboutUs 섹션에 진입하면 초기 상태를 설정 (topSwiper는 0번, bottomSwiper는 마지막 슬라이드)
  $(document).on("afterLoad", function (event, origin, destination, direction) {
    if (destination.index === 1) {
      // #aboutUs 섹션
      isInSwiper = true;
      currentIndex = 0;
      topSwiper.slideTo(0, 0, false);
      // bottomSwiper는 initialSlide 옵션에 의해 이미 마지막 슬라이드가 보임
      fullpage_api.setAllowScrolling(false);
    } else {
      fullpage_api.setAllowScrolling(true);
    }
  });

  // #aboutUs 내에서 휠 이벤트 처리: 슬라이드 전환 및 섹션 이동
  $("#aboutUs").on("wheel", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const delta = e.originalEvent.deltaY;

    if (delta > 0 && currentIndex < totalSlides) {
      currentIndex++;
      topSwiper.slideTo(currentIndex);
      bottomSwiper.slideTo(totalSlides - currentIndex);
    } else if (delta < 0 && currentIndex > 0) {
      currentIndex--;
      topSwiper.slideTo(currentIndex);
      bottomSwiper.slideTo(totalSlides - currentIndex);
    } else if (delta > 0 && currentIndex === totalSlides) {
      // 마지막 슬라이드에서 아래로 스크롤 시 → 다음 섹션 (#values)로 이동
      isInSwiper = false;
      fullpage_api.setAllowScrolling(true);
      fullpage_api.moveSectionDown();
    } else if (delta < 0 && currentIndex === 0) {
      // 첫 슬라이드에서 위로 스크롤 시 → 이전 섹션 (#welcome)로 이동
      isInSwiper = false;
      fullpage_api.setAllowScrolling(true);
      fullpage_api.moveSectionUp();
    }
  });
});
