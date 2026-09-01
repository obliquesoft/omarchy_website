require "test_helper"

class ThemeGeneratorTest < ActiveSupport::TestCase
  FakeBlock = Struct.new(:type, :text)
  FakeMessage = Struct.new(:content, :stop_reason)

  class FakeClient
    def initialize(response_text)
      @response_text = response_text
    end

    def messages
      self
    end

    def create(**)
      FakeMessage.new([ FakeBlock.new(:text, @response_text) ], :end_turn)
    end
  end

  def good_json
    {
      name: "Neon Harbor '84",
      nod: "everything slightly wet",
      palette: Theme::PALETTE_KEYS.index_with { "10, 20, 30" }
    }.to_json
  end

  test "returns validated attributes from the model's json" do
    result = ThemeGenerator.new(client: FakeClient.new(good_json)).call("a rainy neon harbor")
    assert_equal "Neon Harbor '84", result[:name]
    assert_equal "everything slightly wet", result[:nod]
    assert_equal "10, 20, 30", result[:palette]["green"]
  end

  test "survives json wrapped in prose or fences" do
    wrapped = "Here you go:\n```json\n#{good_json}\n```"
    result = ThemeGenerator.new(client: FakeClient.new(wrapped)).call("anything")
    assert_equal "Neon Harbor '84", result[:name]
  end

  test "raises on unparseable output" do
    assert_raises(ThemeGenerator::GenerationFailed) do
      ThemeGenerator.new(client: FakeClient.new("no json here")).call("anything")
    end
  end

  test "raises when the palette is malformed" do
    bad = { name: "X", nod: "y", palette: { "green" => "expression(alert(1))" } }.to_json
    assert_raises(ThemeGenerator::GenerationFailed) do
      ThemeGenerator.new(client: FakeClient.new(bad)).call("anything")
    end
  end

  test "truncates oversized name and nod instead of failing" do
    long = { name: "N" * 200, nod: "d" * 300,
             palette: Theme::PALETTE_KEYS.index_with { "1, 2, 3" } }.to_json
    result = ThemeGenerator.new(client: FakeClient.new(long)).call("anything")
    assert result[:name].length <= 60
    assert result[:nod].length <= 120
  end
end
