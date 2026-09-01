# A community-generated theme: a name, a nod line, and eight validated RGB
# triplets. Seed themes are static code in the front end; only generated
# themes live here. The palette is the only styling a theme carries — raw
# CSS or markup never enters the database.
class Theme < ApplicationRecord
  PALETTE_KEYS = %w[
    background-night background-storm terminal-black terminal-blue
    terminal-cyan terminal-white green turquoise
  ].freeze

  TRIPLET = /\A(\d{1,3}), (\d{1,3}), (\d{1,3})\z/
  GENERATION_CAP = 100
  IP_HOURLY_LIMIT = 3

  attr_reader :claim_token

  before_validation :normalize_palette
  before_create :issue_claim_token

  validates :name, presence: true, length: { maximum: 60 }
  validates :nod, length: { maximum: 120 }
  validates :description, presence: true, length: { maximum: 300 }
  validates :submitter_name, :submitter_github, :submitter_x, length: { maximum: 50 }
  validate :palette_is_exactly_the_expected_triplets

  def self.digest_ip(ip)
    Digest::SHA256.hexdigest("theme-ip:#{ip}")
  end

  def self.cap_reached?
    count >= GENERATION_CAP
  end

  def self.ip_throttled?(ip_digest)
    where(requester_ip_digest: ip_digest).where(created_at: 1.hour.ago..).count >= IP_HOURLY_LIMIT
  end

  def self.find_claimable(token)
    return nil if token.blank?

    find_by(claim_token_digest: Digest::SHA256.hexdigest(token),
            submitter_name: nil, submitter_github: nil, submitter_x: nil)
  end

  def claim!(name:, github:, x:)
    update!(
      submitter_name: name.to_s.strip.presence,
      submitter_github: strip_handle(github),
      submitter_x: strip_handle(x)
    )
  end

  def claimed?
    submitter_name.present? || submitter_github.present? || submitter_x.present?
  end

  # What the page embeds and the submit endpoint returns — public fields only.
  def as_public_json
    { "id" => id, "name" => name, "nod" => nod, "palette" => palette,
      "submitter" => public_submitter }
  end

  private

  def public_submitter
    if submitter_github.present?
      { "label" => "@#{submitter_github}", "url" => "https://github.com/#{submitter_github}" }
    elsif submitter_x.present?
      { "label" => "@#{submitter_x}", "url" => "https://x.com/#{submitter_x}" }
    elsif submitter_name.present?
      { "label" => submitter_name, "url" => nil }
    end
  end

  def strip_handle(handle)
    handle.to_s.strip.delete_prefix("@").presence
  end

  def issue_claim_token
    @claim_token = SecureRandom.base58(28)
    self.claim_token_digest = Digest::SHA256.hexdigest(@claim_token)
  end

  def normalize_palette
    return unless palette.is_a?(Hash)

    self.palette = palette.transform_values { |value| value.to_s.split(",").map(&:strip).join(", ") }
  end

  def palette_is_exactly_the_expected_triplets
    unless palette.is_a?(Hash) && palette.keys.sort == PALETTE_KEYS.sort
      errors.add(:palette, "must contain exactly the expected color keys")
      return
    end

    palette.each_value do |value|
      match = TRIPLET.match(value.to_s)
      unless match && match.captures.all? { |part| part.to_i <= 255 }
        errors.add(:palette, "values must be rgb triplets between 0 and 255")
        break
      end
    end
  end
end
