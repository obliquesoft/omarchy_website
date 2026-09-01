require "test_helper"

class ThemeTest < ActiveSupport::TestCase
  def valid_attributes(overrides = {})
    {
      name: "Neon Harbor '84",
      nod: "a rainy neon harbor at 2am",
      description: "a rainy neon harbor at 2am, everything slightly wet",
      palette: Theme::PALETTE_KEYS.index_with { "12, 34, 56" },
      requester_ip_digest: Theme.digest_ip("203.0.113.9")
    }.merge(overrides)
  end

  test "valid theme saves" do
    assert Theme.new(valid_attributes).save
  end

  test "requires name, description, and palette" do
    assert_not Theme.new(valid_attributes(name: "")).valid?
    assert_not Theme.new(valid_attributes(description: "")).valid?
    assert_not Theme.new(valid_attributes(palette: nil)).valid?
  end

  test "rejects a palette missing keys" do
    palette = Theme::PALETTE_KEYS.index_with { "1, 2, 3" }.except("green")
    assert_not Theme.new(valid_attributes(palette: palette)).valid?
  end

  test "rejects a palette with extra keys" do
    palette = Theme::PALETTE_KEYS.index_with { "1, 2, 3" }.merge("evil" => "1, 2, 3")
    assert_not Theme.new(valid_attributes(palette: palette)).valid?
  end

  test "rejects palette values that are not rgb triplets" do
    [ "red", "1,2", "256, 0, 0", "-1, 0, 0", "1, 2, 3; }body{", "url(x)" ].each do |bad|
      palette = Theme::PALETTE_KEYS.index_with { "1, 2, 3" }.merge("green" => bad)
      assert_not Theme.new(valid_attributes(palette: palette)).valid?, "expected #{bad.inspect} to be rejected"
    end
  end

  test "normalizes triplet spacing" do
    palette = Theme::PALETTE_KEYS.index_with { " 1,2 ,  3 " }
    theme = Theme.create!(valid_attributes(palette: palette))
    assert_equal "1, 2, 3", theme.palette["green"]
  end

  test "caps name and nod length" do
    assert_not Theme.new(valid_attributes(name: "x" * 61)).valid?
    assert_not Theme.new(valid_attributes(nod: "x" * 121)).valid?
  end

  test "generates a claim token on create and stores only its digest" do
    theme = Theme.create!(valid_attributes)
    assert theme.claim_token.present?
    assert_not_equal theme.claim_token, theme.claim_token_digest
    assert_equal theme, Theme.find_claimable(theme.claim_token)
  end

  test "find_claimable returns nothing for wrong or blank tokens" do
    Theme.create!(valid_attributes)
    assert_nil Theme.find_claimable("wrong")
    assert_nil Theme.find_claimable("")
    assert_nil Theme.find_claimable(nil)
  end

  test "claimed themes are not claimable again" do
    theme = Theme.create!(valid_attributes)
    token = theme.claim_token
    theme.claim!(name: "Lee", github: "leemcalilly", x: "")
    assert_nil Theme.find_claimable(token)
  end

  test "claim! strips at-signs and rejects oversized handles" do
    theme = Theme.create!(valid_attributes)
    theme.claim!(name: "", github: "@leemcalilly", x: "")
    assert_equal "leemcalilly", theme.submitter_github
    other = Theme.create!(valid_attributes)
    assert_raises(ActiveRecord::RecordInvalid) { other.claim!(name: "", github: "x" * 60, x: "") }
  end

  test "cap_reached? trips at the generation cap" do
    assert_not Theme.cap_reached?
    stub_const_cap(2) do
      Theme.create!(valid_attributes)
      assert_not Theme.cap_reached?
      Theme.create!(valid_attributes)
      assert Theme.cap_reached?
    end
  end

  test "ip_throttled? counts recent themes from one ip only" do
    digest = Theme.digest_ip("203.0.113.9")
    other = Theme.digest_ip("198.51.100.7")
    Theme::IP_HOURLY_LIMIT.times { Theme.create!(valid_attributes) }
    assert Theme.ip_throttled?(digest)
    assert_not Theme.ip_throttled?(other)
  end

  test "old themes do not count toward the ip throttle" do
    digest = Theme.digest_ip("203.0.113.9")
    Theme::IP_HOURLY_LIMIT.times do
      Theme.create!(valid_attributes).update_column(:created_at, 2.hours.ago)
    end
    assert_not Theme.ip_throttled?(digest)
  end

  private

  def stub_const_cap(value)
    original = Theme::GENERATION_CAP
    Theme.send(:remove_const, :GENERATION_CAP)
    Theme.const_set(:GENERATION_CAP, value)
    yield
  ensure
    Theme.send(:remove_const, :GENERATION_CAP)
    Theme.const_set(:GENERATION_CAP, original)
  end
end
