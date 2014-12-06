require "sinatra/base"
require "sinatra/reloader"
require "json"
require "pry"
CARD_VALUES = {two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, jack: 10, queen: 10, king: 10, ace: 11}
module Game
  class Blackjack < Sinatra::Base
    use Rack::Session::Cookie, :key => 'rack.session',
                           :path => '/',
                           :secret => 'dfklsie34lrlt'

    configure :development do
      register Sinatra::Reloader
    end

    configure do
      set :layouts_dir, 'views/_layouts'
      set :partials_dir, 'views/_partials'
    end

    helpers do
      def deal_two_cards_each(deck, player, dealer)
        2.times do |card|
         player << deck.shift
         dealer << deck.shift
        end
      end

      def deal_player_one_card(deck, player)
        player << deck.shift
      end

      def get_hand_value(player, values)
        player_card_values = []
        player.each do |card|
          values.each do |k, v|
            if card[0] == k.to_s
              player_card_values << v
            end
          end
        end
        hand_value = 0
        player_card_values.each do |value|
          hand_value += value
        end
        return hand_value
      end

      def blackjack?(hand_value)
        if hand_value == 21
          return true
        else
          return false
        end
      end

      def bust?(hand_value)
        if hand_value > 21
          return true
        else
          return false
        end
      end

      def show_hand(hand)
        show_hand = ""
        hand.each do |card|
          show_hand << "<li class='#{card[1]} #{card[0]}'> #{card[0]} of #{card[1]} </li>"
        end
        return show_hand
      end

      def show_one_card(hand)
        face_up = hand[0]
        face_down = hand[1]
        "<li class='#{face_up[1]} #{face_up[0]}'> #{face_up[0]} of #{face_up[1]} </li><li id='face-down' class='#{face_down[1]} #{face_down[0]}'> #{face_down[0]} of #{face_down[1]} </li>"
      end

      def check_hand(hand_value, result)
        if blackjack?(hand_value)
          result = 'blackjack'
        elsif bust?(hand_value)
          result = 'bust'
        else
          result = false
        end
        return result
      end

      def lucky_draw(player_hand, player_hand_value)
        if (player_hand.count == 2) && (player_hand_value == 21)
          return true
        else
          return false
        end
      end
    end

    get '/' do
      erb :index,
        :layout => :full_width,
        :layout_options => {:views => settings.layouts_dir}
    end

    get '/play' do
      #create deck
      card_face = ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"]
      card_suits = ["hearts", "diamonds", "clubs", "spades"]
      session[:deck] = card_face.product(card_suits).shuffle!
      session[:player_cards] = []
      session[:dealer_cards] = []
      #deal cards
      deal_two_cards_each(session[:deck], session[:player_cards], session[:dealer_cards])

      #initial value check
      session[:player_hand_value] = get_hand_value(session[:player_cards], CARD_VALUES)
      session[:dealer_hand_value] = get_hand_value(session[:dealer_cards], CARD_VALUES)
      erb :play, :layout => :full_width, :layout_options => {:views => settings.layouts_dir}
    end

    post '/new_player' do
      session[:player_name] = params[:player_name]
      redirect '/play'
    end

    post '/play/player_stay' do
      player_stay = {stay_message: "<span>You have decided to stay with #{get_hand_value(session[:player_cards], CARD_VALUES)}. Dealer will now play.</span>"}
      player_stay.to_json
    end

    post '/play/player_hit' do
      session[:player_cards] = deal_player_one_card(session[:deck], session[:player_cards])
      session[:player_hand_value] = get_hand_value(session[:player_cards], CARD_VALUES)
      new_hand = show_hand(session[:player_cards])
      new_value = session[:player_hand_value]
      player_hit = {new_hand: new_hand, new_value: new_value }
      player_hit.to_json
    end

    post '/play/dealer_play' do
      dealers_hand = show_hand(session[:dealer_cards])
      value = session[:dealer_hand_value] = get_hand_value(session[:dealer_cards], CARD_VALUES)
      new_value = "<h3 class='dealer_score'>Dealer has <span>#{value}</span></h3>"
      dealers_hand = {dealers_hand: dealers_hand, new_value: new_value};
      dealers_hand.to_json
      # dealer_plays(dealers_hand, hand_value, deck, values=CARD_VALUES)
    end

  end
end
