import movieService = require("../../services/movieService");
import _ = require("underscore");

export class List {
   static inject = [movieService.MovieService];

   constructor(
      private movieSvc: movieService.MovieService,
      public items: movieService.IMovie[] = []) {
      
   }

   activate(params) {
      if (this.items.length < 1) {
         this.movieSvc.getAll().then(result => {
            _.forEach(result, item => {
               this.items.push(item);
            });
         });
      }
   }
}