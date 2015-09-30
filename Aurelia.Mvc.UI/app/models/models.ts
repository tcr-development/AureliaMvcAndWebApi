module Models {
   export class Movie {
      title: string;
      releaseYear: number;
      id: number;
   }

   export class Group {
      id: number;
      name: string;
      orderNum: number;
      sections: Section[];
      allowForFilter: boolean;
      allowForPassFail: boolean;
      allowForPointBased: boolean;
   }

   export class Section {
      id: number;
      groupId: number;
      name: string;
      orderNum: number;
      columns: Column[];
   }

   export class Column {
      columnId: number;
      sectionId: number;
      friendlyName: string;
      dataType: string;
      orderNum: number;
      compareOperatorId: number;
      compareAgainstId: number;
      allowForFilter: boolean;
      allowForPassFail: boolean;
      allowForPointBased: boolean;
      formatMask: string;
      defaultOperator: string;
      scoring: ScoringSettings;
   }

   export class FilterCompareAgainst {
      id: number;
      value: number;
      displayTxt: string;
      allowForPassFail: boolean;
      allowForPointBased: boolean;
      passFailOrderNum: number;
      pointBasedOrderNum: number;
   }

   export class FilterCompareOperator {
      id: number;
      value: string;
      displayTxt: string;
      orderNum: number;
   }

   export class FilterDataList {
      dataType: string;
      values: FilterDataListValue[];
   }

   export class FilterDataListValue {
      displayTxt: string;
      value: string;
      orderNum: number;
   }

   export class Criteria {
      groups: Group[];
      sections: Section[];
      columns: Column[];
      compareOperators: FilterCompareOperator[];
      compareAgainst: FilterCompareAgainst[];
      dataLists: FilterDataList[];
   }

   export class ScoringSettings {
      constructor(defaultOperator: string) {
         this.compareOperator = defaultOperator;
      }
      compareAgainstId: number;
      compareOperator: string;
      lowerValue: string;
      upperValue: string;
      weighting: number;
   }
}




//var Models = { Movie: Movie, Group: Group, Section: Section, Column: Column };

//export {
//   Models
//}