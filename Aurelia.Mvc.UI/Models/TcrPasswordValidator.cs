using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Aurelia.Mvc.UI.Models {
   public class TcrPasswordValidator : PasswordValidator {

      /// <summary>
      /// Complexity requirements are uppercase, lowercase, digit, special character.
      /// This value determines how many of those requirements are required.
      /// </summary>
      /// <value>The minimum complexity requirements.</value>
      public int MinimumComplexityRequirements { get; set; }

      /// <summary>
      /// Ensures that the string is of the required length and meets the configured requirements
      /// </summary>
      /// <param name="item">The item.</param>
      /// <returns>Task&lt;IdentityResult&gt;.</returns>
      /// <exception cref="System.ArgumentException">item</exception>
      public override Task<IdentityResult> ValidateAsync(string item) {
         if (item == null) {
            throw new ArgumentException("item");
         }

         var values = new List<string>();

         if (string.IsNullOrWhiteSpace(item) || (item.Length < base.RequiredLength)) {
            values.Add($"Minimum password length is {base.RequiredLength}");
         }

         int complexityCount = 0;

         // see if we have at least one digit
         if (item.Any(c => base.IsDigit(c))) {
            complexityCount++;
         }

         // see if we have at least one lowercase letter
         if (item.Any(c => base.IsLower(c))) {
            complexityCount++;
         }

         // see if we have at least one uppercase letter
         if (item.Any(c => base.IsUpper(c))) {
            complexityCount++;
         }

         // see if we have at least one special character
         if (item.Any(c => !base.IsLetterOrDigit(c))) {
            complexityCount++;
         }

         if (complexityCount < this.MinimumComplexityRequirements) {
            values.Add($"Password contains only {complexityCount} of required {this.MinimumComplexityRequirements} complexity requirements");
         }

         if (values.Count == 0) {
            return Task.FromResult<IdentityResult>(IdentityResult.Success);
         }

         return Task.FromResult<IdentityResult>(IdentityResult.Failed(new string[] { string.Join(" ", values) }));

      }
   }
}