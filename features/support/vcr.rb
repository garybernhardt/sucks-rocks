require_relative "../../spec/vcr_helper"

VCR.cucumber_tags do |t|
  t.tag "user-compares-two-terms"
end

