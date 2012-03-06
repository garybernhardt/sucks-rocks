require "spec_helper"

describe ScoresController do
  it "returns scores for terms" do
    ScoreCache.stub(:for_term).with("microsoft") { 8.5 }
    get :show, :term => "microsoft"
    response.body.should == {:term => "microsoft", :score => 8.5}.to_json
  end
end

