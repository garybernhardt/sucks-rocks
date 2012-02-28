When /^I search for (.*)$/ do |term|
  @scores ||= {}
  @scores[term] = RockScore.for_term(term)
end

Then /^the beatles should have a higher score than comcast/ do
  @scores["the beatles"].should be > @scores["comcast"]
end

