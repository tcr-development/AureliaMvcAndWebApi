define(["require","exports","../../services/fundFilterService","underscore"],function(t,e,n,r){var i=function(){function t(t){this.fundFilterSvc=t}return t.prototype.activate=function(){var t=this;return this.fundFilterSvc.getFundCriteria().then(function(e){t.compareOperators=e.compareOperators,t.compareAgainst=e.compareAgainst,t.dataLists=e.dataLists,t.groups=e.groups,r.each(t.groups,function(t){t.sections=e.sections.filter(function(e){return e.groupId===t.id}),r.each(t.sections,function(t){t.columns=e.columns.filter(function(e){return e.sectionId===t.id}),r.each(t.columns,function(t){t.scoring=new Models.ScoringSettings(t.defaultOperator)})})})})},t.inject=[n.FundFilterService],t}();e.Filters=i});