$(document).ready(function(){
  $(".headMenuSearchBtn").click(function(){
    $(".searchForm").toggleClass("searchVisible");
  });
  $(".hideBTN").click(function(){
    $(".searchForm").toggleClass("searchVisible");
  });
});

$(document).ready(function() {
    $('.menuItemsBox').fadeOut("fast");
  // При наведении на любой из блоков .hUser, .hFavorite, .hCart
  $(".hUser, .hFavorite, .hCart").hover(
    function() {
      // Получаем класс блока, на который наведен курсор
      var className = $(this).attr("class");

      // Показываем блок с ID, соответствующим классу, плавно
      $("#" + className).fadeIn("fast");
    },
    function() {
      // Получаем класс блока, с которого ушел курсор
      var className = $(this).attr("class");

      // Скрываем блок с ID, соответствующим классу, плавно, только если курсор *не* находится на нем
      if (!$("#" + className + ":hover").length) {
        $("#" + className).fadeOut("fast");
      }
    }
  );

  // Добавляем обработку события mouseenter/mouseleave непосредственно на отображаемые блоки
  $(".hUser, .hFavorite, .hCart").each(function() {
    var className = $(this).attr("class");
    $("#" + className).hover(
      function() {
        // Курсор вошел на блок, ничего не делаем (оставляем его видимым)
      },
      function() {
        // Курсор покинул блок, скрываем его только если мышь больше не на блоке, который его вызвал
        if (!$("." + className + ":hover").length) {
          $("#" + className).fadeOut("fast");
        }
      }
    );
  });
});