class CreateCachedScores < ActiveRecord::Migration
  def up
    create_table :cached_scores do |t|
      t.string :term
      t.float :score
    end
  end

  def down
    drop_table :cached_scores
  end
end
