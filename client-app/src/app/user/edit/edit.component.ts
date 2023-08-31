import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { User } from 'src/app/_models/User';
import { UserSubscription } from 'src/app/_models/UserSubscription';
import { AccountService } from 'src/app/_services/account.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  updateUserDataForm: FormGroup = new FormGroup({})
  subscriptions: UserSubscription[] = []
  availableRoles = [
    'Admin',
    'User',
    'Employee'
  ]
  selectedRole: string = ''

  showContent: boolean = false;
  userDB: User | null = null;


  constructor(public accountService: AccountService, private userService: UserService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.spinner.show();
    this.getSubscriptions();
  }

  initializeUserDataUpdateForm(user: User) {

    this.updateUserDataForm = new FormGroup({

      name: new FormControl(user.name, [Validators.required, Validators.pattern("^[A-Z][a-z]{2,}(\\s[A-Z][a-z]{2,})+$")]),
      address: new FormControl(user.address, Validators.required),
      idCard: new FormControl(user.idCard, Validators.required),
      subscriptionId: new FormControl(this.userDB!.subscription != null ? this.userDB!.subscription.id : this.subscriptions.at(0)!.id, Validators.required),
      email: new FormControl(user.email, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(user.phoneNumber, [Validators.required, Validators.pattern("^(07)[0-9]{8}$")]),
      personalCode: new FormControl(user.personalCode, Validators.required),
      role: new FormControl(user.role, Validators.required),

    })

  }

  getSubscriptions() {

    this.accountService.getAvailableSubscription().subscribe({

      next: (response) => {

        this.subscriptions = response

        this.route.paramMap.subscribe({

          next: (params) => {

            var id = params.get('id');

            if (id) {

              if (this.accountService.getLoginUser()!.role !== 'Admin' && this.accountService.getLoginUser()?.id !== id) {

                this.toastr.error("You are not allowed to change data for other users")
                if (this.accountService.getLoginUser()!.role == 'User') this.router.navigateByUrl('/user/myBooks');
                if (this.accountService.getLoginUser()!.role == 'Employee') this.router.navigateByUrl('/books/list');

              }
              else {

                this.getUserData(params.get('id')!)

              }
            }
          }

        })

      }

    });

  }

  getUserData(id: string) {

    this.userService.getUser(id).subscribe({

      next: (user) => {

        if (user) this.userDB = user

      },

      complete: () => {

        this.spinner.hide();
        this.showContent = true;
        this.initializeUserDataUpdateForm(this.userDB!)
      },

      error: (error) => {

        this.toastr.error(error.error);
        this.accountService.user$.subscribe({
          next: (user) => {

            if (user?.role == 'Admin') this.router.navigateByUrl('/admin/users-list');
            if (user?.role == 'User') this.router.navigateByUrl('/user/myBooks');
            if (user?.role == 'Employee') this.router.navigateByUrl('/books/list');
          }
        })

      }

    })

  }

  updateUserData() {

    var updatedUser: User = this.updateUserDataForm.value;
    updatedUser.id = this.userDB!.id;
    updatedUser.userName = this.userDB!.userName;
    updatedUser.registrationDate = this.userDB!.registrationDate
    updatedUser.firstLogin = this.userDB!.firstLogin;

    //Employee or admins has no subscriptions
    if (updatedUser.role === 'Employee' || updatedUser.role === 'Admin')
      updatedUser.subscriptionId = null;

    this.userService.updateUser(updatedUser).subscribe({

      next: (user) => {

        if (user)
          this.toastr.success('User data has been successfully updated!');
        this.router.navigateByUrl('admin/users-list')

      },

      error: (error) => this.toastr.error(error.error)
    })

  }

  cancelUpdate() {

    this.accountService.user$.pipe(take(1)).subscribe({

      next: (user) => {

        if (user) {

          if (user.role == 'Admin') this.router.navigateByUrl('/admin/users-list');
          if (user.role == 'User') this.router.navigateByUrl('/user/myBooks');
          if (user.role == 'Employee') this.router.navigateByUrl('/books/list');

        }
      }

    })

  }

  checkRole(event: any) {

    this.selectedRole = event.target.value.split(":")[1]
  }
}
