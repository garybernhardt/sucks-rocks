class ScoreCache
  def self.for_term(term)
    begin
      CachedScore.for_term(term)
    rescue CachedScore::NoScore
      score = RockScore.for_term(term)
      CachedScore.save_score(term, score)
      score
    end
  end
end

