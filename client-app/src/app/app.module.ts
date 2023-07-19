import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BooksListComponent } from './books/books-list/books-list.component';
import { UserBooksComponent } from './books/user-books/user-books.component';
import { EditBookComponent } from './books/edit-book/edit-book.component';
import { NewBookComponent } from './books/new-book/new-book.component';
import { DetailsComponent } from './user/details/details.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { LeasedBooksListComponent } from './books/leased-books-list/leased-books-list.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersListComponent } from './user/users-list/users-list.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    BooksListComponent,
    UserBooksComponent,
    EditBookComponent,
    NewBookComponent,
    DetailsComponent,
    RegistrationComponent,
    LoginComponent,
    LeasedBooksListComponent,
    UsersListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass:'toast-bottom-right'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
