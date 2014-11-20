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
      
    end

    get '/' do
      @page_title = 'Blackjack!'
      erb :index,
        :layout => :full_width,
        :layout_options => {:views => settings.layouts_dir}
    end

    get '/play' do
      erb :play, :layout => :full_width, :layout_options => {:views => settings.layouts_dir}
    end

    post '/new_player' do
      session[:player_name] = params[:player_name]
      redirect '/play'
    end

    # Catch-all for /something/else/etc/ pages which just display templates.
    # get %r{/([\w\/-]+)/$} do |path|
    #   pages = {
    #     'help' => {
    #       :page_name => 'help',
    #       :title => 'Help',
    #     },
    #     'help/accounts' => {
    #       :page_name => 'help_accounts',
    #       :title => 'Accounts Help',
    #     },
    #     # etc
    #   }
    #   if pages.has_key?(path)
    #     @page_name = pages[path][:page_name]
    #     @page_title = pages[path][:title]
    #     layout = :with_sidebar
    #     if pages[path].has_key?(:layout)
    #       layout = pages[path][:layout].to_sym
    #     end
    #     erb @page_name.to_sym,
    #       :layout => layout,
    #       :layout_options => {:views => settings.layouts_dir}
    #   else
    #     show_404
    #   end
    # end

  end
end
