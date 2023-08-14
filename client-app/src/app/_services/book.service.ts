import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookDomain } from '../_models/BookDomain';
import { BookLanguage } from '../_models/BookLanguage';
import { BookType } from '../_models/BookType';
import { Book } from '../_models/Book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  baseUrl = 'https://localhost:5001/api/'

  constructor(private http: HttpClient) { }

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

    return this.http.post<Book>(this.baseUrl + 'books', book)
  }

  getBooks() {

    return this.http.get<Book[]>(this.baseUrl + 'books')
  }
}
