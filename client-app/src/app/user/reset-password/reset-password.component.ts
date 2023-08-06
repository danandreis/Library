import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewPassord } from 'src/app/_models/NewPassword';
import { AccountService } from 'src/app/_services/account.service';
import { AdminService } from 'src/app/_services/admin.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup = new FormGroup({})
  idUser: string | null = null;
  currentUserId: string | null = null;
  currentUserRole: string | null = null;
  canResetPassword = false;

  constructor(public accountService: AccountService, private router: Router, private route: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe({
      next: (params) => {

        this.idUser = params.get('id')

        this.accountService.user$.subscribe({

          next: (user) => {

            this.currentUserId = user?.id!;
            this.currentUserRole = user?.role!

          }

        })

      }
    })


    if (this.currentUserRole) {

      if (this.currentUserRole != 'Admin' && this.currentUserId != this.idUser) {

        this.toastr.error('You are not allowed to change password for other users!')

        if (this.currentUserRole == 'User') this.router.navigateByUrl('/user/myBooks');
        if (this.currentUserRole == 'Employee') this.router.navigateByUrl('/books/list');

      }
      else {

        this.canResetPassword = true;
        this.initializeForm()
      }

    }
  }

  initializeForm() {

    this.resetPasswordForm = new FormGroup({

      newPassword: new FormControl('', [Validators.required,
      Validators.pattern("^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\\[\\.|\\_|!|@|#|$|%|^|&|\\*|-\\[)(.{6,})$")]),
      confirmPassword: new FormControl('', [Validators.required, this.checkPassword('newPassword')])

    });

    this.resetPasswordForm.get('newPassord')?.valueChanges.subscribe({

      next: () => this.resetPasswordForm.controls['confirmPassword'].updateValueAndValidity()
    })

  }

  checkPassword(matchTo: string): ValidatorFn {

    return (control: AbstractControl) => {

      return control.value === control.parent?.get(matchTo)?.value ? null : { notMatched: true }

    }
  }

  resetForm() {

    if (this.currentUserRole == 'User') this.router.navigateByUrl('/user/myBooks');
    if (this.currentUserRole == 'Employee') this.router.navigateByUrl('/books/list');

  }

  resetPassword(password: string) {

    var newPassword: NewPassord = {} as NewPassord;

    newPassword.userId = this.accountService.getLoginUser()!.id;
    newPassword.password = password
    newPassword.changedByUser = true;

    this.accountService.resetPassword(newPassword).subscribe({

      next: () => {

        this.toastr.success("The password was successfully reseted!")

        if (this.currentUserRole == 'User') this.router.navigateByUrl('/user/myBooks');
        if (this.currentUserRole == 'Employee') this.router.navigateByUrl('/books/list');

        this.accountService.updateUserFirstLogin();

      },
      error: (error) => this.toastr.error(error.error)
    })
  }

}
