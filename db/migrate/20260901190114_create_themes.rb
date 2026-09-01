class CreateThemes < ActiveRecord::Migration[8.1]
  def change
    create_table :themes do |t|
      t.string :name, null: false
      t.string :nod
      t.string :description, null: false
      t.json :palette, null: false
      t.string :submitter_name
      t.string :submitter_github
      t.string :submitter_x
      t.string :claim_token_digest
      t.string :requester_ip_digest
      t.timestamps
    end

    add_index :themes, :claim_token_digest, unique: true
    add_index :themes, [ :requester_ip_digest, :created_at ]
  end
end
