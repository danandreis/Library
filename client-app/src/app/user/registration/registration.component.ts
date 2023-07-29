import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UserSubscription } from 'src/app/_models/UserSubscription';
import { AccountService } from 'src/app/_services/account.service';

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
  public showContent: boolean = false;


  //user: User;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {

    setTimeout(() => this.showContent = true, 300)
    this.getSubscriptions();

  }

  initializeRegistrationForm() {


    var defaultSubscriptionId = this.subscriptions.filter(s => s.type == 'Monthly').at(0)?.id

    this.userRegistrationForm = new FormGroup({

      name: new FormControl('', [Validators.required, Validators.pattern("^[A-Z][a-z]{2,}(\\s[A-Z][a-z]{2,})+$")]),
      userName: new FormControl({ value: '', disabled: true }, Validators.required),
      address: new FormControl('', Validators.required),
      idCard: new FormControl('', Validators.required),
      subscriptionId: new FormControl(defaultSubscriptionId, Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern("^(07)[0-9]{8}$")]),
      personalCode: new FormControl('', Validators.required),
      roles: new FormControl('User', Validators.required),
      password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\\[\\.|\\_|!|@|#|$|%|^|&|\\*|-\\[)(.{6,})$")]),
      confirmPassword: new FormControl('', [Validators.required, this.matchPassword('password')])

    });

    console.log(this.userRegistrationForm.value)

    this.userRegistrationForm.controls['password'].valueChanges.subscribe({

      next: () => this.userRegistrationForm.controls['confirmPassword'].updateValueAndValidity()

    })
  }

  matchPassword(matchTo: string): ValidatorFn {

    return (control: AbstractControl) => {

      return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true }

    }
  }

  getSubscriptions() {

    this.accountService.getAvailableSubscription().subscribe({

      next: (response) => this.subscriptions = response,
      complete: () => this.initializeRegistrationForm()

    });


  }

  setUserName(name: string) {

    var username_components = name.toLowerCase().split(' ');

    this.userRegistrationForm.get('userName')!.setValue(username_components[0] + "." + username_components[1]);
  }


}
