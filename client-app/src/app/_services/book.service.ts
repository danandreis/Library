import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookDomain } from '../_models/BookDomain';
import { BookLanguage } from '../_models/BookLanguage';
import { BookType } from '../_models/BookType';
import { Book } from '../_models/Book';
import { BehaviorSubject } from 'rxjs';
import { BorrowService } from './borrow.service';
import { BorrowedBook } from '../_models/BorrowedBook';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  booksList = new BehaviorSubject<Book[]>([]);
  booksList$ = this.booksList.asObservable();
  baseUrl = 'https://localhost:5001/api/'

  constructor(private http: HttpClient, private borrowService: BorrowService) { }

  getDomanis() {

    return this.http.get<BookDomain[]>(this.baseUrl + "books/domains");

  }

  getLanguages() {

    return this.http.get<BookLanguage[]>(this.baseUrl + 'books/languages');
  }

  getBookFormats() {

    return this.http.get<BookType[]>(this.baseUrl + 'books/bookTypes')
  }

  addNewBook(book: Book) {

    return this.http.post<Book>(this.baseUrl + 'books', book);
  }

  getBooks() {

    this.http.get<Book[]>(this.baseUrl + 'books').subscribe({

      next: (books) => this.booksList.next(books)

    });
  }

  getBook(id: string) {

    return this.http.get<Book>(this.baseUrl + `books/${id}`);
  }

  updateBookDetails(book: Book) {

    return this.http.put<Book>(this.baseUrl + 'books', book);
  }

  deleteBook(id: string) {

    return this.http.delete<Book>(this.baseUrl + `books/${id}`)

  }

}
