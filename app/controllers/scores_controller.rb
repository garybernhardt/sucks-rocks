class ScoresController < ApplicationController
  def show
    term = params[:term]
    score = ScoreCache.for_term(term)
    score = nil if score == RockScore::NoScore
    render :json => {:term => term, :score => score}
  end
end

