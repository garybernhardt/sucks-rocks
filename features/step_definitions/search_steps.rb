When /^I search for (.*)$/ do |term|
  @scores ||= {}
  @scores[term] = RockScore.for_term(term)
end

Then /^apple should have a higher score than microsoft$/ do
  pending # express the regexp above with the code you wish you had
end

