require "test_helper"

class HomepageControllerTest < ActionDispatch::IntegrationTest
  test "the homepage carries the verbatim omarchy copy" do
    get root_path
    assert_response :success
    assert_match "Beautiful, Fun &amp; Agentic Linux by", response.body
    assert_match "The malleable OS for the age of agents.", response.body
    assert_match "Omacom Foundation launches with $12.6 million", response.body
    assert_match "Looking to become a partner or patron of Omarchy?", response.body
    assert_match "Omarchy is a pending trademark", response.body
  end

  test "the homepage leads with the motto and the block wordmark" do
    get root_path
    assert_match "<strong>We can fix everything:</strong>", response.body
    assert_match "every missing app, every incompatibility, every paper cut.", response.body
    assert_match 'class="wordmark" data-intro="fall"', response.body
    assert_no_match(/wte-home/, response.body)
  end

  test "the homepage embeds the malleable data with seed and generated themes" do
    Theme.create!(
      name: "Neon Harbor '84", nod: "wet", description: "a harbor",
      palette: Theme::PALETTE_KEYS.index_with { "1, 2, 3" },
      requester_ip_digest: Theme.digest_ip("127.0.0.1")
    )
    get root_path
    data = JSON.parse(response.body[/<script type="application\/json" id="malleable-data">(.+?)<\/script>/m, 1])
    assert data["generated"].one?
    assert_equal "Neon Harbor '84", data["generated"].first["name"]
    assert_nil data["generated"].first["claim_token_digest"]
    assert_nil data["generated"].first["requester_ip_digest"]
    assert_equal false, data["submissions_closed"]
  end

  test "the embedded data says when submissions are closed" do
    Theme.stub(:cap_reached?, true) do
      get root_path
    end
    data = JSON.parse(response.body[/<script type="application\/json" id="malleable-data">(.+?)<\/script>/m, 1])
    assert_equal true, data["submissions_closed"]
  end

  test "a claimed theme is credited in the embedded data" do
    theme = Theme.create!(
      name: "Neon Harbor '84", nod: "wet", description: "a harbor",
      palette: Theme::PALETTE_KEYS.index_with { "1, 2, 3" },
      requester_ip_digest: Theme.digest_ip("127.0.0.1")
    )
    theme.claim!(name: "", github: "leemcalilly", x: "")
    get root_path
    data = JSON.parse(response.body[/<script type="application\/json" id="malleable-data">(.+?)<\/script>/m, 1])
    submitter = data["generated"].first["submitter"]
    assert_equal "@leemcalilly", submitter["label"]
    assert_equal "https://github.com/leemcalilly", submitter["url"]
  end
end
