Rails.application.routes.draw do
  root to: "static_pages#root"

  namespace :api, defaults: { format: :json } do
    resources :users, only: [:create]
    resource :session, only: [:create, :destroy]
    resources :playlists, only: [:index, :create, :update, :destroy, :show] do
      resources :songs, only: [:index]
    end
    
    resources :songs, only: [:index]
    resources :playlist_songs, only: [:create]

    resources :albums, only: [:index, :show] do
      resources :songs, only: [:index]
    end

    resources :artists, only: [:index, :show] do
      resources :songs, only: [:index]
      resources :albums, only: [:index]
    end

    resources :search, only: [:index]
  end
end
