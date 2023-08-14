import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewPassord } from 'src/app/_models/NewPassword';
import { User } from 'src/app/_models/User';
import { AccountService } from 'src/app/_services/account.service';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: User[] = [];
  userRole: string = 'All'
  valueToSearch: string = ''

  constructor(public adminService: AdminService, public accountService: AccountService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.adminService.getUsers()

    this.getUsersList('', this.userRole);

  }

  searchByValue(event: any) {

    this.valueToSearch = event.target.value
    this.getUsersList(this.valueToSearch, this.userRole);

  }

  selectRole(event: any) {

    this.userRole = event.target.value;
    this.getUsersList(this.valueToSearch, this.userRole);

  }

  getUsersList(value: string, role: string) {

    this.adminService.usersList$.subscribe(
      {

        next: (list) => {

          list.forEach(user => user.registrationEnds = this.setregistrationEnd(user))

          if (value !== '') {

            this.users = [];

            list.forEach(user => {

              var regEx = new RegExp(value, 'i');

              var result = regEx.test(user.name);

              if (result && (role === 'All' || user.role == role))
                this.users.push(user);

            })

          }
          else {

            this.users = (role !== 'All') ? list.filter(u => u.role == role) : list

          }

          return this.users;

        },

      }

    )

  }

  setregistrationEnd(user: User) {


    var newDate = new Date(user.registrationDate);

    if (user.subscription != null) {

      switch (user.subscription.type) {

        case 'Monthly':
          newDate = new Date(newDate.setDate(newDate.getDate() + 30))
          break;

        case 'Quarterly':
          newDate = new Date(newDate.setDate(newDate.getDate() + 90))
          break;

        case 'Semestrial':
          newDate = new Date(newDate.setDate(newDate.getDate() + 180))
          break;

        case 'Annualy':
          newDate = new Date(newDate.setDate(newDate.getDate() + 365))
          break;
      }

    }
    else {

      newDate = new Date(Date.now());
      newDate = new Date(newDate.setDate(newDate.getDate() + 3650))

    }

    if (new Date(newDate) < new Date())
      user.accessFailedCount = 3;

    return newDate
  }


  editUser(id: string) {

    this.router.navigate(['user/details/', id])
  }

  resetPassword(id: string) {

    var newPassword: NewPassord = {} as NewPassord;

    newPassword.userId = id;
    newPassword.password = 'Password_1234'
    newPassword.changedByUser = false;

    this.accountService.resetPassword(newPassword).subscribe({

      next: () => this.toastr.success("The password was successfully reseted!"),
      error: (error) => this.toastr.error(error.error)
    })
  }

  blockUser(user: User) {

    this.adminService.blockUser(user).subscribe({

      next: () => {

        this.toastr.success("The user has been successfully blocked");
        this.adminService.getUsers();
        this.getUsersList(this.valueToSearch, this.userRole);
      },
      error: (error) => this.toastr.error(error.error)
    })

  }

  unblockUser(user: User) {


    this.adminService.unblockUser(user).subscribe({

      next: () => {

        this.toastr.success("The user has been successfully unblocked");
        this.adminService.getUsers();
        this.getUsersList(this.valueToSearch, this.userRole);
      },

      error: (error) => this.toastr.error(error.error)
    })

  }

}

