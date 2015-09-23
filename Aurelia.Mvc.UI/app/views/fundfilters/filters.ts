import fundFilterService = require("../../services/fundFilterService");
import _ = require("underscore");

export class Filters{
   static inject = [fundFilterService.FundFilterService];

   groups: Models.Group[];
   compareOperators: Models.FilterCompareOperator[];
   compareAgainst: Models.FilterCompareAgainst[];
   dataLists: Models.FilterDataList[];

   constructor(private fundFilterSvc: fundFilterService.FundFilterService){

   }

   activate() {
      return this.fundFilterSvc.getFundCriteria().then(criteria => {
         this.compareOperators = criteria.compareOperators;
         this.compareAgainst = criteria.compareAgainst;
         this.dataLists = criteria.dataLists;

         this.groups = criteria.groups;

         _.each(this.groups, g => {
            g.sections = criteria.sections.filter(section => {
               return section.groupId === g.id;
            });

            _.each(g.sections, s => {
               s.columns = criteria.columns.filter(column => {
                  return column.sectionId === s.id;
               });
            });
         });
      });
   }
}
