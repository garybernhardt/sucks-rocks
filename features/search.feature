Feature: Users can learn how good something is

  @user-compares-two-terms
  Scenario: User compares two terms
    When I search for microsoft
    And I search for apple
    Then apple should have a higher score than microsoft

  Scenario: Why are the results for microsoft and apple so close?
    When pending

