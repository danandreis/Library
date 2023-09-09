import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
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

  intervalMaxDate = new Date();

  bsModalRef: BsModalRef = new BsModalRef();
  bsDateTimeConfig?: Partial<BsDatepickerConfig>

  searchUserName = '';
  searchStartDate = new Date('01/01/1970');
  searchEndDate = new Date('01/01/2100')
  searchReturned = false;

  constructor(private router: Router, private accountService: AccountService, private spinner: NgxSpinnerService, public modalService: BsModalService, private borrowService: BorrowService,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.spinner.show();

    this.accountService.user$.pipe(take(1)).subscribe({

      next: (u) => this.user = u!

    })

    if (this.user?.role == 'User')
      this.borrowService.getBorrowedBooks(this.user!.id);
    else
      this.borrowService.getBorrowedBooks('');

    this.displayBorrowedBooks(this.searchUserName, this.searchStartDate, this.searchEndDate!, this.searchReturned);

  }

  displayBorrowedBooks(userName: string, startDate: Date, endDate: Date, returned: boolean) {

    this.borrowService.borrowedBooks$.subscribe({

      next: (list) => {

        if (userName !== '') {

          this.booksList = []

          list.forEach(book => {

            var regexUserName = new RegExp(userName, 'i');
            var result = regexUserName.test(book.appUser.name)

            if (result)
              this.booksList.push(book)

          })

          if (returned) this.booksList = this.booksList.filter(b => b.returnDate != null)

          this.booksList = this.booksList.filter(b => (new Date(b.startDate!) >= new Date(startDate) &&
            (new Date(b.endDate!) <= new Date(endDate))))

        }
        else {

          this.booksList = list

          if (returned) this.booksList = this.booksList.filter(b => b.returnDate != null)

          this.booksList = this.booksList.filter(b => (new Date(b.startDate!) >= new Date(startDate) &&
            (new Date(b.endDate!) <= new Date(endDate))))

        }


        this.booksList.forEach(bb => {

          if (bb.returnDate == null) {
            
            var today = new Date()

            if (bb.endDate! < today)
              bb.delayTime = this.getDelayedTime(today, bb.endDate!)

          }

        })
      }
    })

    this.spinner.hide();

    return this.booksList

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

  searchByUserName(event: any) {

    this.searchUserName = event.target.value;
    this.displayBorrowedBooks(this.searchUserName, this.searchStartDate, this.searchEndDate!, this.searchReturned);

  }

  searchByStartDate(event: any) {

    if (event == undefined)
      this.searchStartDate = new Date('01/01/1970')
    else
      this.searchStartDate = new Date(event);

    this.displayBorrowedBooks(this.searchUserName, this.searchStartDate, this.searchEndDate!, this.searchReturned);

  }

  searchByEndDate(event: any) {

    if (event == undefined)
      this.searchEndDate = new Date('01/01/2100')
    else
      this.searchEndDate = new Date(event);

    this.displayBorrowedBooks(this.searchUserName, this.searchStartDate, this.searchEndDate!, this.searchReturned);

  }

  searchByStatus(event: any) {

    this.searchReturned = event.target.checked
    this.displayBorrowedBooks(this.searchUserName, this.searchStartDate, this.searchEndDate!, this.searchReturned);

  }
}
