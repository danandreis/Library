import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});

  constructor(private http: HttpClient, private toastr: ToastrService, private accountService: AccountService) { }

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

    this.accountService.login(this.loginForm.value);

  }

}
