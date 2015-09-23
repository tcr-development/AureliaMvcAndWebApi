using System.Web.Mvc;

namespace Aurelia.Mvc.UI.Controllers {
   [Authorize]
   public class FundFiltersController : Controller {
      // GET: FundFilters
      public ActionResult Index() {
         return View();
      }
      
   }
}
