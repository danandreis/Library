import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BorrowedBook } from '../_models/BorrowedBook';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BorrowService {

  baseUrl = 'https://localhost:5001/api/'
  borrowedBooksList = new BehaviorSubject<BorrowedBook[]>([]);
  borrowedBooksList$ = this.borrowedBooksList.asObservable();

  //Check if user has already borerow a book. An user can borrow only one book once
  userHasBorrowedBooks = false;

  constructor(private http: HttpClient) { }

  addBorrow(borrowedBook: BorrowedBook) {

    return this.http.post<BorrowedBook>(this.baseUrl + 'borrows', borrowedBook);

  }

  extendBorrow(id: string, newDate: Date) {

    return this.http.put<string>(this.baseUrl + 'borrows', { id, newDate })

  }

  returnBorrowedBook(id: string, newDate: Date) {

    console.log(id);
    return this.http.put(this.baseUrl + "borrows/returnBook", { id, newDate })
  }

}
