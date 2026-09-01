require "test_helper"

class ThemesControllerTest < ActionDispatch::IntegrationTest
  def generated_attributes
    {
      name: "Neon Harbor '84",
      nod: "everything slightly wet",
      palette: Theme::PALETTE_KEYS.index_with { "10, 20, 30" }
    }
  end

  test "creating a theme returns it with a claim token" do
    ThemeGenerator.stub(:generate, ->(_d) { generated_attributes }) do
      post themes_path, params: { description: "a rainy neon harbor at 2am" }, as: :json
    end
    assert_response :created
    body = JSON.parse(response.body)
    assert_equal "Neon Harbor '84", body["theme"]["name"]
    assert body["claim_token"].present?
    assert_equal 1, Theme.count
    assert_nil body["theme"]["palette"]["evil"]
  end

  test "blank or oversized descriptions are rejected without calling the model" do
    called = false
    ThemeGenerator.stub(:generate, ->(_d) { called = true; generated_attributes }) do
      post themes_path, params: { description: "" }, as: :json
      assert_response :unprocessable_entity
      post themes_path, params: { description: "x" * 500 }, as: :json
      assert_response :unprocessable_entity
    end
    assert_not called
    assert_equal 0, Theme.count
  end

  test "the global cap closes submissions politely" do
    Theme.stub(:cap_reached?, true) do
      post themes_path, params: { description: "anything nice" }, as: :json
    end
    assert_response :service_unavailable
    assert_match(/cap/i, JSON.parse(response.body)["error"])
  end

  test "a throttled ip is refused" do
    Theme.stub(:ip_throttled?, ->(_digest) { true }) do
      post themes_path, params: { description: "anything nice" }, as: :json
    end
    assert_response :too_many_requests
  end

  test "a generation failure returns a friendly error" do
    ThemeGenerator.stub(:generate, ->(_d) { raise ThemeGenerator::GenerationFailed }) do
      post themes_path, params: { description: "a fine idea" }, as: :json
    end
    assert_response :unprocessable_entity
    assert_equal 0, Theme.count
  end

  test "claiming with the token sets the submitter once" do
    theme = create_theme
    patch claim_theme_path(theme), params: { claim_token: theme.claim_token, github: "@leemcalilly" }, as: :json
    assert_response :ok
    assert_equal "leemcalilly", theme.reload.submitter_github

    patch claim_theme_path(theme), params: { claim_token: theme.claim_token, github: "someone_else" }, as: :json
    assert_response :not_found
    assert_equal "leemcalilly", theme.reload.submitter_github
  end

  test "claiming with a wrong token finds nothing" do
    theme = create_theme
    patch claim_theme_path(theme), params: { claim_token: "wrong", github: "x" }, as: :json
    assert_response :not_found
    assert_nil theme.reload.submitter_github
  end

  private

  def create_theme
    Theme.create!(
      name: "Neon Harbor '84", nod: "wet", description: "a harbor",
      palette: Theme::PALETTE_KEYS.index_with { "1, 2, 3" },
      requester_ip_digest: Theme.digest_ip("127.0.0.1")
    )
  end
end
