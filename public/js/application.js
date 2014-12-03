$(document).ready(function(){
  player_hits();
  player_stays();
  // dealer_hit();
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
                }
    });
  });
}