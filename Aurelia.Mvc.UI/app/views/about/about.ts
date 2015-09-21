import aur = require("aurelia-router");

export class About {
   static inject = [aur.Router];

   constructor(private router: aur.Router, public message: string) {
      this.message = "Hello from about";
   }
}