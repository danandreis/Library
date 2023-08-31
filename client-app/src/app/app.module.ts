import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserBooksComponent } from './books/user-books/user-books.component';
import { EditBookComponent } from './books/edit-book/edit-book.component';
import { NewBookComponent } from './books/new-book/new-book.component';
import { DetailsComponent } from './user/details/details.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersListComponent } from './user/users-list/users-list.component';
import { ToastrModule } from 'ngx-toastr';
import { BorrowsComponent } from './books/borrows/borrows.component';
import { ReservationsComponent } from './books/reservations/reservations.component';
import { ListBookComponent } from './books/list-book/list-book.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { BookCardComponent } from './books/book-card/book-card.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ModalModule } from 'ngx-bootstrap/modal';
import { EditComponent } from './user/edit/edit.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ListBookComponent,
    UserBooksComponent,
    EditBookComponent,
    NewBookComponent,
    DetailsComponent,
    RegistrationComponent,
    LoginComponent,
    BorrowsComponent,
    ReservationsComponent,
    UsersListComponent,
    BorrowsComponent,
    ReservationsComponent,
    ListBookComponent,
    EditBookComponent,
    NewBookComponent,
    ListBookComponent,
    ResetPasswordComponent,
    BookCardComponent,
    EditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    NgxSpinnerModule.forRoot({
      type: 'timer'
    }),
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
