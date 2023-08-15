import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Book } from 'src/app/_models/Book';
import { BookDomain } from 'src/app/_models/BookDomain';
import { BookLanguage } from 'src/app/_models/BookLanguage';
import { BookType } from 'src/app/_models/BookType';
import { BookService } from 'src/app/_services/book.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.css']
})
export class NewBookComponent implements OnInit {

  newBookForm: FormGroup = new FormGroup({})
  public showContent: boolean = false;
  availableDomains: BookDomain[] = [];
  availableLanguages: BookLanguage[] = [];
  availableBookTypes: BookType[] = []
  timer: any;

  constructor(private bookService: BookService, private toastr: ToastrService, private router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.spinner.show();

    this.timer = setInterval(() => this.AddBookFormValues(), 300)

  }

  initializeAddBookForm() {

    this.newBookForm = new FormGroup({

      title: new FormControl('', [Validators.required, this.validateEmptyField(), Validators.minLength(3)]),
      author: new FormControl('', [Validators.required, this.validateEmptyField()]),
      publisher: new FormControl('', [Validators.required, this.validateEmptyField()]),
      year: new FormControl('2023', [Validators.required, Validators.pattern('^(\\d){4}$'),
      Validators.max(new Date().getFullYear())]),
      pages: new FormControl('', [Validators.required, Validators.min(1), this.validateNumber()]),
      isbn: new FormControl('', [Validators.required, Validators.pattern('^(\\d){7}$')]),
      bookDomainId: new FormControl(this.availableDomains.at(0)!.id, [Validators.required]),
      bookLanguageId: new FormControl(this.availableLanguages.at(0)!.id, [Validators.required]),
      bookTypeId: new FormControl(this.availableBookTypes.at(0)!.id, [Validators.required]),
      description: new FormControl('', [Validators.required, this.validateEmptyField()])

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
  AddBookFormValues() {


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

      this.spinner.hide()
      this.initializeAddBookForm();
      this.showContent = true;
      clearTimeout(this.timer);

    }

  }

  addBook(book: Book) {

    book.copies = 1;
    
    this.bookService.addNewBook(book).subscribe({

      next: () => {

        this.toastr.success("The book was successfully added to database!");
        this.router.navigateByUrl('books/list');

      },
      error: (error) => this.toastr.error(error.error)

    })

  }

  cancelAddBook() {

    this.router.navigateByUrl('books/list');
  }

}

