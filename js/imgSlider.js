$(document).ready(function() {
    const slider = $('.slider-universal');
    const images = slider.find('img');
    const imageCount = images.length;
    let currentIndex = 0;

    const prevButton = $('.prev-button');
    const nextButton = $('.next-button');
    const animationContainer = $('.animation-container');
    let animationWidth = animationContainer.width();
    let animationHeight = animationContainer.height();

    let dotCount = imageCount; // Изначально устанавливаем dotCount равным imageCount
    if (imageCount > 10) {
        dotCount = 10;
    }
    const dotSpeed = 2; // Начальная скорость точек
    const dotImpulse = 20; // Импульс при переключении слайда
    const friction = 0.98; // Коэффициент трения (замедление)
    const minSpeed = 0.01; // Минимальная скорость для остановки
    const dotDensity = 0.7; // Плотность точек (0 - разрежено, 1 - плотно)

    let dots = []; // Массив для хранения данных о точках
    let draggingDot = null; // Индекс перетаскиваемой точки
    let lastMouseX = 0; // Последняя позиция мыши по X
    let lastMouseY = 0; // Последняя позиция мыши по Y

    // Thumbnail slider
    const thumbnailSliderContainer = $('.thumbnail-slider-container');
    const thumbnailSlider = $('.thumbnail-slider');
    let thumbnailWidth = 80; // Ширина превью
    let thumbnailMargin = 10; // Отступ между превью
    let thumbnailTotalWidth = thumbnailWidth + thumbnailMargin
        // Функция для создания точек
    function createDots() {
        for (let i = 0; i < dotCount; i++) {
            const dotElement = $('<div class="dot"></div>');
            animationContainer.append(dotElement);

            const availableWidth = animationWidth * dotDensity; // Доступная ширина для размещения точек
            const startX = (animationWidth - availableWidth) / 2; // Начальная позиция для центрирования

            const dot = {
                element: dotElement,
                x: startX + (availableWidth / dotCount) * i + (availableWidth / (2 * dotCount)) - (dotElement.width() / 2), // Равномерно по горизонтали, с учетом плотности
                y: animationHeight / 2 - (dotElement.height() / 2), // По центру по вертикали
                vx: 0, // Начальная скорость равна 0
                vy: 0 // Начальная скорость равна 0
            };
            dots.push(dot);
            dotElement.css({
                left: dot.x,
                top: dot.y
            });

            // Добавляем обработчики событий для перетаскивания
            dotElement.on('mousedown', function(e) {
                draggingDot = i;
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
            });
        }
        dots[0].element.addClass('active');
    }

    function createThumbnails() {
        for (let i = 0; i < imageCount; i++) {
            const imgSrc = images.eq(i).attr('src'); // Получаем путь к изображению из основного слайдера
            const img = $('<img src="' + imgSrc + '" alt="Thumbnail ' + (i + 1) + '">');
            thumbnailSlider.append(img);

            img.on('click', function() {
                applyImpulse(); // Добавляем импульс точкам
                goToSlide(i);
            });
        }

        updateThumbnailSliderPosition();
    }

    function updateThumbnailSliderPosition() {
        const thumbnailSliderWidth = imageCount * thumbnailTotalWidth;

        // Вычисляем смещение для центрирования слайдера
        const sliderOffset = thumbnailSliderContainer.width() / 2 - thumbnailTotalWidth / 2;
        const slideOffset = -currentIndex * thumbnailTotalWidth;

        thumbnailSlider.css('transform', `translateX(${sliderOffset + slideOffset}px)`);

        $(".thumbnail-slider img").removeClass("active");
        $(".thumbnail-slider img").eq(currentIndex).addClass("active");
    }

    // Функция для центрирования изображения
    function centerImage() {
        const imageWidth = images.eq(currentIndex).width();
        const containerWidth = slider.parent().width();
        const offset = (containerWidth - imageWidth) / 2;
        slider.css('transform', `translateX(${offset - (currentIndex * imageWidth)}px)`);
    }

    function goToSlide(index) {
        if (index >= 0 && index < imageCount && index != currentIndex) {
            currentIndex = index;
            centerImage();
            updateButtons();
            updateActiveDot();
            updateThumbnailSliderPosition();
        }
    }

    // Функция для обновления состояния кнопок
    function updateButtons() {
        prevButton.prop('disabled', currentIndex === 0);
        nextButton.prop('disabled', currentIndex === imageCount - 1);
    }

    // Функция для обновления активной точки
    function updateActiveDot() {
        dots.forEach(dot => dot.element.removeClass('active')); // Убираем подсветку у всех

        // Вычисляем индекс активной точки с учетом dotCount
        const activeDotIndex = currentIndex % dotCount;
        dots[activeDotIndex].element.addClass('active'); // Подсвечиваем текущую
    }

    // Функция для обновления позиции точек
    function updateDotPosition() {
        dots.forEach((dot, i) => {
            if (i !== draggingDot) { // Не двигаем перетаскиваемую точку автоматически
                // Обновляем скорость с учетом трения
                dot.vx *= friction;
                dot.vy *= friction;

                // Если скорость слишком маленькая, останавливаем точку
                if (Math.abs(dot.vx) < minSpeed) dot.vx = 0;
                if (Math.abs(dot.vy) < minSpeed) dot.vy = 0;

                // Обновляем позицию
                dot.x += dot.vx;
                dot.y += dot.vy;

                const dotWidth = dot.element.width();
                const dotHeight = dot.element.height();

                // Отскок от стенок
                if (dot.x < 0) {
                    dot.x = 0;
                    dot.vx = Math.abs(dot.vx) * friction; // Замедление при отскоке
                } else if (dot.x + dotWidth > animationWidth) {
                    dot.x = animationWidth - dotWidth;
                    dot.vx = -Math.abs(dot.vx) * friction; // Замедление при отскоке
                }

                if (dot.y < 0) {
                    dot.y = 0;
                    dot.vy = Math.abs(dot.vy) * friction; // Замедление при отскоке
                } else if (dot.y + dotHeight > animationHeight) {
                    dot.y = animationHeight - dotHeight;
                    dot.vy = -Math.abs(dot.vy) * friction; // Замедление при отскоке
                }

                // Применяем новую позицию
                dot.element.css({
                    left: dot.x,
                    top: dot.y
                });
            }
        });

        requestAnimationFrame(updateDotPosition); // Запускаем анимацию снова
    }

    // Функция для добавления импульса всем точкам
    function applyImpulse() {
        dots.forEach(dot => {
            const impulseX = (Math.random() - 0.5) * dotImpulse;
            const impulseY = (Math.random() - 0.5) * dotImpulse;

            dot.vx += impulseX;
            dot.vy += impulseY;

            // Ограничиваем скорость
            const speed = Math.sqrt(dot.vx * dot.vx + dot.vy * dot.vy);
            if (speed > dotSpeed) {
                dot.vx = dot.vx / speed * dotSpeed;
                dot.vy = dot.vy / speed * dotSpeed;
            }
        });
    }

    // Обработчики кнопок
    nextButton.on('click', function() {
        if (currentIndex < imageCount - 1) {
            applyImpulse(); // Добавляем импульс точкам
            goToSlide(currentIndex + 1)
            centerImage();
            updateButtons();
            updateActiveDot();
            updateThumbnailSliderPosition()
        }
    });

    prevButton.on('click', function() {
        if (currentIndex > 0) {
            applyImpulse(); // Добавляем импульс точкам
            goToSlide(currentIndex - 1)
            centerImage();
            updateButtons();
            updateActiveDot();
        }
    });

    // Обработчик движения мыши
    $(document).on('mousemove', function(e) {
        if (draggingDot !== null) {
            const deltaX = e.clientX - lastMouseX;
            const deltaY = e.clientY - lastMouseY;

            dots[draggingDot].vx = deltaX;
            dots[draggingDot].vy = deltaY;

            dots[draggingDot].x += deltaX;
            dots[draggingDot].y += deltaY;

            dots[draggingDot].element.css({
                left: dots[draggingDot].x,
                top: dots[draggingDot].y
            });

            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        }
    });

    // Обработчик отпускания кнопки мыши
    $(document).on('mouseup', function() {
        draggingDot = null;
    });

    // Первоначальное центрирование и при изменении размера окна
    centerImage();
    $(window).on('resize', function() {
        animationWidth = animationContainer.width();
        animationHeight = animationContainer.height();
        centerImage();
    });

    // Обработка загрузки изображения
    images.on('load', function() {
        centerImage();
        updateButtons();
    });

    // Инициализация слайдера и анимации
    createDots();
    createThumbnails()
    updateButtons();
    updateActiveDot();
    updateDotPosition(); // Запускаем анимацию
});