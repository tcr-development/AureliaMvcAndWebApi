var strings=["Hello","98052","101"],validators={};validators["ZIP code"]=new Validation.ZipCodeValidator,validators["Letters only"]=new Validation.LettersOnlyValidator,strings.forEach(function(a){for(var o in validators)console.log('"'+a+'" '+(validators[o].isAcceptable(a)?" matches ":" does not match ")+o)});