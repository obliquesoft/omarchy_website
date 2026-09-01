# Asks Claude to turn one sentence into a theme: a name, a nod line, and
# eight RGB triplets for the page's custom properties. The model's output is
# treated as untrusted: we parse the JSON out of whatever prose surrounds it,
# validate every triplet against the Theme rules, and clamp text lengths.
# Nothing the model writes ever reaches a stylesheet as raw CSS.
class ThemeGenerator
  class GenerationFailed < StandardError; end

  MODEL = "claude-opus-5".freeze

  SYSTEM_PROMPT = <<~PROMPT.freeze
    You design color themes for the omarchy.org homepage. Given one sentence
    describing a mood or a scene, answer with ONLY a JSON object, no prose:

    {
      "name": "a short evocative theme name, 1980s flavored when it fits",
      "nod": "one short lowercase nod line in the spirit of the description",
      "palette": {
        "background-night": "R, G, B",   // page background
        "background-storm": "R, G, B",   // panels, slightly lighter or darker
        "terminal-black": "R, G, B",     // borders
        "terminal-blue": "R, G, B",      // body text and buttons
        "terminal-cyan": "R, G, B",      // links
        "terminal-white": "R, G, B",     // secondary text
        "green": "R, G, B",              // the ASCII logo
        "turquoise": "R, G, B"           // hover accents
      }
    }

    Every value is exactly three integers 0-255 separated by commas. Body
    text (terminal-blue) must be readable on background-night. Be bold: the
    palette should feel unmistakably like the sentence.
  PROMPT

  def self.generate(description)
    new.call(description)
  end

  def initialize(client: nil)
    @client = client
  end

  def call(description)
    text = request_text(description)
    data = extract_json(text)
    palette = validate_palette(data["palette"])

    {
      name: data["name"].to_s.strip.first(60).presence || "Untitled '8#{rand(10)}",
      nod: data["nod"].to_s.strip.first(120),
      palette: palette
    }
  end

  private

  def client
    raise GenerationFailed, "no ANTHROPIC_API_KEY configured" if @client.nil? && ENV["ANTHROPIC_API_KEY"].blank?

    @client ||= Anthropic::Client.new
  end

  def request_text(description)
    message = client.messages.create(
      model: MODEL,
      max_tokens: 1024,
      system_: SYSTEM_PROMPT,
      messages: [ { role: "user", content: description.to_s.first(300) } ]
    )
    message.content.filter_map { |block| block.text if block.type == :text }.join
  rescue Anthropic::Errors::APIError => error
    raise GenerationFailed, error.message
  end

  def extract_json(text)
    json = text[/\{.*\}/m] or raise GenerationFailed, "no json in model output"
    JSON.parse(json)
  rescue JSON::ParserError
    raise GenerationFailed, "unparseable model output"
  end

  def validate_palette(palette)
    probe = Theme.new(name: "probe", description: "probe", palette: palette)
    probe.valid?
    raise GenerationFailed, "invalid palette" if probe.errors[:palette].any?

    probe.palette
  end
end
