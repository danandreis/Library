import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/User';
import { UserSubscription } from 'src/app/_models/UserSubscription';
import { AccountService } from 'src/app/_services/account.service';
import { AdminService } from 'src/app/_services/admin.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  userRegistrationForm: FormGroup = new FormGroup({});
  subscriptions: UserSubscription[] = [];
  availableRoles = [
    'Admin',
    'User',
    'Employee'
  ]

  isRoleUser: boolean = true;
  public showContent: boolean = false;
  newUser: User | null = null;
  isUserNameRegistered: boolean = false;

  constructor(private accountService: AccountService, private userService: UserService, private adminService: AdminService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.spinner.show();
    this.getSubscriptions();
    this.adminService.getUsers()

  }

  initializeRegistrationForm() {

    this.userRegistrationForm = new FormGroup({

      name: new FormControl('', [Validators.required, Validators.pattern("^[A-Z][a-z]{2,}(\\s[A-Z][a-z]{2,})+$")]),
      userName: new FormControl('', [Validators.required, this.verifyUserName()]),
      address: new FormControl('', Validators.required),
      idCard: new FormControl('', Validators.required),
      subscriptionId: new FormControl(this.subscriptions.at(0)?.id, Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern("^(07)[0-9]{8}$")]),
      personalCode: new FormControl('', Validators.required),
      role: new FormControl('User', Validators.required),
      password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\\[\\.|\\_|!|@|#|$|%|^|&|\\*|-\\[)(.{6,})$")]),
      confirmPassword: new FormControl('', [Validators.required, this.matchPassword('password')])

    });

    this.userRegistrationForm.controls['password'].valueChanges.subscribe({

      next: () => this.userRegistrationForm.controls['confirmPassword'].updateValueAndValidity()

    })
  }

  matchPassword(matchTo: string): ValidatorFn {

    return (control: AbstractControl) => {

      return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true }

    }
  }

  verifyUserName(): ValidatorFn {

    return (control: AbstractControl) => {

      this.checkUserName(control.value);
      return !this.isUserNameRegistered ? null : { isUserName: true }

    }
  }

  getSubscriptions() {

    this.accountService.getAvailableSubscription().subscribe({

      next: (response) => this.subscriptions = response,

      complete: () => {

        this.spinner.hide();
        this.showContent = true;
        this.initializeRegistrationForm()

      }

    });


  }

  setUserName(name: string) {

    var username_components = name.toLowerCase().split(' ');
    var formUserName = username_components[0] + "." + username_components[1]; //generate username from current user

    this.isUserNameRegistered = false;

    this.userRegistrationForm.get('userName')!.setValue(formUserName);

    this.adminService.usersList$.subscribe({

      next: (list) => {

        this.isUserNameRegistered = list.filter(e => e.userName === formUserName).length != 0 ? true : false

      }
    })


  }

  checkUserName(value: string) {

    //Check if username is alredy registered
    this.adminService.usersList$.subscribe({

      next: (list) => {

        this.isUserNameRegistered = list.filter(e => e.userName === value).length != 0 ? true : false

      }
    })
  }

  selectRole(event: any) {

    this.isRoleUser = (event.target.value.split(":")[1].trim() !== 'User') ? false : true;

  }

  cancelRegistration() {

    this.router.navigateByUrl('/admin/users-list')
  }

  registerNewUser() {

    this.newUser = this.userRegistrationForm.value;
    this.newUser!.registrationDate = new Date();
    this.newUser!.firstLogin = 1;
    if (!this.isRoleUser) this.newUser!.subscriptionId = null

    this.userService.addNewUser(this.newUser!).subscribe({

      next: () => {

        this.toastr.success('The user has been successfully registered');
        this.router.navigateByUrl('/admin/users-list')
      },

      error: (error) => this.toastr.error(error.error)

    })

  }

}
