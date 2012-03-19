Given /^microsoft is cached with a score of 2.5$/ do
  CachedScore.save_score("microsoft", 2.5)
end

Given /^microsoft is cached with no score$/ do
  CachedScore.save_score("microsoft", RockScore::NoScore)
end

When /^I search for (.*)$/ do |term|
  @scores ||= {}
  visit query_path(:term => term)
  score = ActiveSupport::JSON.decode(page.source).fetch("score")
  @scores[term] = @last_score = score
end

Then /^the beatles should have a higher score than comcast/ do
  @scores["the beatles"].should be > @scores["comcast"]
end

Then /^I should see a score of 2.5$/ do
  @last_score.should == 2.5
end

Then /^I should see no score$/ do
  @last_score.should == nil
end

