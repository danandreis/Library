import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Book } from 'src/app/_models/Book';
import { LoginUser } from 'src/app/_models/User';
import { AccountService } from 'src/app/_services/account.service';
import { BookService } from 'src/app/_services/book.service';
import { BorrowService } from 'src/app/_services/borrow.service';

@Component({
  selector: 'app-user-books',
  templateUrl: './user-books.component.html',
  styleUrls: ['./user-books.component.css']
})
export class UserBooksComponent implements OnInit {

  listType = '';
  booksList: Book[] = []
  user: LoginUser | undefined
  book: Book | undefined

  title: string = ''
  author: string = ''
  message: string = ''
  extendDateEnd: Date = new Date();
  selectedborrowId: string = '';
  endborrowDate: Date = new Date();

  bsModalRef: BsModalRef = new BsModalRef();

  constructor(private routeparams: ActivatedRoute, private bookService: BookService, private router: Router,
    private accountService: AccountService, private spinner: NgxSpinnerService, public modalService: BsModalService,
    private borrowService: BorrowService, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.spinner.show();

    this.routeparams.queryParamMap.subscribe(({

      next: (params) => this.listType = params.get('type')!

    }))

    if (this.listType !== 'borrowed' && this.listType !== 'reserved')
      this.router.navigateByUrl('/books/list')

    if (this.listType == 'borrowed')

      this.accountService.user$.pipe(take(1)).subscribe({

        next: (u) => this.user = u!

      })

    this.bookService.getBooks();
    this.displayBorrowedBooks();

  }

  displayBorrowedBooks() {

    this.bookService.booksList$.subscribe({

      next: (list) => {

        list.forEach(book => {

          if (book.bookBorrows != undefined) {

            book.bookBorrows.forEach(borrow => {

              if (borrow.appUser?.id == this.user?.id) {

                book.bookBorrows.forEach(bb => {

                  bb.startDate = new Date(bb.startDate + 'Z')
                  bb.endDate = new Date(bb.endDate + 'Z')

                  var today = new Date()

                  if (bb.endDate < today)
                    bb.delayTime = this.getDelayedTime(today, bb.endDate)
                })

                this.booksList.push(book)
              }
            })
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

  extend(book: Book, template: TemplateRef<any>) {

    this.title = book.title;
    this.author = book.author;

    this.selectedborrowId = book.bookBorrows.filter(bb => bb.returnDate == null).at(0)?.id!;

    this.extendDateEnd = book.bookBorrows.filter(bb => bb.returnDate == null).at(0)?.endDate!;
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

  // returnBook(book: Book) {

  //   var selectedborrow = book.bookBorrows.filter(bb => bb.returnDate == null).at(0);
  //   var returnDate = new Date();

  //   this.borrowService.returnBorrowedBook(selectedborrow!.id!, returnDate).subscribe({

  //     next: () => {

  //       this.toastr.success(`The book has been succesfully returned`)

  //       window.location.reload();

  //     },
  //     error: (error) => this.toastr.error(error.error)

  //   })

  // }
}
