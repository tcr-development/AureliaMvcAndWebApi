import movieService = require("../../services/movieService");

export class MovieItem implements  movieService.IMovie {
   constructor(
      public id: number,
      public title: string,
      public releaseYear: number) {
      
   }
}