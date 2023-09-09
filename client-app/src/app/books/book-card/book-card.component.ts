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
import { ReservedBook } from 'src/app/_models/ReservedBook';
import { ReserveService } from 'src/app/_services/reserve.service';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})

export class BookCardComponent implements OnInit {

  @Input() book: Book | undefined;
  @Output() newBorrow = new EventEmitter();
  @Output() newReservation = new EventEmitter();

  borrowedBook: BorrowedBook | undefined;
  reservedBook: ReservedBook | undefined;

  bsModalRef: BsModalRef = new BsModalRef();
  title: string = ''
  author: string = '';

  // Start date = next day the book is selected
  startBorrowDate: Date | undefined = undefined;
  endBorrowDate: Date | undefined = undefined;

  startReservationDate: Date | undefined = undefined;
  endReservationDate: Date | undefined = undefined;
  reservationsCount: number = 0;

  message: string = '';
  bookId: string = ''
  user: LoginUser | undefined

  constructor(private router: Router, private bookService: BookService, private toastr: ToastrService,
    private modalService: BsModalService, private accountService: AccountService, public borrowService: BorrowService,
    public reserveService: ReserveService) {

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

    this.reservedBook = {
      id: '',
      bookId: '',
      title: '',
      author: '',
      appUserId: '',
      appUser: null,
      startDate: new Date(),
      endDate: new Date()

    }

  }

  ngOnInit(): void {

    //get the loged user role
    this.accountService.user$.pipe(take(1)).subscribe({

      next: (user) => this.user = user!

    })

    //Check books reserved by logged in user or by other user
    this.book!.bookBorrows = this.book?.bookBorrows.filter(bb => bb.returnDate == null)!;

    if (this.user?.role == 'User') {

      if (this.book?.bookBorrows.length == 0) {

        this.book!.isBorrowedByUser = false;
        this.book!.isBorrowedByOther = false;

      }
      else {
        var userBorrows = this.book?.bookBorrows.filter(b => b.appUser?.id == this.user?.id);

        if (userBorrows?.length == 1) {

          this.book!.isBorrowedByUser = true;
          this.borrowService.userHasBorrowedBooks = true;
          this.book!.isBorrowedByOther = false;

        }
        else {

          this.book!.isBorrowedByUser = false;
          this.book!.isBorrowedByOther = true;

        }
      }

    }

    //Check books reserved by User
    if (this.user?.role == 'User') {


      if (this.book?.bookReservations.length == 0) {

        this.book.isReservedByUser = false;
        this.book.isReservedByOther = false;

      }
      else {

        var userReservations = this.book?.bookReservations.filter(b => b.appUser?.id == this.user?.id)

        if (userReservations?.length! == 1) {

          this.book!.isReservedByUser = true;
          this.book!.isReservedByOther = false;
          this.reserveService.userHasReservedBooks = true;

        }
        else {

          this.book!.isReservedByUser = false;
          this.book!.isReservedByOther = true;

        }
      }

    }

  }

  editBook(bookId: string) {

    this.router.navigateByUrl(`/books/edit/${bookId}`)

  }

  deleteBook(book: Book, template: TemplateRef<any>) {


    if (book.bookReservations.length != 0 || book.bookBorrows.length != 0) {

      this.toastr.error("You can not delete a reserved or borrowed book!")

    }
    else {

      this.title = book.title
      this.message = 'Are you sure ?'
      this.bsModalRef = this.modalService.show(template);
      this.bookId = book.id;

    }

  }

  borrowBook(book: Book, template: TemplateRef<any>) {

    this.title = book.title;
    this.author = book.author;
    this.message = 'Please confirm!'
    this.startBorrowDate = new Date(new Date().setTime(new Date().getTime() + (1000 * 60 * 60 * 24)));
    this.endBorrowDate = new Date();

    //Check if startDate is a working day. if not, the first working day will be set as startdate
    if (this.startBorrowDate.getDay() == 0)
      this.startBorrowDate.setTime(new Date(this.startBorrowDate).getTime() + (1000 * 60 * 60 * 24))

    if (this.startBorrowDate.getDay() == 6)
      this.startBorrowDate.setTime(new Date(this.startBorrowDate).getTime() + (1000 * 60 * 60 * 48))

    //Check if endDate is a working day. if not, the first working day will be set as startdate
    this.endBorrowDate.setTime(new Date().setTime(new Date().getTime() + (1000 * 60 * 60 * 24 * 14)));

    if (this.endBorrowDate.getDay() == 0)
      this.endBorrowDate.setTime(new Date(this.endBorrowDate).getTime() + (1000 * 60 * 60 * 24))

    if (this.endBorrowDate.getDay() == 6)
      this.endBorrowDate.setTime(new Date(this.endBorrowDate).getTime() + (1000 * 60 * 60 * 48))

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

  reserveBook(book: Book, template: TemplateRef<any>) {

    this.title = book.title;
    this.author = book.author;
    this.message = 'Please confirm!'
    this.startReservationDate = new Date();
    this.endReservationDate = new Date();

    if (book.bookReservations.length != 0) {

      this.reservationsCount = book.bookReservations.length;

      var reservationsOrderByDate = book.bookReservations.sort((a, b) => {

        if (a.endDate > b.endDate)
          return 1
        else
          return -1

      })

      this.startReservationDate.setTime(new Date(reservationsOrderByDate.at(0)!.endDate).getTime() + (1000 * 60 * 60 * 24))

    }
    else {

      if (book.bookBorrows.length != 0) {

        var activeBorrow = book.bookBorrows.filter(b => b.returnDate == null);

        this.startReservationDate.setTime(new Date(activeBorrow.at(0)!.endDate).getTime() + (1000 * 60 * 60 * 24))

      }
      else {

        this.startReservationDate!.setTime(new Date().getTime() + (1000 * 60 * 60 * 24))

      }

    }

    if (this.startReservationDate!.getDay() == 0)
      this.startReservationDate!.setTime(new Date(this.startReservationDate!).getTime() + (1000 * 60 * 60 * 24))

    if (this.startReservationDate!.getDay() == 6)
      this.startReservationDate!.setTime(new Date(this.startReservationDate!).getTime() + (1000 * 60 * 60 * 48))

    this.endReservationDate!.setTime(new Date(this.startReservationDate!).getTime() + (1000 * 60 * 60 * 24 * 7));

    this.bsModalRef = this.modalService.show(template);

    this.bookId = book.id;


    // this.reserveService.checkReservation(book.id).subscribe({

    //   next: (reservations) => {

    //     if (reservations.length != 0) {

    //       this.reservationsCount = reservations.length;
    //       //this.startReservationDate!.setDate(new Date(reservations.at(0)!.endDate).getDate() + 1)

    //     }

    //   },

    //   complete: () => {



    //     if (this.startReservationDate!.getDay() == 0)
    //       this.startReservationDate!.setDate(this.startReservationDate!.getDate() + 1)

    //     if (this.startReservationDate!.getDay() == 6)
    //       this.startReservationDate!.setDate(this.startReservationDate!.getDate() + 2)

    //     this.endReservationDate!.setDate(this.startReservationDate!.getDate() + 7);

    //     this.bsModalRef = this.modalService.show(template);

    //     this.bookId = book.id;

    //   }

    // })

  }

  confirmReservation(): void {

    this.reservedBook!.bookId = this.bookId;
    this.reservedBook!.appUserId = this.user?.id!;
    this.reservedBook!.startDate = this.startReservationDate!;
    this.reservedBook!.endDate = this.endReservationDate!;

    this.bsModalRef.hide();

    this.reserveService.addReservation(this.reservedBook!).subscribe({

      next: () => this.toastr.success("The reservation has been registered successfully!"),
      error: (error) => this.toastr.error(error.error)

    })

    this.newReservation.emit(true);


  }
}
