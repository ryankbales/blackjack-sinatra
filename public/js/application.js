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
                  $(".player_score span").replaceWith(data.new_value);
                  $(".player_hand").html(data.new_hand);
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
                  $("#status span").replaceWith(data.stay_message);
                  $(".alert.alert-success").fadeIn();
                  $("#player-hit, #player-stay").fadeOut();
                }
    });
  });
}