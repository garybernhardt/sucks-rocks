class ScoresController < ApplicationController
  def show
    term = params[:term]
    score = ScoreCache.for_term(term)
    render :json => {:term => term, :score => score}
  end
end

