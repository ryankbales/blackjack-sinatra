require "sinatra/base"
require "sinatra/reloader"
require "pry"

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
          show_hand << "<li id='#{card[0]}-#{card[1]}'> #{card[0]} of #{card[1]} </li>"
        end
        return show_hand
      end

      def show_one_card(hand)
        face_up = hand[0]
        face_down = hand[1]
        "<li id='#{face_up[0]}-#{face_up[1]}'> #{face_up[0]} of #{face_up[1]} </li><li class='face-down' id='#{face_down[0]}-#{face_down[1]}''> #{face_down[0]} of #{face_down[1]} </li>"
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

      def hit_or_stay?
        puts "(H)it or (S)tay?"
        response = gets.chomp.downcase
        if response == "h"
          return true
        elsif response == "s"
          return false
        else
          puts "Please enter 'h' or 's'"
          hit_or_stay?
        end
      end
    end

    get '/' do
      @page_title = 'Blackjack!'
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

      erb :play, :layout => :full_width, :layout_options => {:views => settings.layouts_dir}
    end

    post '/new_player' do
      session[:player_name] = params[:player_name]
      redirect '/play'
    end
  end
end
