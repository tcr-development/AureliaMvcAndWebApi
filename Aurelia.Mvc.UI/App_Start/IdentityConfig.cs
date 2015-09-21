using Aurelia.Mvc.UI.Models;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Aurelia.Mvc.UI {

   // Configure the application sign-in manager which is used in this application.
   public class ApplicationSignInManager : SignInManager<TcrUser, int> {
      public ApplicationSignInManager(TcrUserManager userManager, IAuthenticationManager authenticationManager)
          : base(userManager, authenticationManager) {
      }

      public override Task<ClaimsIdentity> CreateUserIdentityAsync(TcrUser user) {
         return user.GenerateUserIdentityAsync((TcrUserManager)UserManager);
      }

      public static ApplicationSignInManager Create(IdentityFactoryOptions<ApplicationSignInManager> options, IOwinContext context) {
         return new ApplicationSignInManager(context.GetUserManager<TcrUserManager>(), context.Authentication);
      }
   }
}
