import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Book } from 'src/app/_models/Book';
import { Borrow } from 'src/app/_models/Borrow';
import { LoginUser } from 'src/app/_models/User';
import { AccountService } from 'src/app/_services/account.service';
import { BorrowService } from 'src/app/_services/borrow.service';

@Component({
  selector: 'app-borrows',
  templateUrl: './borrows.component.html',
  styleUrls: ['./borrows.component.css']
})
export class BorrowsComponent implements OnInit {

  booksList: Borrow[] = []
  user: LoginUser | undefined
  book: Book | undefined

  title: string = ''
  author: string = ''
  message: string = ''
  extendDateEnd: Date = new Date();
  selectedborrowId: string = '';
  endborrowDate: Date = new Date();

  bsModalRef: BsModalRef = new BsModalRef();

  constructor(private router: Router, private accountService: AccountService, private spinner: NgxSpinnerService, public modalService: BsModalService, private borrowService: BorrowService,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.spinner.show();

    this.accountService.user$.pipe(take(1)).subscribe({

      next: (u) => this.user = u!

    })

    this.displayBorrowedBooks();

  }

  displayBorrowedBooks() {

    this.borrowService.getBorrowedBooks().subscribe({

      next: (list) => {

        if (this.user?.role == 'User')
          this.booksList = list.filter(borrow => borrow.appUser.id == this.user?.id);
        else
          this.booksList = list;

        this.booksList.forEach(bb => {

          bb.startDate = new Date(bb.startDate + 'Z')
          bb.endDate = new Date(bb.endDate + 'Z')

          if (bb.returnDate != null)
            bb.returnDate = new Date(bb.returnDate + 'Z')

          var today = new Date()

          if (bb.endDate < today)
            bb.delayTime = this.getDelayedTime(today, bb.endDate)
        })
      },
      complete: () => {

        this.spinner.hide();

        return this.booksList

      }
    })

  }

  getDelayedTime(date1: Date, date2: Date) {

    var diff = (date1.getTime() - date2.getTime()) / 1000;
    return Math.round(diff / (3600 * 24))
  }

  extend(borrowedBook: Borrow, template: TemplateRef<any>) {

    this.title = borrowedBook.title;
    this.author = borrowedBook.author;

    this.selectedborrowId = borrowedBook.id;

    this.extendDateEnd.setDate(borrowedBook.endDate!.getDate());
    this.extendDateEnd!.setDate(this.extendDateEnd!.getDate()! + 7);

    this.bsModalRef = this.modalService.show(template);

  }

  confirmBorrowExtension() {

    this.borrowService.extendBorrow(this.selectedborrowId, this.extendDateEnd!).subscribe({

      next: () => {

        this.toastr.success(`The borrow has been succesfully extended!`)

        window.location.reload();
      },
      error: (error) => {
        this.toastr.error(error.error)
      }

    })

  }

  returnBook(borrow: Borrow) {

    var returnDate = new Date();

    this.borrowService.returnBorrowedBook(borrow.id, returnDate).subscribe({

      next: () => {

        this.toastr.success(`The book has been succesfully returned`)

        this.router.navigateByUrl('/', { skipLocationChange: true }).
          then(() => this.router.navigateByUrl('books/borrowed'))

      },
      error: (error) => this.toastr.error(error.error)

    })

  }
}
