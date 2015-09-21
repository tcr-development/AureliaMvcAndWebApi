using System;
using Microsoft.AspNet.Identity;
using System.Security.Principal;
using System.Web.Mvc;

namespace Aurelia.Mvc.UI {
   public static class ExtensionMethods {

      #region Identity Extensions

      /// <summary>
      /// Gets the int user identifier.
      /// </summary>
      /// <param name="identity">The identity.</param>
      /// <returns>System.Int32.</returns>
      public static int GetIntUserId(this IIdentity identity) {
         return int.Parse(identity.GetUserId());
      }

      #endregion

      #region HtmlHelper Extensions

      private static string BaseUrlNoTrailingSlash(HtmlHelper html) {
         var request = html.ViewContext.HttpContext.Request;

         if (request.Url != null && request.ApplicationPath != null) {
            return request.Url.Scheme + "://" + request.Url.Authority + request.ApplicationPath.TrimEnd('/');
         }
         else {
            throw new InvalidOperationException("Attempt to interrogate request object when it was null");
         }
      }

      public static MvcHtmlString BaseUrl(this HtmlHelper html, bool includeTrailingSlash = true) {
         var retVal = includeTrailingSlash ? BaseUrlNoTrailingSlash(html) + "/" : BaseUrlNoTrailingSlash(html);
         return new MvcHtmlString(retVal);

      }

      #endregion
   }
}