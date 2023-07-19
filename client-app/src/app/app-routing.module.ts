import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { BooksListComponent } from './books/books-list/books-list.component';
import { NewBookComponent } from './books/new-book/new-book.component';
import { EditBookComponent } from './books/edit-book/edit-book.component';
import { RegistrationComponent } from './user/registration/registration.component'
import { UserBooksComponent } from './books/user-books/user-books.component';
import { DetailsComponent } from './user/details/details.component';
import { LeasedBooksListComponent } from './books/leased-books-list/leased-books-list.component';
import { UsersListComponent } from './user/users-list/users-list.component';

const routes: Routes = [

  { path: '', component: LoginComponent },
  { path: 'books/list', component: BooksListComponent },
  { path: 'books/new', component: NewBookComponent },
  { path: 'books/edit/:id', component: EditBookComponent },
  { path: 'books/myBooks', component: UserBooksComponent },     //Leased books by a specified client
  { path: 'books/leased', component: LeasedBooksListComponent }, //Leased books by all the clients
  { path: 'user/registration', component: RegistrationComponent },
  { path: 'user/details/:id', component: DetailsComponent },
  { path: 'user/users-list', component: UsersListComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
