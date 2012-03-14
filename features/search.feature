Feature: Users can learn how good something is

  @compare-two-terms
  Scenario: Compare two terms
    When I search for comcast
    And I search for the beatles
    Then the beatles should have a higher score than comcast

  Scenario: Search for cached term
    Given microsoft is cached with a score of 2.5
    When I search for microsoft
    Then I should see a score of 2.5

  Scenario: Search for term with no score
    When pending

  Scenario: Why are the results so extreme for the beatles and comcast?
    When pending

