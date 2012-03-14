require_relative "../../spec/vcr_helper"

VCR.cucumber_tags do |t|
  t.tag "compare-two-terms"
  t.tag "search-for-term-with-no-score"
end

