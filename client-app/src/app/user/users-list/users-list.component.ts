import { HttpContext } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs';
import { User } from 'src/app/_models/User';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: User[] = [];
  searchValue: string = 'Admin';

  constructor(public adminService: AdminService) { }

  ngOnInit(): void {

    this.adminService.getUsers()

    this.getUsersList('');

  }

  searchByValue(event: any) {

    this.getUsersList(event.target.value);

  }

  getUsersList(value: string) {

    this.adminService.usersList$.subscribe(
      {

        next: (list) => {

          if (value !== '') {

            this.users = [];

            list.forEach(element => {

              var regEx = new RegExp(value, 'i');

              var result = regEx.test(element.name);

              if (result)
                this.users.push(element);

            })

          }
          else {

            this.users = list

          }

          return this.users;

        }

      }

    )

  }
}
