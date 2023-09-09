import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReservedBook } from '../_models/ReservedBook';

@Injectable({
  providedIn: 'root'
})
export class ReserveService {

  baseUrl = 'https://localhost:5001/api/'

  userHasReservedBooks: boolean = false;;

  constructor(private http: HttpClient) { }

  //Check if a book is already reserve to set the start date of reservation - after all reservations expire 
  checkReservation(bookId: string) {

    return this.http.get<ReservedBook[]>(this.baseUrl + `reservations/${bookId}`);

  }

  addReservation(reservedBook: ReservedBook) {

    return this.http.post<ReservedBook>(this.baseUrl + 'reservations', reservedBook);

  }

  getReservations() {

    return this.http.get<ReservedBook[]>(this.baseUrl + 'reservations')

  }

  cancelReservation(bookId: string) {

    return this.http.delete<boolean>(this.baseUrl + `reservations/${bookId}`);

  }
}
