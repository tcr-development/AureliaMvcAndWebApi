using System.Web.Mvc;

namespace Aurelia.Mvc.UI.Controllers {
   [Authorize]
   public class GridController : Controller {
      // GET: FundFilters
      public ActionResult Index() {
         return View();
      }
      public ActionResult Wijmo() {
         return View();
      }
   }
}
