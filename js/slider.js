$(document).ready(function () {
  $(".slider-container").each(function () {
    const sliderContainer = $(this);
    let currentSlide = 0;
    const slider = sliderContainer.find(".slider");
    const slides = sliderContainer.find(".slide");
    const slideCount = slides.length;
    const slidesVisible = 3;
    let slideWidth; // Объявляем slideWidth здесь, чтобы она была доступна в глобальной области видимости
    let isAtBeginning = true;
    let isAtEnd = false;

    // Функция для пересчета ширины слайда
    function calculateSlideWidth() {
      slideWidth = sliderContainer.width() / slidesVisible;
      slides.width(slideWidth); // Устанавливаем новую ширину для слайдов
      updateSlider(); // Обновляем слайдер, чтобы учесть новую ширину
    }

    // Функция для обновления состояния кнопок
    function updateButtonState() {
      sliderContainer.find(".prev").prop("disabled", isAtBeginning);
      sliderContainer.find(".next").prop("disabled", isAtEnd);
    }

    // Функция для обновления слайдера
    function updateSlider() {
      const translateValue = -currentSlide * slideWidth;
      slider.css("transform", `translateX(${translateValue}px)`);
      isAtBeginning = currentSlide === 0;
      isAtEnd = currentSlide >= slideCount - slidesVisible;
      updateButtonState();
    }

    // Обработчик для кнопки Next
    sliderContainer.find(".next").click(function (e) {
      e.preventDefault();
      if (currentSlide < slideCount - slidesVisible) {
        currentSlide++;
        updateSlider();
      }
    });

    // Обработчик для кнопки Prev
    sliderContainer.find(".prev").click(function (e) {
      e.preventDefault();
      if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
      }
    });

    // Вызываем calculateSlideWidth при загрузке страницы и при изменении размера окна
    $(window).on("load resize", function () {
      calculateSlideWidth();
    });

    // Инициализация:
    calculateSlideWidth(); // Первоначальный расчет ширины слайда
    updateSlider();
  });
});
