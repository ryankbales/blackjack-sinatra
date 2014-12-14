$(document).ready(function(){
  player_stays();
});

function player_hits() {
  $("#player-hit").on("click", function() {
    $.ajax({
      async:false,
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
                    $(".alert.alert-success span").replaceWith("You have Blackjack, you win!");
                    $(".alert.alert-success").fadeIn();
                    $("#player-hit, #player-stay").fadeOut(200);
                    $("#play-again").fadeIn(3000);
                    calc_bet("win");
                } else if (data.new_value > 21) {
                    $(".player_score span").text(data.new_value);
                    $(".player_hand").html(data.new_hand);
                    $(".alert.alert-danger span").replaceWith("You have busted. You loose.");
                    $(".alert.alert-danger").fadeIn();
                    $("#player-hit, #player-stay").fadeOut(200);
                    $("#play-again").fadeIn(3000);
                    calc_bet("lose");
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

function player_bet() {
  var bet_amount = 0;
  var bet = prompt("Enter an amount to bet", 0);
  if (bet && typeof parseInt(bet) == "number") {
    bet = parseInt(bet);
  } else {
    var bet = prompt("Please enter a number to bet.", 0);
  }
  $.ajax({
    async: false,
    url: '/play/player_bet',
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify({bet: bet}),
    success: function(json) {
      data = json;
      bet_amount = data.bet.bet;
      $("#current-bet span#bet-amount").text(bet_amount);
    }
  });
  return bet_amount;
}

function calc_bet(result) {
  bet = $("span#bet-amount").text();
  bank = $("span#bank-amount").text();
  bet_val = parseInt(bet);
  bank_val = parseInt(bank);
  var new_value = 0;
  if (result == 'win') {
    new_value = bank_val + bet_val;
    $("span#bank-amount").text(new_value);

  } else if (result == 'lose') {
      new_value = bank_val - bet_val;
      $("span#bank-amount").text(new_value);
  } else {
    return;
  }
  $.ajax({
    async: false,
    url: '/play/update_bank',
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify({new_value: new_value}),
    success: function(json) {
      alert("You are in the success function");
    }
  });
}

function dealer_turn() {
  var hand = {};
  var hit = {};
  $.ajax({
      async: false,
      type: "POST",
      dataType: "json", 
      url: '/play/dealer_play',
      success: function(response){
                  var data = response;
                  $(".dealer_score span").html(data.value);
                  $(".dealer_hand").html(data.hand);
                  hand = data;
               }
  });
  var hit_return = 0;
  if (hand.value < 17) {
      $.ajax ({
          async: false,
          type: "POST",
          dataType: "json",
          url: "/play/dealer_play/dealer_hit",
          success: function(response) {
            var data = response;
            hand = {
              value: data.hit_value,
              new_hand: data.hand
            };
            $(".dealer_score span").html(hand.hit_value);
            $(".dealer_hand").html(hand.new_hand);
          }
      });
    }
    var hit_return = hand.value;
    
    while (hit_return < 17) {
      $.ajax ({
          async: false,
          type: "POST",
          dataType: "json",
          url: "/play/dealer_play/dealer_hit",
          success: function(response) {
            var data = response;
            hand = {
              hit_value: data.hit_value,
              new_hand: data.hand
            };
            $(".dealer_score span").html(hand.hit_value);
            $(".dealer_hand").html(hand.new_hand);
          }
      });
      hit_return = hand.hit_value;
    }
    if (hit_return > 21){
      $(".dealer_score span").html(hit_return);
      $(".dealer_hand").html(hand.new_hand);
      $(".alert.alert-danger span").replaceWith("Dealer Busts! You Win!");
      $(".alert.alert-danger").fadeIn();
      $(".alert.alert-success").css('display', 'none');
      $("#play-again").fadeIn(2000);
      calc_bet("win");
    } else if (hit_return < 21 && hit_return >= 17) {
        $.ajax ({
          async: false,
          type: "POST",
          dataType: "json",
          url: "/play/final_check",
          success: function (response) {
            var data = response
            $(".dealer_score span").html(hit_return);
            $(".dealer_hand").html(hand.new_hand);
            $(".alert.alert-success span").replaceWith(data.message).fadeIn();
            $(".alert.alert-success").fadeIn();
            $("#play-again").fadeIn(2000);
            calc_bet(data.result);
          }
        });
    } else if (hit_return == 21) {
        $(".dealer_score span").html(hit_return);
        $(".dealer_hand").html(hand.new_hand);
        $(".alert.alert-success span").replaceWith("Dealer hit Blackjack, you lose.").fadeIn();
        $(".alert.alert-success").fadeIn();
        $("#play-again").fadeIn(2000);
        calc_bet("lose");
    }
}