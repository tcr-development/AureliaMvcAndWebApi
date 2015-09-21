import aur = require("aurelia-router");

export class Movies {
   static inject = [aur.Router];

   constructor(private router: aur.Router) {
      this.router.configure((config) => {
         config.title = "Movies";
         config.map([
            { route: ["", "list"], moduleId: "views/movies/list", title: "List", nav: true, name: "home" },
            { route: "details/:id", moduleId: "views/movies/details", name: "details" },
            { route: "edit/:id", moduleId: "views/movies/edit", name: "edit" },
            { route: "create", moduleId: "views/movies/edit", name: "create" }
         ]);

         return config;
      });
   }
}