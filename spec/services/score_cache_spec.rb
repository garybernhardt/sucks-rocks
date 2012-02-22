require_relative "../../app/services/score_cache"
require_relative "../../app/services/rock_score"

class CachedScore
  class NoScore < RuntimeError; end
end

describe ScoreCache do
  it "returns cached scores if they exist" do
    CachedScore.stub(:for_term).with("microsoft") { 5.5 }
    ScoreCache.for_term("microsoft").should == 5.5
  end

  context "when the term is not cached" do
    before do
      RockScore.stub(:for_term).with("microsoft") { 5.5 }
      CachedScore.stub(:for_term).with("microsoft").
        and_raise(CachedScore::NoScore)
      CachedScore.stub(:save_score)
    end

    it "recomputes score" do
      ScoreCache.for_term("microsoft").should == 5.5
    end

    it "stores new scores in the database" do
      CachedScore.should_receive(:save_score).with("microsoft", 5.5)
      ScoreCache.for_term("microsoft")
    end
  end
end

