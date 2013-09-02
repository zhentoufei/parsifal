$(function () {

  $(".btn-import-bibtex").click(function () {
    var container = $(this).closest(".articles");
    $("input[type=file]", container).click();
  });

  $.fn.loadArticles = function () {
    var div = $(this);
    $.ajax({
      url: '/reviews/conducting/source_articles/',
      data: { 'review-id': $("#review-id").val(), 'source-id': $("input[name='source-id']", div).val() },
      type: 'get',
      cache: false,
      beforeSend: function () {
        $(".source-articles", div).html("<p>Loading data...</p>");
      },
      success: function (data) {
        $(".source-articles", div).html(data);
      }
    });
  };

  $("ul#source-tab li:eq(0)").addClass("active");

  var div = $("div.source-tab-content div.articles:eq(0)");
  $(div).show();
  $(div).loadArticles();

  $(".btn-suggested-search-string").click(function () {
    var form = $(this).closest("form");
    $.ajax({
      url: '/reviews/conducting/generate_search_string/',
      data: { 'review-id': $("#review-id").val() },
      cache: false,
      type: 'get',
      success: function (data) {
        $(".search-string", form).val(data);
      }
    });
  });

  $(".btn-save-generic-search-string").click(function () {
    var btn = $(this);
    var form = $(this).closest("form");
    var search_string = $(".search-string", form).val();
    $.ajax({
      url: '/reviews/conducting/save_generic_search_string/',
      data: $(form).serialize(),
      cache: false,
      type: 'post',
      success: function (data) {
        var msg = btn.siblings('.form-status-message');
        msg.removeClass("text-error").addClass("text-success");
        msg.text('Your search string have been saved successfully!');
        msg.fadeIn();
        window.setTimeout(function () {
          msg.fadeOut();
        }, 2000);
      },
      error: function () {
        var msg = btn.siblings('.form-status-message');
        msg.removeClass("text-success").addClass("text-error");
        msg.text('Something went wrong! Please contact the administrator.');
        msg.fadeIn();
        window.setTimeout(function () {
          msg.fadeOut();
        }, 2000);
      }
    });
  });

  $("#source-tab a").click(function () {
    var tab_id = $(this).attr("href");
    $("div.source-tab-content div.articles").hide();
    $("ul#source-tab li").removeClass("active");
    $(this).closest("li").addClass("active");
    $(tab_id).show();
    $(tab_id).loadArticles();
    return false;
  });

  $("input[name='bibtex']").change(function () {
    var form = $(this).closest("form");
    $(form).submit();
  });

  $(".source-articles").on("click", "tr", function () {
    $(".source-articles tbody tr").removeClass("active");
    $(this).addClass("active");
    $("#modal-article").open();
  });

  $("body").keyup(function (event) {
    if (event.which == 27 && $("body").hasClass("modal-open")) {
      $(".modal").close();
    }
  });

  function move(step) {
    var active = $(".source-articles tbody tr.active").index();
    var size = $(".source-articles tbody tr").size();
    active = (active + step) % size;
    $(".source-articles tbody tr").removeClass("active");
    $(".source-articles tbody tr:eq("+active+")").addClass("active");
  }

  $("#btn-previous").click(function () {
    move(-1);
  });

  $("#btn-next").click(function () {
    move(1);
  });

});