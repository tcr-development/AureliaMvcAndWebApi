/// <reference path="validation.ts" />
namespace Validation {
   var numberRegexp = /^[0-9]+$/;
   export class ZipCodeValidator implements IStringValidator {
      isAcceptable(s: string) {
         return s.length === 5 && numberRegexp.test(s);
      }
   }
}
