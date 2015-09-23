import http = require("aurelia-http-client");

export class FundFilterService {
   static inject = [http.HttpClient];

   constructor(
      private httpClient: http.HttpClient,
      private url: string = "api/FundFiltersApi/") {

   }

   getFundCriteria(): Promise<Models.Criteria> {
      return this.httpClient.get(this.url + "FundCriteria").then(result => {
         return result.content;
      });
   }
}