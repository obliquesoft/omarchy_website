Rails.application.routes.draw do
  root "homepage#show"

  resources :themes, only: :create do
    member do
      patch :claim
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
