Feature: Users can learn how good something is

  @compare-two-terms
  Scenario: Compare two terms
    When I search for comcast
    And I search for the beatles
    Then the beatles should have a higher score than comcast

  Scenario: Why are the results so extreme for the beatles and comcast?
    When pending

