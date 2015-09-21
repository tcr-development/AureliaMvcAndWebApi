using Microsoft.AspNet.Identity;
using System;
using System.Threading.Tasks;

namespace Aurelia.Mvc.UI.Models {
   public class TcrUserValidator : UserValidator<TcrUser, int> {
      /// <summary>
      /// Initializes a new instance of the <see cref="TcrUserValidator" /> class.
      /// </summary>
      /// <param name="manager">The manager.</param>
      public TcrUserValidator(UserManager<TcrUser, int> manager)
         : base(manager) {
      }

      /// <summary>
      /// Gets or sets the minimum length.
      /// </summary>
      /// <value>The minimum length.</value>
      public int MinLength { get; set; }

      /// <summary>
      /// Validates the asynchronous.
      /// </summary>
      /// <param name="item">The item.</param>
      /// <returns>Task&lt;IdentityResult&gt;.</returns>
      /// <exception cref="System.ArgumentException">item</exception>
      public override Task<IdentityResult> ValidateAsync(TcrUser item) {
         if (item.UserName == null) {
            throw new ArgumentException("item");
         }

         if (item.UserName.Length < this.MinLength) {
            return Task.FromResult<IdentityResult>(IdentityResult.Failed(new string[] { $"User name must be at least {this.MinLength} characters." }));
         }

         return base.ValidateAsync(item);
      }
   }
}