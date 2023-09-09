import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Book } from 'src/app/_models/Book';
import { BorrowedBook } from 'src/app/_models/BorrowedBook';
import { ReservedBook } from 'src/app/_models/ReservedBook';
import { LoginUser } from 'src/app/_models/User';
import { AccountService } from 'src/app/_services/account.service';
import { BorrowService } from 'src/app/_services/borrow.service';
import { ReserveService } from 'src/app/_services/reserve.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {


  user: LoginUser | undefined;
  reservationsList: ReservedBook[] = []
  availableBook = new Map<string, boolean>();
  borrowedBook: BorrowedBook | undefined = undefined;

  bsModalRef: BsModalRef = new BsModalRef();
  bookTitle = ''
  bookAuthor = ''

  lendStartDate: Date | null = new Date();
  lendEndDate: Date | null = new Date();

  reservationId = '';

  constructor(private reservationService: ReserveService, private accountService: AccountService,
    private spinner: NgxSpinnerService, private bsModalService: BsModalService, private toastr: ToastrService,
    private borrowService: BorrowService, private router: Router) { }

  ngOnInit(): void {

    this.spinner.show();

    this.accountService.user$.subscribe({

      next: (u) => this.user = u!
    })

    if (this.user?.role == 'User')
      this.borrowService.getBorrowedBooks(this.user!.id);

    this.displayReservedBooks();

  }

  displayReservedBooks() {

    this.reservationService.getReservations().subscribe({

      next: (list) => {

        if (this.user?.role == 'User') {

          this.reservationsList = list.filter(r => r.appUser?.id == this.user?.id)

          if (this.reservationsList.length > 0)
            this.reservationId = this.reservationsList.at(0)!.id;

        }

        else
          this.reservationsList = list;

        this.reservationsList.forEach(reservation => {

          reservation.startDate = new Date(reservation.startDate + 'Z')
          reservation.endDate = new Date(reservation.endDate + 'Z')


          //Check if start date for the reserved book is before the current date. If YES then the book can be 
          //borrowed
          var startDate = list.filter(b => (b.appUser?.id == this.user?.id) && (b.title == reservation.title)).
            at(0)?.startDate

          if (reservation.startDate < new Date())
            this.availableBook.set(reservation.id, true);
          else
            this.availableBook.set(reservation.id, false);


        })

      },
      complete: () => {

        this.spinner.hide();

        return this.reservationsList;

      }
    })
  }

  cancelReservation(book: ReservedBook, template: TemplateRef<any>) {

    this.bookTitle = book.title
    this.bookAuthor = book.author

    this.bsModalRef = this.bsModalService.show(template);

    //Register the book borrow in database

    //Cancel the reservation - delete from dfatabase
  }

  confirmCancelReservation() {

    this.bsModalRef.hide();

    this.reservationService.cancelReservation(this.reservationId).subscribe({

      next: () => this.toastr.success("The reservation has been successfully canceled!"),

      error: (error) => this.toastr.error(error.error),

      complete: () => {

        this.router.navigateByUrl('/', { skipLocationChange: true }).
          then(() => this.router.navigateByUrl('books/reservations'))
      }

    })
  }

  lendBook(reservedBook: ReservedBook, lendBookNotification: TemplateRef<any>) {

    this.bookTitle = reservedBook.title;
    this.bookAuthor = reservedBook.author;
    this.lendStartDate!.setTime(new Date().getTime());
    this.lendEndDate!.setTime(new Date(this.lendStartDate!).getTime() + (1000 * 60 * 60 * 24 * 14));

    if (this.lendEndDate!.getDay() == 0)
      this.lendEndDate!.setTime(new Date(this.lendEndDate!).getTime() + (1000 * 60 * 60 * 24));
    if (this.lendEndDate!.getDay() == 6)
      this.lendEndDate!.setTime(new Date(this.lendEndDate!).getTime() + (1000 * 60 * 60 * 24 * 2));

    this.bsModalRef = this.bsModalService.show(lendBookNotification);

    //generate the borrowedbook object to be added to databade
    this.borrowedBook = {

      id: '',
      bookId: reservedBook.bookId,
      book: null,
      appUserId: this.user!.id,
      appUser: null,
      startDate: new Date(this.lendStartDate!),
      endDate: new Date(this.lendEndDate!),
      returnDate: null,
      delayTime: 0,
      extended: 0
    }

    this.reservationId = reservedBook.id;

  }

  confirmLend() {

    this.bsModalService.hide();

    this.borrowService.addBorrow(this.borrowedBook!).subscribe({

      next: () => this.toastr.success('The book has been successfully lended!'),
      error: (error) => this.toastr.error(error.error),
      complete: () => {

        this.router.navigateByUrl('/', { skipLocationChange: true }).
          then(() => this.router.navigateByUrl('books/reservations'))
      }

    });

  }

  // borrowReservedBook(reservedBook: ReservedBook, template: TemplateRef<any>) {

  //   //Check if user has borrowed books. Only users that has no borrowed books can borrow books.
  //   var hasBorrows = false;
  //   this.borrowService.borrowedBooks$.subscribe({

  //     next: (list) => {

  //       if (list.filter(b => b.returnDate == null).length > 0)
  //         hasBorrows = true
  //     }
  //   })

  //   if (hasBorrows) {

  //     this.bsModalRef = this.bsModalService.show(template);

  //   }
  //   else {

  //     //A reseved book can be borrow if it is not borrow by other users
  //     this.toastr.success('Success!')
  //   }
  // }

}
