import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { NewBookComponent } from './books/new-book/new-book.component';
import { EditBookComponent } from './books/edit-book/edit-book.component';
import { RegistrationComponent } from './user/registration/registration.component'
import { UserBooksComponent } from './books/user-books/user-books.component';
import { DetailsComponent } from './user/details/details.component';
import { UsersListComponent } from './user/users-list/users-list.component';
import { AuthGuardGuard } from './_guards/auth-guard.guard';
import { AdminGuard } from './_guards/admin.guard';
import { BorrowsComponent } from './books/borrows/borrows.component';
import { ReservationsComponent } from './books/reservations/reservations.component';
import { ListBookComponent } from './books/list-book/list-book.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { EditComponent } from './user/edit/edit.component';

const routes: Routes = [

  { path: '', component: LoginComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuardGuard],
    children: [

      { path: 'books/new', component: NewBookComponent },
      { path: 'books/edit/:id', component: EditBookComponent },
      { path: 'books/borrowed', component: BorrowsComponent },                  //Borrowed books component
      { path: 'books/reservations', component: ReservationsComponent },         //Reserved books component
      { path: 'books/list', component: ListBookComponent },                     //List of all books available
      
      { path: 'user/edit/:id', component: EditComponent },                          // Edit user acoount info
      { path: 'user/reset-password/:id', component: ResetPasswordComponent },        //Reset of user password

      { path: 'admin/users-list', component: UsersListComponent, canActivate: [AdminGuard] },
      { path: 'user/registration', component: RegistrationComponent, canActivate: [AdminGuard] } //Registration of a new user 

    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
