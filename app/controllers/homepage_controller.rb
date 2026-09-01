class HomepageController < ApplicationController
  layout false

  def show
    @malleable_data = {
      "generated" => Theme.order(:created_at).map(&:as_public_json),
      "submissions_closed" => Theme.cap_reached?
    }
  end
end
