import http = require("aurelia-http-client");

export interface IMovie {
   title: string;
   releaseYear: number;
   id: number;
}

export class MovieService {
   static inject = [http.HttpClient];

   constructor(
      private httpClient: http.HttpClient,
      private url: string = "api/MoviesApi") {
   }

   create(newItem: IMovie): Promise<IMovie> {
      return this.httpClient.post(this.url, newItem).then(result => {
         return result.content;
      });
   }

   delete(id: number): Promise<boolean> {
      return this.httpClient.delete(`${this.url}?id=${id}`).then(() => {
         return true;
      });
   }

   getAll(): Promise<IMovie[]> {
      return this.httpClient.get(this.url).then(result => {
         return result.content;
      });
   }

   getById(id: number): Promise<IMovie> {
      return this.httpClient.get(`${this.url}?id=${id}`).then((result) => {
         return result.content;
      });
   }

   update(item: IMovie): Promise<IMovie> {
      return this.httpClient.put(this.url, item).then(result => {
         return result.content;
      });
   }
}