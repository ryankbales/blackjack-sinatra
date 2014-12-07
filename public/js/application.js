$(document).ready(function(){
  player_hits();
  player_stays();
});

function player_hits() {
  $("#player-hit").on("click", function() {
    $.ajax({
      type: "POST",
      dataType: "json", 
      url: '/play/player_hit',
      success: function(response){
                var data = response;
                if (data.new_value < 21) {
                  $(".player_score span").text(data.new_value);
                  $(".player_hand").html(data.new_hand);
                } else if (data.new_value == 21) {
                    $(".player_score span").text(data.new_value);
                    $(".player_hand").html(data.new_hand);
                    $(".alert.alert-success span").replaceWith("You have Blackjack, you win!").fadeIn();
                    $(".alert.alert-success").fadeIn();
                    $("#player-hit, #player-stay").fadeOut(200);
                    $("#play-again").fadeIn(3000);
                } else if (data.new_value > 21) {
                    $(".player_score span").text(data.new_value);
                    $(".player_hand").html(data.new_hand);
                    $(".alert.alert-danger span").replaceWith("You have busted. You loose.").fadeIn();
                    $(".alert.alert-danger").fadeIn();
                    $("#player-hit, #player-stay").fadeOut(200);
                    $("#play-again").fadeIn(3000);
                }
              }
    });
  });
}

function player_stays() {
  $("#player-stay").on("click", function() {
    $.ajax({
      type: "POST",
      dataType: "json", 
      url: '/play/player_stay',
      success: function(response){
                  var data = response;
                  $(".alert.alert-success span").replaceWith(data.stay_message);
                  $(".alert.alert-success").fadeIn();
                  $("#player-hit, #player-stay").fadeOut(200);
                  dealer_turn();
                }
    });
  });
}

function dealer_turn() {
  var init_hand = {};
  var hit = {};
  $.ajax({
      async: false,
      type: "POST",
      dataType: "json", 
      url: '/play/dealer_play',
      success: function(response){
                  var data = response;
                  alert("In dealer_turn!");
                  $(".dealer_score span").html(data.new_value);
                  $(".dealer_hand").html(data.hand);
                  init_hand = data;
               }
  });
  if (init_hand.new_value < 17) {
      $.ajax ({
          async: false,
          type: "POST",
          dataType: "json",
          url: "/play/dealer_play/dealer_hit",
          error: function(response) {
            alert(response);
          },
          success: function(response) {
            var data = response;
            alert("In second request!");
            hit = {
              hit_value: data.hit_value,
              new_hand: data.hand
            };
            $(".dealer_score span").html(hit.hit_value);
            $(".dealer_hand").html(hit.new_hand);
          }
      });
    }
    var hit_return = hit.hit_value;
    while (hit_return < 17) {
      $.ajax ({
          async: false,
          type: "POST",
          dataType: "json",
          url: "/play/dealer_play/dealer_hit",
          error: function(response) {
            alert(response);
          },
          success: function(response) {
            var data = response;
            alert("In ")
            hit = {
              hit_value: data.hit_value,
              new_hand: data.hand
            };
          }
      });
      hit_return = hit.hit_value;
      $(".dealer_score span").html(hit_return);
      $(".dealer_hand").html(hit.new_hand);
  }
}