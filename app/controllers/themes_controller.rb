class ThemesController < ApplicationController
  def create
    description = params[:description].to_s.strip
    return render_error(:unprocessable_entity, "it only takes a sentence") if description.blank? || description.length > 300
    return render_error(:service_unavailable, "the generation cap is reached — the seed themes are still all yours") if Theme.cap_reached?

    ip_digest = Theme.digest_ip(request.remote_ip)
    return render_error(:too_many_requests, "easy, omarch — try again in a bit") if Theme.ip_throttled?(ip_digest)

    attributes = ThemeGenerator.generate(description)
    theme = Theme.create!(attributes.merge(description: description, requester_ip_digest: ip_digest))
    render json: { theme: theme.as_public_json, claim_token: theme.claim_token }, status: :created
  rescue ThemeGenerator::GenerationFailed, ActiveRecord::RecordInvalid
    render_error(:unprocessable_entity, "that one did not take — try another sentence")
  end

  def claim
    theme = Theme.find_claimable(params[:claim_token])
    return head :not_found if theme.nil? || theme.id != params[:id].to_i

    theme.claim!(
      name: params[:name].to_s,
      github: params[:github].to_s,
      x: params[:x].to_s
    )
    render json: { theme: theme.as_public_json }
  rescue ActiveRecord::RecordInvalid
    render_error(:unprocessable_entity, "those handles look too long to be real")
  end

  private

  def render_error(status, message)
    render json: { error: message }, status: status
  end
end
