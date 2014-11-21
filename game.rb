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
