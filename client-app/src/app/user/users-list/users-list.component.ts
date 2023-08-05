import { HttpClient, HttpContext } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewPassord } from 'src/app/_models/NewPassword';
import { User } from 'src/app/_models/User';
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

  constructor(private http: HttpClient, public adminService: AdminService, private router: Router, private toastr: ToastrService) { }

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

        }

      }

    )

  }

  editUser(id: string) {

    this.router.navigate(['user/details/', id])
  }


  resetPassword(id: string) {

    var newPassword: NewPassord = {} as NewPassord;

    newPassword.userId = id;
    newPassword.password = 'Password_1234'
    newPassword.changedByUser = false;

    this.adminService.resetPassword(newPassword).subscribe({

      next: () => this.toastr.success("The password was successfully reseted!"),
      error: (error) => this.toastr.error(error.error)
    })


  }

}

