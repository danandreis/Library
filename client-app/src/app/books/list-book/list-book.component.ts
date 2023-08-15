import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/_models/Book';
import { BookService } from 'src/app/_services/book.service';
import { NgxSpinnerService } from "ngx-spinner";
import { BehaviorSubject } from 'rxjs';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css']
})
export class ListBookComponent implements OnInit {


  books: Book[] = []


  constructor(private bookService: BookService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.spinner.show();

    //Extract books from database
    this.bookService.getBooks();

    this.getBooksList();
  }

  getBooksList() {

    this.bookService.booksList$.subscribe({

      next: (list) => this.books = list
    })

    this.spinner.hide()

    return this.books;
  }



}
