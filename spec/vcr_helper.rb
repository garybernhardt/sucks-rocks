VCR.config do |config|
  config.cassette_library_dir = "fixtures/cassettes"
  config.stub_with :webmock
  config.filter_sensitive_data("<BING APP ID>") { ENV.fetch("BING_APP_ID") }
end

