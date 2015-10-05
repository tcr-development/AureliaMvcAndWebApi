var Pa;
// ReSharper disable InconsistentNaming
(function (Pa) {
   var Services;
   (function (Services) {
      var BaseService = (function () {
         function BaseService(controller) {
             this.url = Pa.baseUrlWithTrailingSlash + "api/" + controller;
         }
         BaseService.prototype.getServiceUrl = function (pageNumber, pageSize, searchText, planId) {
            return this.url;
         };
         BaseService.prototype.get = function (pageNumber, pageSize, searchText, planId) {
            if (pageSize === void 0) { pageSize = 10; }
            if (searchText === void 0) { searchText = ""; }
            if (planId === void 0) { planId = null; }
            if (pageNumber) {
               var searchData = {
                  pageNumber: pageNumber,
                  pageSize: pageSize,
                  searchText: searchText
               };
               if (planId) {
                  searchData.planId = planId;
               }
               return $.ajax({
                  cache: false,
                  data: searchData,
                  type: "GET",
                  url: this.url
               });
            }
            else {
               return $.ajax({
                  cache: false,
                  type: "GET",
                  url: this.url
               });
            }
         };
         BaseService.prototype.getById = function (id) {
            return $.ajax({
               cache: false,
               type: "GET",
               url: this.url + "/" + id
            });
         };
         BaseService.prototype.create = function (data) {
            return $.ajax({
               type: "POST",
               dataType: "json",
               data: data,
               url: this.url
            });
         };
         BaseService.prototype.update = function (data) {
            return $.ajax({
               type: "PUT",
               dataType: "json",
               data: data,
               url: this.url
            });
         };
         BaseService.prototype.delete = function (id) {
            return $.ajax({
               type: "DELETE",
               url: this.url + "/" + id
            });
         };
         return BaseService;
      })();
      Services.BaseService = BaseService;
      var ValueListService = (function () {
          function ValueListService() {
              var _this = this;

              this.getFundCriteria = function () {

                  if (_this.fundCriteria) {
                      return Q.when(_this.fundCriteria);
                  }

                  _this.fundCriteria = Pa.Storage.getAppVersionedData("fundCriteria");
                  if (_this.fundCriteria) {
                      return Q.when(_this.fundCriteria);
                  }
                  var deferred = Q.defer();

                  function success(result) {
                      _this.fundCriteria = result.data;
                      Pa.Storage.setAppVersionedData("fundCriteria", _this.fundCriteria);
                      deferred.resolve(result);
                  }

                    $.ajax({
                        type: "GET",
                        url: _this.url + "/FundCriteria"
                    }).then(success, queryFailed(deferred));

                    return deferred.promise;
              };

              this.getLookupLists = function (namesArray) {
                  var deferred = Q.defer();

                  function success(result) {
                      deferred.resolve(result);
                  }

                      $.ajax({
                          data: { names: namesArray },
                          type: "GET",
                          url: _this.url + "/lookuplists"
                      }).then(success, queryFailed(deferred));

                      return deferred.promise;

         
              };

              function queryFailed(promise) {
                  return function (error, two, three) {
                      var msg = "Error retrieving data. " + error.statusText;
                      console.log(msg, error);
                      promise.reject(result);
                  }
              }

              this.url = Pa.baseUrlWithTrailingSlash + "api/ValueListsApi";
          }
          return ValueListService;
      })();
      Services.ValueListService = ValueListService;
   })(Services = Pa.Services || (Pa.Services = {}));
})(Pa || (Pa = {}));
// ReSharper restore InconsistentNaming