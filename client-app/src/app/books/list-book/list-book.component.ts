import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/_models/Book';
import { BookService } from 'src/app/_services/book.service';

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css']
})
export class ListBookComponent implements OnInit {

  booksList: Book[] = []
  constructor(private bookService: BookService) { }

  ngOnInit(): void {

    this.bookService.getBooks().subscribe({

      next: (list) => {

        this.booksList = list

      }

    })
  }

}
