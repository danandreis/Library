import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});

  constructor(private toastr: ToastrService, private accountService: AccountService,
    private router: Router) { }

  ngOnInit(): void {

    this.initializeForm();

  }

  initializeForm() {
    this.loginForm = new FormGroup({

      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)

      // password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\\[\\.|\\_|!|@|#|$|%|^|&|\\*|-\\[)(.{6,})$")])

    })

  }

  login() {

    this.accountService.login(this.loginForm.value).subscribe({

      next: () => {

        this.toastr.success('You have been successfully authenticated');
        this.router.navigateByUrl('/admin/users-list')
      },

      error: (error) => this.toastr.error(error.error)

    });

  }
  

}
