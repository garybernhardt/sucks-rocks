require "spec_helper"

describe CachedScore do
  it "remembers scores" do
    CachedScore.save_score("microsoft", 7.5)
    CachedScore.for_term("microsoft").should == 7.5
  end

  it "raises an exception if the term isn't cached" do
    expect do
      CachedScore.for_term("microsoft")
    end.to raise_error(CachedScore::NoScore)
  end
end

