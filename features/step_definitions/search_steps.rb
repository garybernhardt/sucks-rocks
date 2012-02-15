When /^I search for (.*)$/ do |term|
  @scores ||= {}
  @scores[term] = RockScore.for_term(term)
end

Then /^apple should have a higher score than microsoft$/ do
  @scores["apple"].should be > @scores["microsoft"]
end

