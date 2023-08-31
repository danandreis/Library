import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Book } from 'src/app/_models/Book';
import { BookService } from 'src/app/_services/book.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccountService } from 'src/app/_services/account.service';
import { BorrowedBook } from 'src/app/_models/BorrowedBook';
import { take } from 'rxjs';
import { BorrowService } from 'src/app/_services/borrow.service';
import { LoginUser } from 'src/app/_models/User';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})

export class BookCardComponent implements OnInit {

  @Input() book: Book | undefined;
  @Output() newBorrow = new EventEmitter();

  borrowedBook: BorrowedBook | undefined;
  bsModalRef: BsModalRef = new BsModalRef();
  title: string = ''
  author: string = '';

  // Start date = next day the book is selected
  startBorrowDate: Date | undefined = undefined;
  endBorrowDate: Date | undefined = undefined;

  message: string = '';
  bookId: string = ''
  user: LoginUser | undefined

  constructor(private router: Router, private bookService: BookService, private toastr: ToastrService,
    private modalService: BsModalService, private accountService: AccountService, public borrowService: BorrowService) {

    this.borrowedBook = {
      id: '',
      bookId: '',
      book: null,
      appUserId: '',
      appUser: null,
      startDate: new Date(),
      endDate: new Date(),
      returnDate: null,
      delayTime: 0,
      extended: 0

    }

  }

  ngOnInit(): void {

    //get the loged user role
    this.accountService.user$.pipe(take(1)).subscribe({

      next: (user) => this.user = user!

    })

    this.book!.bookBorrows = this.book?.bookBorrows.filter(bb => bb.returnDate == null)!;

    if (this.user?.role == 'User' && this.book?.bookBorrows.length != 0) {

      if (this.book!.bookBorrows[0]?.appUser?.id == this.user?.id) {

        this.book!.isBorrowedByUser = true;
        this.borrowService.userHasBorrowedBooks = true;
        this.book!.isBorrowedByOther = false;

      }
      else {

        this.book!.isBorrowedByUser = false;
        this.book!.isBorrowedByOther = true;

      }

    }
    else {

      this.book!.isBorrowedByUser = false;
      this.book!.isBorrowedByOther = false;

    }

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

  borrowBook(book: Book, template: TemplateRef<any>) {


    this.title = book.title;
    this.author = book.author;
    this.message = 'Please confirm!'
    this.startBorrowDate = new Date(new Date().setDate(new Date().getDate() + 1));
    this.endBorrowDate = new Date();

    //Check if startDate is a working day. if not, the first working day will be set as startdate
    if (this.startBorrowDate.getDay() == 0)
      this.startBorrowDate.setDate(this.startBorrowDate.getDate() + 1)

    if (this.startBorrowDate.getDay() == 6)
      this.startBorrowDate.setDate(this.startBorrowDate.getDate() + 2)

    //Check if endDate is a working day. if not, the first working day will be set as startdate
    this.endBorrowDate.setDate(new Date().getDate() + 14);

    if (this.endBorrowDate.getDay() == 0)
      this.endBorrowDate.setDate(this.endBorrowDate.getDate() + 1)

    if (this.endBorrowDate.getDay() == 6)
      this.endBorrowDate.setDate(this.endBorrowDate.getDate() + 2)

    this.bsModalRef = this.modalService.show(template);
    this.bookId = book.id;


  }

  confirmDeletion(): void {

    this.bsModalRef.hide()

    this.bookService.deleteBook(this.bookId).subscribe({

      next: () => {

        this.toastr.success("The book was successfully deleted")
        this.bookService.getBooks();
      },

      error: (error) => this.toastr.error(error.error)
    })
  }


  declineDeletion(): void {

    this.bsModalRef.hide()
  }

  confirmBorrow(): void {

    this.borrowedBook!.bookId = this.bookId;
    this.accountService.user$.pipe(take(1)).subscribe({

      next: (user) => this.borrowedBook!.appUserId = user!.id

    })


    this.borrowedBook!.startDate = this.startBorrowDate!;
    this.borrowedBook!.endDate = this.endBorrowDate!;
    this.borrowedBook!.returnDate = null;
    this.borrowedBook!.delayTime = 0;

    this.bsModalRef.hide();

    this.borrowService.addBorrow(this.borrowedBook!).subscribe({


      next: () => this.toastr.success(`The borrow process has been successfully completed`),

      error: (error) => this.toastr.error(error.error)

    })
    this.borrowService.userHasBorrowedBooks = true;

    this.newBorrow.emit(true);

  }

  declineBorrow(): void {

    this.bsModalRef.hide();

  }
}
