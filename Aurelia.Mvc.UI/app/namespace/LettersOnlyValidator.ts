/// <reference path="validation.ts" />
namespace Validation {
   var lettersRegexp = /^[A-Za-z]+$/;
   export class LettersOnlyValidator implements IStringValidator {
      isAcceptable(s: string) {
         return lettersRegexp.test(s);
      }
   }
}