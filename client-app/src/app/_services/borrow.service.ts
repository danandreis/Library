import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BorrowedBook } from '../_models/BorrowedBook';
import { BehaviorSubject } from 'rxjs';
import { Borrow } from '../_models/Borrow';

@Injectable({
  providedIn: 'root'
})

export class BorrowService {

  baseUrl = 'https://localhost:5001/api/';
  borrowedBooks = new BehaviorSubject<Borrow[]>([])
  borrowedBooks$ = this.borrowedBooks.asObservable()

  //Check if user has borrowed already a book. An user can borrow only one book once
  userHasBorrowedBooks = false;

  constructor(private http: HttpClient) { }

  addBorrow(borrowedBook: BorrowedBook) {

    return this.http.post<BorrowedBook>(this.baseUrl + 'borrows', borrowedBook);

  }

  extendBorrow(id: string, newDate: Date) {

    return this.http.put<string>(this.baseUrl + 'borrows', { id, newDate })

  }

  returnBorrowedBook(id: string, newDate: Date) {

    this.userHasBorrowedBooks = false;
    return this.http.put(this.baseUrl + "borrows/returnBook", { id, newDate });

  }

  setHasBorrowedBooks(status: boolean) {

    this.userHasBorrowedBooks = status;
  }

  getBorrowedBooks(userId: string) {

    this.userHasBorrowedBooks = false;

    this.http.get<Borrow[]>(this.baseUrl + 'borrows').subscribe({

      next: (list) => {

        if (userId != '') {

          this.borrowedBooks.next(list.filter(book => book.appUser.id == userId))

        }
        else
          this.borrowedBooks.next(list)

        list.forEach(bb => {

          bb.startDate = new Date(bb.startDate + 'Z')
          bb.endDate = new Date(bb.endDate + 'Z')

        })

      }
    })

  }

  isBookBorrowed(bookId: string) {

    return this.http.get<boolean>(this.baseUrl + `borrows/isBookBorrowed/${bookId}`);
  }

}
