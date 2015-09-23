using Aurelia.Mvc.UI.Models.ViewModels;
using System.Collections.Generic;
using System.Web.Http;

namespace Aurelia.Mvc.UI.WebApi {
   public class FundFiltersApiController : ApiController {

      [ActionName("FundCriteria")]
      public IHttpActionResult GetFundCriteria() {
         return base.Ok(new { Groups, Sections, Columns, CompareOperators, CompareAgainst, DataLists });
      }

      #region Groups

      private static readonly List<ColumnGroupViewModel> Groups = new List<ColumnGroupViewModel> {
         new ColumnGroupViewModel { AllowForFilter = true, AllowForPassFail = false, AllowForPointBased = false, Id = 5, Name = "Categories", OrderNum = 1 },
         new ColumnGroupViewModel { AllowForFilter = true, AllowForPassFail = true, AllowForPointBased = true, Id = 1, Name = "Performance", OrderNum = 2 },
         new ColumnGroupViewModel { AllowForFilter = true, AllowForPassFail = true, AllowForPointBased = true, Id = 2, Name = "Ratings", OrderNum = 3 },
         new ColumnGroupViewModel { AllowForFilter = true, AllowForPassFail = true, AllowForPointBased = true, Id = 3, Name = "Manager / Portfolio", OrderNum = 4 },
         new ColumnGroupViewModel { AllowForFilter = true, AllowForPassFail = false, AllowForPointBased = false, Id = 4, Name = "Platform Data", OrderNum = 5 },
         new ColumnGroupViewModel { AllowForFilter = false, AllowForPassFail = true, AllowForPointBased = true, Id = 6, Name = "Models", OrderNum = 6 }
      };

      #endregion

      #region Sections

      private static readonly List<ColumnSectionViewModel> Sections = new List<ColumnSectionViewModel> {
         new ColumnSectionViewModel { GroupId = 5, Id = 1, Name = "Morningstar Category", OrderNum = 1 },
         new ColumnSectionViewModel { GroupId = 1, Id = 2, Name = "Total Return", OrderNum = 2 },
         new ColumnSectionViewModel { GroupId = 1, Id = 3, Name = "% Rank Within Category", OrderNum = 3 },
         new ColumnSectionViewModel { GroupId = 1, Id = 4, Name = "MPT Statistics", OrderNum = 3 },
         new ColumnSectionViewModel { GroupId = 2, Id = 5, Name = "Morningstar Ratings", OrderNum = 3 },
         new ColumnSectionViewModel { GroupId = 2, Id = 6, Name = "Morningstar Return and Risk", OrderNum = 3 },
         new ColumnSectionViewModel { GroupId = 2, Id = 7, Name = "Sharpe Ratio", OrderNum = 3 },
         new ColumnSectionViewModel { GroupId = 2, Id = 8, Name = "Standard Deviation", OrderNum = 3 },
         new ColumnSectionViewModel { GroupId = 3, Id = 9, Name = "Manager Data", OrderNum = 3 },
         new ColumnSectionViewModel { GroupId = 3, Id = 10, Name = "Operations", OrderNum = 3 },
         new ColumnSectionViewModel { GroupId = 3, Id = 11, Name = "Portfolio", OrderNum = 3 },
         new ColumnSectionViewModel { GroupId = 4, Id = 12, Name = "Platform Data", OrderNum = 3 },
         new ColumnSectionViewModel { GroupId = 6, Id = 13, Name = "Total Return", OrderNum = 3 },
         new ColumnSectionViewModel { GroupId = 6, Id = 14, Name = "Standard Deviation", OrderNum = 3 },
         new ColumnSectionViewModel { GroupId = 6, Id = 15, Name = "Sharpe Ratio", OrderNum = 3 }
      };

      #endregion

      #region Columns

      private static readonly List<ColumnViewModel> Columns = new List<ColumnViewModel> {
         new ColumnViewModel {
            ColumnId = 3,
            SectionId = 1,
            FriendlyName = "Category",
            DataType = "Category",
            OrderNum = 1,
            CompareOperatorId = 1,
            CompareAgainstId = null,
            AllowForFilter = true,
            AllowForPassFail = false,
            AllowForPointBased = false,
            DefaultOperator = "=",
            FormatMask = null
         },
         new ColumnViewModel {
            ColumnId = 6,
            SectionId = 2,
            FriendlyName = "Total Return YTD",
            DataType = "Decimal",
            OrderNum = 1,
            CompareOperatorId = 2,
            CompareAgainstId = 1,
            AllowForFilter = true,
            AllowForPassFail = true,
            AllowForPointBased = true,
            DefaultOperator = ">=",
            FormatMask = "4.2"
         },
         new ColumnViewModel {
            ColumnId = 5,
            SectionId = 3,
            FriendlyName = "% Rank Category YTD",
            DataType = "Integer",
            OrderNum = 1,
            CompareOperatorId = 2,
            CompareAgainstId = null,
            AllowForFilter = true,
            AllowForPassFail = true,
            AllowForPointBased = true,
            DefaultOperator = "<=",
            FormatMask = "3.0"
         },
         new ColumnViewModel {
            ColumnId = 20,
            SectionId = 4,
            FriendlyName = "Alpha 3 Yr",
            DataType = "Decimal",
            OrderNum = 1,
            CompareOperatorId = 2,
            CompareAgainstId = 1,
            AllowForFilter = true,
            AllowForPassFail = true,
            AllowForPointBased = true,
            DefaultOperator = ">=",
            FormatMask = "4.2"
         },
         new ColumnViewModel {
            ColumnId = 19,
            SectionId = 5,
            FriendlyName = "MStar Rating*",
            DataType = "MStarRating",
            OrderNum = 1,
            CompareOperatorId = 2,
            CompareAgainstId = null,
            AllowForFilter = true,
            AllowForPassFail = true,
            AllowForPointBased = true,
            DefaultOperator = ">=",
            FormatMask = null
         },
         new ColumnViewModel {
            ColumnId = 22,
            SectionId = 6,
            FriendlyName = "MStar Return 3 Yr",
            DataType = "HighLow",
            OrderNum = 1,
            CompareOperatorId = 2,
            CompareAgainstId = null,
            AllowForFilter = true,
            AllowForPassFail = true,
            AllowForPointBased = true,
            DefaultOperator = ">=",
            FormatMask = null
         },
         new ColumnViewModel {
            ColumnId = 28,
            SectionId = 7,
            FriendlyName = "Sharpe Ratio 3 Yr",
            DataType = "Decimal",
            OrderNum = 1,
            CompareOperatorId = 2,
            CompareAgainstId = 1,
            AllowForFilter = true,
            AllowForPassFail = true,
            AllowForPointBased = true,
            DefaultOperator = ">=",
            FormatMask = "3.2"
         },
         new ColumnViewModel {
            ColumnId = 29,
            SectionId = 8,
            FriendlyName = "Standard Deviation 3 Yr",
            DataType = "Decimal",
            OrderNum = 1,
            CompareOperatorId = 2,
            CompareAgainstId = 1,
            AllowForFilter = true,
            AllowForPassFail = true,
            AllowForPointBased = true,
            DefaultOperator = "<=",
            FormatMask = "3.2"
         },
         new ColumnViewModel {
            ColumnId = 43,
            SectionId = 9,
            FriendlyName = "Manager Tenure (longest)",
            DataType = "Decimal",
            OrderNum = 1,
            CompareOperatorId = 2,
            CompareAgainstId = 1,
            AllowForFilter = true,
            AllowForPassFail = true,
            AllowForPointBased = true,
            DefaultOperator = ">=",
            FormatMask = "3.2"
         },
         new ColumnViewModel {
            ColumnId = 56,
            SectionId = 10,
            FriendlyName = "Net Expense Ratio %",
            DataType = "Decimal",
            OrderNum = 1,
            CompareOperatorId = 2,
            CompareAgainstId = 1,
            AllowForFilter = true,
            AllowForPassFail = true,
            AllowForPointBased = true,
            DefaultOperator = "<=",
            FormatMask = "3.2"
         },
         new ColumnViewModel {
            ColumnId = 55,
            SectionId = 11,
            FriendlyName = "Net Assets",
            DataType = "Currency",
            OrderNum = 1,
            CompareOperatorId = 2,
            CompareAgainstId = 1,
            AllowForFilter = true,
            AllowForPassFail = true,
            AllowForPointBased = true,
            DefaultOperator = ">=",
            FormatMask = "12.2"
         },
         new ColumnViewModel {
            ColumnId = 58,
            SectionId = 12,
            FriendlyName = "Revenue Sharing (basis points)",
            DataType = "PDecimal",
            OrderNum = 1,
            CompareOperatorId = 2,
            CompareAgainstId = null,
            AllowForFilter = true,
            AllowForPassFail = true,
            AllowForPointBased = false,
            DefaultOperator = ">=",
            FormatMask = "3.1"
         },
         new ColumnViewModel {
            ColumnId = 44,
            SectionId = 13,
            FriendlyName = "Total Return YTD",
            DataType = "Decimal",
            OrderNum = 1,
            CompareOperatorId = 2,
            CompareAgainstId = 2,
            AllowForFilter = false,
            AllowForPassFail = true,
            AllowForPointBased = true,
            DefaultOperator = ">=",
            FormatMask = "4.2"
         }
      };

      #endregion

      #region CompareOperators

      private static readonly List<FilterCompareOperatorViewModel> CompareOperators = new List<FilterCompareOperatorViewModel> {
         new FilterCompareOperatorViewModel { Id = 1, Value = "=", DisplayTxt = "equal to", OrderNum = 1 },
         new FilterCompareOperatorViewModel { Id = 1, Value = "<>", DisplayTxt = "not equal to", OrderNum = 2 },
         new FilterCompareOperatorViewModel { Id = 2, Value = ">", DisplayTxt = "greater than", OrderNum = 1 },
         new FilterCompareOperatorViewModel { Id = 2, Value = ">=", DisplayTxt = "greater than or equal to", OrderNum = 2 },
         new FilterCompareOperatorViewModel { Id = 2, Value = "=", DisplayTxt = "equal to", OrderNum = 3 },
         new FilterCompareOperatorViewModel { Id = 2, Value = "<=", DisplayTxt = "less than or equal to", OrderNum = 4 },
         new FilterCompareOperatorViewModel { Id = 2, Value = "<", DisplayTxt = "less than", OrderNum = 5 },
         new FilterCompareOperatorViewModel { Id = 2, Value = "between", DisplayTxt = "between", OrderNum = 6 }
      };

      #endregion

      #region CompareAgainst

      private static readonly List<FilterCompareAgainstViewModel> CompareAgainst = new List<FilterCompareAgainstViewModel> {
         new FilterCompareAgainstViewModel { Id = 1, Value = 0, DisplayTxt = "Specified Value", AllowForPassFail = true, AllowForPointBased = true, PassFailOrderNum = 2, PointBasedOrderNum = 4 },
         new FilterCompareAgainstViewModel { Id = 1, Value = 1, DisplayTxt = "Category Average", AllowForPassFail = true, AllowForPointBased = true, PassFailOrderNum = 0, PointBasedOrderNum = 0 },
         new FilterCompareAgainstViewModel {
            Id = 1,
            Value = 2,
            DisplayTxt = "% of Category Average",
            AllowForPassFail = false,
            AllowForPointBased = true,
            PassFailOrderNum = null,
            PointBasedOrderNum = 1
         },
         new FilterCompareAgainstViewModel { Id = 2, Value = 0, DisplayTxt = "Specified Value", AllowForPassFail = true, AllowForPointBased = true, PassFailOrderNum = 1, PointBasedOrderNum = 2 },
         new FilterCompareAgainstViewModel { Id = 2, Value = 1, DisplayTxt = "Benchmark", AllowForPassFail = true, AllowForPointBased = true, PassFailOrderNum = 0, PointBasedOrderNum = 0 }
      };

      #endregion

      #region DataLists

      private static readonly List<FilterDataListViewModel> DataLists = new List<FilterDataListViewModel> {
         new FilterDataListViewModel {
            DataType = "HighLow",
            Values = new List<FilterDataListValueViewModel> {
               new FilterDataListValueViewModel { DisplayTxt = "High", Value = "5", OrderNum = 1 },
               new FilterDataListValueViewModel { DisplayTxt = "Above Average", Value = "4", OrderNum = 2 },
               new FilterDataListValueViewModel { DisplayTxt = "Average", Value = "3", OrderNum = 3 },
               new FilterDataListValueViewModel { DisplayTxt = "Below Average", Value = "2", OrderNum = 4 },
               new FilterDataListValueViewModel { DisplayTxt = "Low", Value = "1", OrderNum = 5 }
            }
         },
         new FilterDataListViewModel {
            DataType = "InvAvailability",
            Values = new List<FilterDataListValueViewModel> {
               new FilterDataListValueViewModel { DisplayTxt = "Open To All Investors", Value = "Open To All Investors", OrderNum = 1 },
               new FilterDataListValueViewModel { DisplayTxt = "Open To Existing", Value = "Open To Existing", OrderNum = 2 },
               new FilterDataListValueViewModel { DisplayTxt = "Closed", Value = "Closed", OrderNum = 3 }
            }
         },
         new FilterDataListViewModel {
            DataType = "MStarRating",
            Values = new List<FilterDataListValueViewModel> {
               new FilterDataListValueViewModel { DisplayTxt = "1 Star", Value = "1", OrderNum = 1 },
               new FilterDataListValueViewModel { DisplayTxt = "2 Stars", Value = "2", OrderNum = 2 },
               new FilterDataListValueViewModel { DisplayTxt = "3 Stars", Value = "3", OrderNum = 3 },
               new FilterDataListValueViewModel { DisplayTxt = "4 Stars", Value = "4", OrderNum = 4 },
               new FilterDataListValueViewModel { DisplayTxt = "5 Stars", Value = "5", OrderNum = 5 }
            }
         }
      };

      #endregion

      
   }


}
