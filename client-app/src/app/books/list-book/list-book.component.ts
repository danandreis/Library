import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/_models/Book';
import { BookService } from 'src/app/_services/book.service';
import { NgxSpinnerService } from "ngx-spinner";
import { LoginUser } from 'src/app/_models/User';
import { AccountService } from 'src/app/_services/account.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css']
})
export class ListBookComponent implements OnInit {

  searchTitleValue: string = '';
  searchAuthorValue: string = '';
  searchDomainValue: string = 'All domains';
  availableDomains: string[] = [];
  books: Book[] = []
  public user: LoginUser | undefined;


  constructor(private bookService: BookService, private spinner: NgxSpinnerService,
    private router: Router, private accountService: AccountService) { }

  ngOnInit(): void {

    this.spinner.show();

    this.availableDomains.push('All domains')

    //Extract books from database
    this.bookService.getBooks();
    this.bookService.getDomanis().subscribe({

      next: (domains) => {

        domains.map(d => this.availableDomains.push(d.domain))

      }
    })
    
    this.accountService.user$.pipe(take(1)).subscribe({

      next: (u) => this.user = u!

    })

    this.getBooksList('', '', 'All domains');
  }

  searchByTitle(event: any) {

    this.searchTitleValue = event.target.value;

    this.getBooksList(this.searchTitleValue, this.searchAuthorValue, this.searchDomainValue)

  }

  searchByAuthor(event: any) {

    this.searchAuthorValue = event.target.value;

    this.getBooksList(this.searchTitleValue, this.searchAuthorValue, this.searchDomainValue)

  }

  searchByDomain(event: any) {

    this.searchDomainValue = event.target.value;


    this.getBooksList(this.searchTitleValue, this.searchAuthorValue, this.searchDomainValue)

  }

    refreshBookList(event: boolean) {

    if (event) this.router.navigateByUrl('/', { skipLocationChange: true }).
      then(() => this.router.navigateByUrl('books/list'))
  }

  getBooksList(title: string, author: string, domain: string) {

    this.bookService.booksList$.subscribe({

      next: (list) => {

        if (title === '' && author === '') {

          this.books = (domain !== 'All domains') ? list.filter(b => b.bookDomain.domain == domain) : list

        } else {

          this.books = []

          list.forEach(book => {

            var regExTitle = RegExp(title, 'i');

            var resultTitle = regExTitle.test(book.title);

            var regExAuthor = RegExp(author, 'i');

            var resultAuthor = regExAuthor.test(book.author);

            if (resultTitle && resultAuthor &&
              (domain == 'All domains' || domain == book.bookDomain.domain)) {

              this.books.push(book)

            }

          })

        }

      }
    })

    this.spinner.hide()

    return this.books;
  }
}
