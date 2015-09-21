using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Aurelia.Mvc.UI.WebApi {
   [Authorize]
   public class MoviesApiController : ApiController {
      // GET: api/MoviesApi
      public IHttpActionResult Get() {
         return Ok(Movies);
      }

      // GET: api/MoviesApi/5
      public IHttpActionResult Get(int id) {
         var retVal = Movies.SingleOrDefault(x => x.Id == id);

         if (retVal == null) {
            return NotFound();
         }

         return Ok(retVal);
      }

      // POST: api/MoviesApi
      public IHttpActionResult Post(MoviePostModel value) {
         if (!ModelState.IsValid) {
            return BadRequest(ModelState);
         }

         var newItem = new Movie {
            Id = Movies.Max(x => x.Id) + 1,
            Title = value.Title,
            ReleaseYear = value.ReleaseYear
         };

         Movies.Add(newItem);

         return CreatedAtRoute(WebApiConfig.ApiControllerAndId, new { id = newItem.Id }, newItem);
      }

      // PUT: api/MoviesApi/5
      public IHttpActionResult Put(Movie value) {
         if (!ModelState.IsValid) {
            return BadRequest(ModelState);
         }
         try {

            var existingItem = Movies.SingleOrDefault(x => x.Id == value.Id);
            if (existingItem == null) {
               return NotFound();
            }

            existingItem.Title = value.Title;
            existingItem.ReleaseYear = value.ReleaseYear;

            return Ok(existingItem);

         }
         catch {
            return InternalServerError();
         }

      }

      // DELETE: api/MoviesApi/5
      public IHttpActionResult Delete(int id) {
         var existingItem = Movies.SingleOrDefault(x => x.Id == id);
         if (existingItem == null) {
            return NotFound();
         }

         Movies.Remove(existingItem);

         return Ok();
      }

      private static readonly List<Movie> Movies = new List<Movie> {
         new Movie { Id = 1, Title = "Star Wars", ReleaseYear = 1983},
         new Movie { Id = 2, Title = "Star Trek", ReleaseYear = 1981},
         new Movie { Id = 3, Title = "Shrek", ReleaseYear = 2004}
      };
   }

   public class Movie {
      public int Id { get; set; }
      public string Title { get; set; }
      public int ReleaseYear { get; set; }
   }

   public class MoviePostModel {
      public int? Id { get; set; }
      public string Title { get; set; }
      public int ReleaseYear { get; set; }

   }
}
