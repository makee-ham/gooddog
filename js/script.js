$(document).ready(function () {
  // 함수: 프로그래스 사이드바 active 상태 업데이트
  function updateProgressSidebar(index) {
    $(".progress-sidebar li").removeClass("active");
    $(".progress-sidebar li").eq(index).addClass("active");
  }

  // 초기 active 설정 (첫 번째 섹션)
  updateProgressSidebar(0);

  // 스와이퍼와 풀페이지를 동시에 쓰려는 노력
  const totalStorySlides = $("#topSwiper .swiper-slide").length - 1;
  const totalProgramSlides = $("#programsContainer .swiper-slide").length - 1;

  const topSwiper = new Swiper("#topSwiper", {
    direction: "horizontal",
    slidesPerView: 1,
    allowTouchMove: false,
    speed: 1000,
  });

  const bottomSwiper = new Swiper("#bottomSwiper", {
    direction: "horizontal",
    slidesPerView: 1,
    allowTouchMove: false,
    speed: 1000,
    initialSlide: totalStorySlides,
  });

  // programs swiper
  const programSwiper = new Swiper("#programsContainer", {
    direction: "vertical",
    slidesPerView: 1,
    allowTouchMove: false,
    speed: 1000,
  });

  let currentStoryIndex = 0;
  let currentProgramIndex = 0;

  // 메뉴가 제 기능 수행하게 하기..
  $("#menu li a").on("click", function (e) {
    e.preventDefault();
    const anchor = $(this).attr("href").substring(1); // # 제거

    // 메뉴 클릭 상태 설정
    $("body").data("menuClick", true);

    // fullpage.js 섹션 이동
    if (anchor === "welcome") {
      fullpage_api.moveTo(1); // Welcome 섹션
    } else if (anchor === "aboutUs") {
      fullpage_api.moveTo(2); // About Us 섹션
    } else if (anchor === "programs") {
      fullpage_api.moveTo(5); // Programs 섹션
    } else if (anchor === "contact") {
      fullpage_api.moveTo(6); // Contact 섹션
    }
  });

  // 풀페이지 설정
  $("#fullpage").fullpage({
    menu: "#menu",
    anchors: ["welcome", "aboutUs", "programs", "contact"],
    autoScrolling: true,
    fitToSection: true,
    fitToSectionDelay: 1000,
    scrollingSpeed: 800,
    css3: true,
    // onLeave가 섹션 이동할 때라 좀 콜백으로 할 게 많음
    // https://close-up.tistory.com/entry/fullPagejs-%EC%97%90%EC%84%9C-%ED%8A%B9%EC%A0%95-%EC%9D%B8%EB%8D%B1%EC%8A%A4%EC%9D%BC-%EB%95%8C-%EC%9D%B8%EB%8D%B1%EC%8A%A4-%EC%9D%B4%EB%8F%99%ED%95%A0-%EB%95%8C-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0
    onLeave: function (origin, destination, direction) {
      // 메뉴 프로그래스 바
      const progressBar = $(".progress-bar");
      const indexCount = 6; // index 0~6 -> 총 7개 섹션
      const progressPerIndex =
        $(".progress-container").outerWidth() / indexCount;

      switch (destination.index) {
        case 0:
          progressBar.width(progressPerIndex * 0);
          break;
        case 1:
          progressBar.width(progressPerIndex * 1);
          break;
        case 2:
          progressBar.width(progressPerIndex * 2);
          break;
        case 3:
          progressBar.width(progressPerIndex * 3);
          break;
        case 4:
          progressBar.width(progressPerIndex * 4);
          break;
        case 5:
          progressBar.width(progressPerIndex * 5);
          break;
        case 6:
          progressBar.width(progressPerIndex * 6 - 2);
          break;
      }

      ///////////////////////////////////////

      // 메뉴 클릭으로 이동 중인지 확인
      const isMenuClick = $("body").data("menuClick");
      const header = $("#header");

      ///////////////////////////////////////
      // 헤더 상태 업데이트
      if (destination.index === 0) {
        // 첫 번째 섹션에서는 기본 헤더
        header.removeClass("scrolled");
      } else {
        // 다른 섹션에서는 투명 헤더
        header.addClass("scrolled");
      }
      ///////////////////////////////////////

      // 메뉴 클릭 상태 처리
      if (!isMenuClick && (origin.index === 1 || origin.index === 4)) {
        if (direction === "down") {
          if (
            (origin.index === 1 && currentStoryIndex < totalStorySlides) ||
            (origin.index === 4 && currentProgramIndex < totalProgramSlides)
          ) {
            return false;
          }
        }
        if (direction === "up") {
          if (
            (origin.index === 1 && currentStoryIndex > 0) ||
            (origin.index === 4 && currentProgramIndex > 0)
          ) {
            return false;
          }
        }
      }

      // 메뉴 클릭 후 데이터 초기화
      $("body").data("menuClick", false);

      // 1440px 이하일 때만 사이드바의 active 상태 업데이트
      if ($(window).width() <= 1440) {
        updateProgressSidebar(destination.index);
      }

      return true;
    },
  });

  // 우측 프로그래스 사이드바 항목 클릭 시 해당 섹션으로 이동
  $(".progress-sidebar li").on("click", function () {
    var index = $(this).data("index");
    fullpage_api.moveTo(index + 1);
  });

  let isScrolling = false;

  // #aboutUs 섹션에 진입하면 초기화
  $(document).on("afterLoad", function (event, origin, destination) {
    if (destination.index === 1) {
      currentStoryIndex = 0;
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

    if (isScrolling) return; // 스크롤 중이면 실행 안 함 (너무 빨리 전환되지 않게)
    isScrolling = true; // 스크롤 막기

    setTimeout(() => {
      isScrolling = false; // 700ms 후 다시 스크롤 가능하게
    }, 700);

    const delta = e.originalEvent.deltaY;

    if (delta > 0 && currentStoryIndex < totalStorySlides) {
      currentStoryIndex++;
      topSwiper.slideTo(currentStoryIndex);
      bottomSwiper.slideTo(totalStorySlides - currentStoryIndex);
    } else if (delta < 0 && currentStoryIndex > 0) {
      currentStoryIndex--;
      topSwiper.slideTo(currentStoryIndex);
      bottomSwiper.slideTo(totalStorySlides - currentStoryIndex);
    } else if (delta > 0 && currentStoryIndex === totalStorySlides) {
      // 마지막 슬라이드에서 아래로 스크롤 -> 다음 섹션으로 이동
      fullpage_api.setAllowScrolling(true);
      fullpage_api.moveSectionDown();
    } else if (delta < 0 && currentStoryIndex === 0) {
      // 첫 슬라이드에서 위로 스크롤 -> 이전 섹션으로 이동
      fullpage_api.setAllowScrolling(true);
      fullpage_api.moveSectionUp();
    }
  });

  // #section-programs 섹션에 진입하면 초기화
  $(document).on("afterLoad", function (event, origin, destination) {
    if (destination.index === 4) {
      currentProgramIndex = 0;
      programSwiper.slideTo(0, 0, false);
      fullpage_api.setAllowScrolling(false);
    } else {
      fullpage_api.setAllowScrolling(true);
    }
  });

  // #section-programs 내 휠 이벤트 처리
  $("#section-programs").on("wheel", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (isScrolling) return; // 스크롤 중이면 실행 안 함 (너무 빨리 전환되지 않게)
    isScrolling = true; // 스크롤 막기

    setTimeout(() => {
      isScrolling = false; // 700ms 후 다시 스크롤 가능하게
    }, 700);

    const delta = e.originalEvent.deltaY;

    if (delta > 0 && currentProgramIndex < totalProgramSlides) {
      currentProgramIndex++;
      programSwiper.slideTo(currentProgramIndex);
    } else if (delta < 0 && currentProgramIndex > 0) {
      currentProgramIndex--;
      programSwiper.slideTo(currentProgramIndex);
    } else if (delta > 0 && currentProgramIndex === totalProgramSlides) {
      // 마지막 슬라이드에서 아래로 스크롤 -> 다음 섹션으로 이동
      fullpage_api.setAllowScrolling(true);
      fullpage_api.moveSectionDown();
    } else if (delta < 0 && currentProgramIndex === 0) {
      // 첫 슬라이드에서 위로 스크롤 -> 이전 섹션으로 이동
      fullpage_api.setAllowScrolling(true);
      fullpage_api.moveSectionUp();
    }
  });
  /////////////////////////////////////
  // contact form에서 체크박스
  $("#agreeLabel").on("click", function () {
    this.classList.toggle("active");
  });
});
