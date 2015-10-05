export class DecimalFormatValueConverter {
   toView(value, format) {
      return numeral(value).format(format);
   }
}