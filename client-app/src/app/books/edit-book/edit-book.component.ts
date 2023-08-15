import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Book } from 'src/app/_models/Book';
import { BookDomain } from 'src/app/_models/BookDomain';
import { BookLanguage } from 'src/app/_models/BookLanguage';
import { BookType } from 'src/app/_models/BookType';
import { BookService } from 'src/app/_services/book.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {

  timer: any;
  bookDB: Book | null = null;
  bookId: string | null = null;
  showContent: boolean = false;
  availableDomains: BookDomain[] = [];
  availableBookTypes: BookType[] = [];
  availableLanguages: BookLanguage[] = [];
  editBookForm: FormGroup = new FormGroup({})

  constructor(private bookService: BookService, private routeParams: ActivatedRoute, private router: Router,
    private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.spinner.show()
    
    this.routeParams.paramMap.subscribe({

      next: (params) => {

        this.bookId = params.get('id')

        if (this.bookId != null) {

          this.timer = setInterval(() => this.EditBookFormValues(), 500)

        }
      }

    })

  }

  initializeEditBookForm(book: Book) {

    this.editBookForm = new FormGroup({

      title: new FormControl(book.title, [Validators.required, this.validateEmptyField(), Validators.minLength(3)]),
      author: new FormControl(book.author, [Validators.required, this.validateEmptyField(),]),
      publisher: new FormControl(book.publisher, [Validators.required, this.validateEmptyField(),]),
      year: new FormControl(book.year, [Validators.required, Validators.pattern('^(\\d){4}$'),
      Validators.max(new Date().getFullYear())]),
      pages: new FormControl(book.pages, [Validators.required, Validators.min(1), this.validateNumber()]),
      isbn: new FormControl(book.isbn, [Validators.required, Validators.pattern('^(\\d){7}$')]),
      bookDomainId: new FormControl(book.bookDomain.id, [Validators.required]),
      bookLanguageId: new FormControl(book.bookLanguage.id, [Validators.required]),
      bookTypeId: new FormControl(book.bookType.id, [Validators.required]),
      description: new FormControl(book.description, [Validators.required, this.validateEmptyField(),])

    })

  }

  //Check if control is empty
  validateEmptyField(): ValidatorFn {

    return (control: AbstractControl) => {

      return (control.value.trim().length != 0) ? null : { notEmpty: true }
    }

  }

  //Check if pages is NaN
  validateNumber(): ValidatorFn {

    return (control: AbstractControl) => {

      return !isNaN(control.value) ? null : { notNumber: true }

    }
  }

  //Read information fron form: Domains, Types and Languages
  EditBookFormValues() {


    this.bookService.getDomanis().subscribe({

      next: (domains) => this.availableDomains = domains

    })

    this.bookService.getLanguages().subscribe({

      next: (languages) => this.availableLanguages = languages,

    })

    this.bookService.getBookFormats().subscribe({

      next: (bookTypes) => this.availableBookTypes = bookTypes,
    })

    if (this.availableDomains.length != 0 && this.availableLanguages.length != 0
      && this.availableBookTypes.length != 0) {

      clearTimeout(this.timer);
      this.getBookInfo();

    }

  }

  getBookInfo() {

    this.bookService.getBook(this.bookId!).subscribe({

      next: (response) => {

        if (response) this.bookDB = response

      },
      error: (error) => {

        this.toastr.error(error.error);
        this.router.navigateByUrl('books/list');

      },
      complete: () => {

        this.initializeEditBookForm(this.bookDB!)
        this.spinner.hide();
        this.showContent = true;

      }

    })
  }

  updatebook(book: Book) {

    book.id = this.bookDB!.id;
    this.bookService.updateBookDetails(book).subscribe({

      next: () => {

        this.toastr.success('The book details were successfully updated')
        this.router.navigateByUrl('books/list')

      },

      error: (error) => this.toastr.error(error.error)

    })

  }



  cancelEditBook() {

    this.router.navigateByUrl('books/list');
  }

}
