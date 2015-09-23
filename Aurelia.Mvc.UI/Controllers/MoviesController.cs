using System.Web.Mvc;

namespace Aurelia.Mvc.UI.Controllers {
   [Authorize]
   public class MoviesController : Controller {
      // GET: Movies
      public ActionResult Index() {
         return View();
      }
   }
}
