import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Book } from 'src/app/_models/Book';
import { BookService } from 'src/app/_services/book.service';
import { NgxSpinnerService } from "ngx-spinner";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})

export class BookCardComponent implements OnInit {

  @Input() book: Book | undefined;

  bsModalRef: BsModalRef = new BsModalRef();
  title: string = ''
  message: string = '';
  bookId: string = ''
  public userRole: string = ''

  constructor(private router: Router, private bookService: BookService, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private modalService: BsModalService,
    private accountService: AccountService) { }

  ngOnInit(): void {

    //get the loged user role
    this.accountService.user$.subscribe({

      next: (user) => this.userRole = user!.role

    })


  }

  editBook(bookId: string) {

    this.router.navigateByUrl(`/books/edit/${bookId}`)

  }

  deleteBook(book: Book, template: TemplateRef<any>) {

    this.title = book.title
    this.message = 'Are you sure ?'
    this.bsModalRef = this.modalService.show(template);
    this.bookId = book.id;

  }

  confirm(): void {

    this.bsModalRef.hide()

    this.bookService.deleteBook(this.bookId).subscribe({

      next: () => {

        this.toastr.success("The book was successfully deleted")
        this.bookService.getBooks();
      },

      error: (error) => this.toastr.error(error.error)
    })
  }


  decline(): void {

    this.bsModalRef.hide()
  }
}
