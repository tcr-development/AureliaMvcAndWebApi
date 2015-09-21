using System;
using System.Configuration;
using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;

namespace Aurelia.Mvc.UI.Models {
   /// <summary>
   /// Class TcrIdentityDbContext.
   /// </summary>
   public class TcrIdentityDbContext : IdentityDbContext<TcrUser, TcrRole, int, TcrUserLogin, TcrUserRole, TcrUserClaim> {
      /// <summary>
      /// Initializes a new instance of the <see cref="TcrIdentityDbContext" /> class.
      /// </summary>
      public TcrIdentityDbContext()
         : base("Aurelia.Mvc.Db") {
      }

      /// <summary>
      /// Creates this instance.
      /// </summary>
      /// <returns>RleIdentityDbContext.</returns>
      public static TcrIdentityDbContext Create() {
         return new TcrIdentityDbContext();
      }
   }

   /// <summary>
   /// Class TcrUserStore.
   /// </summary>
   public class TcrUserStore : UserStore<TcrUser, TcrRole, int, TcrUserLogin, TcrUserRole, TcrUserClaim> {
      /// <summary>
      /// Initializes a new instance of the <see cref="TcrUserStore" /> class.
      /// </summary>
      /// <param name="context">The context.</param>
      public TcrUserStore(TcrIdentityDbContext context) : base(context) { }
   }

   /// <summary>
   /// Class TcrRoleStore.
   /// </summary>
   public class TcrRoleStore : RoleStore<TcrRole, int, TcrUserRole> {
      /// <summary>
      /// Initializes a new instance of the <see cref="TcrRoleStore" /> class.
      /// </summary>
      /// <param name="context">The context.</param>
      public TcrRoleStore(TcrIdentityDbContext context) : base(context) { }
   }

   /// <summary>
   /// Class TcrUserManager.
   /// </summary>
   public class TcrUserManager : UserManager<TcrUser, int> {
      // Configure the application user manager
      /// <summary>
      /// Initializes a new instance of the <see cref="TcrUserManager" /> class.
      /// </summary>
      /// <param name="store">The store.</param>
      public TcrUserManager(IUserStore<TcrUser, int> store)
         : base(store) {

      }

      /// <summary>
      /// Creates the specified options.
      /// </summary>
      /// <param name="options">The options.</param>
      /// <param name="context">The context.</param>
      /// <returns>RleUserManager.</returns>
      public static TcrUserManager Create(IdentityFactoryOptions<TcrUserManager> options, IOwinContext context) {
         var manager = new TcrUserManager(new TcrUserStore(context.Get<TcrIdentityDbContext>()));

         manager.UserValidator = new TcrUserValidator(manager) {
            MinLength = 3,
            AllowOnlyAlphanumericUserNames = false,
            RequireUniqueEmail = true
         };
         manager.PasswordValidator = new TcrPasswordValidator() {
            RequiredLength = 6,
            MinimumComplexityRequirements = 2
         };

         // Configure user lockout defaults
         manager.UserLockoutEnabledByDefault = true;
         var minutes = ConfigurationManager.AppSettings["lockoutTimespanInMinutes"];
         if (string.IsNullOrEmpty(minutes)) {
            minutes = "5";
         }
         var attempts = ConfigurationManager.AppSettings["lockoutAttemptLimit"];
         if (string.IsNullOrEmpty(attempts)) {
            attempts = "5";
         }

         manager.DefaultAccountLockoutTimeSpan = TimeSpan.FromMinutes(Convert.ToInt32(minutes));
         manager.MaxFailedAccessAttemptsBeforeLockout = Convert.ToInt32(attempts);

         // Register two factor authentication providers. This application uses Phone and Emails as a step of receiving a code for verifying the user
         // You can write your own provider and plug it in here.
         //manager.RegisterTwoFactorProvider("Phone Code", new PhoneNumberTokenProvider<RleUser, int> {
         //   MesTcrFormat = "Your security code is {0}"
         //});

         manager.RegisterTwoFactorProvider("Email Code", new EmailTokenProvider<TcrUser, int> {
            Subject = "Security Code",
            BodyFormat = "Your security code is {0}"
         });
         //manager.EmailService = new EmailService();
         //manager.SmsService = new SmsService();

         var dataProtectionProvider = options.DataProtectionProvider;
         if (dataProtectionProvider != null) {
            manager.UserTokenProvider = new DataProtectorTokenProvider<TcrUser, int>(dataProtectionProvider.Create("PasswordReset"));
         }

         return manager;
      }

   }

   /// <summary>
   /// Class TcrUser.
   /// </summary>
   public class TcrUser : IdentityUser<int, TcrUserLogin, TcrUserRole, TcrUserClaim> {
      /// <summary>
      /// Gets or sets a value indicating whether [locked out].
      /// </summary>
      /// <value><c>true</c> if [locked out]; otherwise, <c>false</c>.</value>
      public bool LockedOut { get; set; }
      /// <summary>
      /// Gets or sets a value indicating whether [is active].
      /// </summary>
      /// <value><c>true</c> if [is active]; otherwise, <c>false</c>.</value>
      public bool IsActive { get; set; }

      /// <summary>
      /// generate user identity as an asynchronous operation.
      /// </summary>
      /// <param name="manager">The manager.</param>
      /// <returns>Task&lt;ClaimsIdentity&gt;.</returns>
      public async Task<ClaimsIdentity> GenerateUserIdentityAsync(TcrUserManager manager) {
         // Note the authenticationType must match the one 
         // defined in CookieAuthenticationOptions.AuthenticationType
         var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
         // Add custom user claims here
         return userIdentity;
      }
   }

   /// <summary>
   /// Class TcrRole.
   /// </summary>
   public class TcrRole : IdentityRole<int, TcrUserRole> {
      /// <summary>
      /// Initializes a new instance of the <see cref="TcrRole" /> class.
      /// </summary>
      public TcrRole() { }
      /// <summary>
      /// Initializes a new instance of the <see cref="TcrRole" /> class.
      /// </summary>
      /// <param name="name">The name.</param>
      public TcrRole(string name) { Name = name; }
   }

   /// <summary>
   /// Class TcrUserRole.
   /// </summary>
   public class TcrUserRole : IdentityUserRole<int> { }

   /// <summary>
   /// Class TcrUserClaim.
   /// </summary>
   public class TcrUserClaim : IdentityUserClaim<int> { }

   /// <summary>
   /// Class TcrUserLogin.
   /// </summary>
   public class TcrUserLogin : IdentityUserLogin<int> { }
}