
using System.Collections.Generic;

namespace Aurelia.Mvc.UI.Models.ViewModels {

   public class ColumnGroupViewModel {

      public ColumnGroupViewModel() { }

      public int Id { get; set; }
      public string Name { get; set; }
      public byte OrderNum { get; set; }
      public bool AllowForFilter { get; set; }
      public bool AllowForPassFail { get; set; }
      public bool AllowForPointBased { get; set; }
   }

   public class ColumnSectionViewModel {

      public ColumnSectionViewModel() {

      }

      public int Id { get; set; }
      public byte GroupId { get; set; }
      public string Name { get; set; }
      public byte OrderNum { get; set; }
   }

   public class ColumnViewModel {

      public ColumnViewModel() { }

      public int ColumnId { get; set; }
      public byte SectionId { get; set; }
      public string FriendlyName { get; set; }
      public string DataType { get; set; }
      public byte OrderNum { get; set; }
      public byte CompareOperatorId { get; set; }
      public byte? CompareAgainstId { get; set; }
      public bool AllowForFilter { get; set; }
      public bool AllowForPassFail { get; set; }
      public bool AllowForPointBased { get; set; }
      public string FormatMask { get; set; }
      public string DefaultOperator { get; set; }
   }

   public class FilterCompareAgainstViewModel {
      public byte Id { get; set; }
      public byte Value { get; set; }
      public string DisplayTxt { get; set; }
      public bool AllowForPassFail { get; set; }
      public bool AllowForPointBased { get; set; }
      public byte? PassFailOrderNum { get; set; }
      public byte? PointBasedOrderNum { get; set; }
   }

   public class FilterCompareOperatorViewModel {
      public byte Id { get; set; }
      public string Value { get; set; }
      public string DisplayTxt { get; set; }
      public byte OrderNum { get; set; }
   }

   public class FilterDataListViewModel {
      public FilterDataListViewModel() {
         Values = new List<FilterDataListValueViewModel>();
      }
      public string DataType { get; set; }
      public List<FilterDataListValueViewModel> Values { get; set; }
   }

   public class FilterDataListValueViewModel {
      public string DisplayTxt { get; set; }
      public string Value { get; set; }
      public byte OrderNum { get; set; }
   }
   
}