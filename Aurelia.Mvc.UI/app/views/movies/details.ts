import movieService = require("../../services/movieService");

export class Details {
   static inject = [movieService.MovieService];

   constructor(private movieSvc: movieService.MovieService, public movie: movieService.IMovie) { }

   activate(params) {
      return this.movieSvc.getById(params.id).then(movie => this.movie = movie);
   }
}