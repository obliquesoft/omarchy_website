# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_09_01_190114) do
  create_table "themes", force: :cascade do |t|
    t.string "claim_token_digest"
    t.datetime "created_at", null: false
    t.string "description", null: false
    t.string "name", null: false
    t.string "nod"
    t.json "palette", null: false
    t.string "requester_ip_digest"
    t.string "submitter_github"
    t.string "submitter_name"
    t.string "submitter_x"
    t.datetime "updated_at", null: false
    t.index ["claim_token_digest"], name: "index_themes_on_claim_token_digest", unique: true
    t.index ["requester_ip_digest", "created_at"], name: "index_themes_on_requester_ip_digest_and_created_at"
  end
end
