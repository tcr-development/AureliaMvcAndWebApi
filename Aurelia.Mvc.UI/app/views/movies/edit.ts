import aur = require("aurelia-router");
import Validation = require("aurelia-validation/validation/validation");
import movieService = require("../../services/movieService");
import ValidationGroup = require("aurelia-validation/validation/validation-group");

export class Edit {
   static inject = [aur.Router, Validation.Validation, movieService.MovieService];
   private validation: ValidationGroup.ValidationGroup;

   constructor(private router: aur.Router, validation: Validation.Validation, private movieSvc: movieService.MovieService, public movie: movieService.IMovie) {
      //this.validation = validation.on(this, (val) => {
      //   val.ensure("movie.title").isNotEmpty().hasMinLength(3).hasMaxLength(100).ensure("movie.releaseYear").isNumber().isBetween(1900, 2100);
      //});
      //this.validation = validation.on(this, null).ensure("movie.title")
      //   .isNotEmpty()
      //   .hasMinLength(3)
      //   .hasMaxLength(100)
      //   .ensure("movie.releaseYear")
      //   .isNumber()
      //   .isBetween(1900, 2100);
   }

   activate(params) {
      return this.movieSvc.getById(params.id)
         .then(movie => {
            this.movie = movie;
            //this.validation.validate();
         });
   }

   save() {

      //this.validation.validate().then(() => {
         this.movieSvc.update(this.movie).then(movie => {
            let url = this.router.generate("details", { id: movie.id });
            this.router.navigate(url);
         });
      //});
   }
}