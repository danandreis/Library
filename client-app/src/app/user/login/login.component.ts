import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any | undefined = {};
  loginForm: FormGroup = new FormGroup({});

  constructor(private http: HttpClient, private toastr: ToastrService) { }

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

    //console.log(this.loginForm?.value);

    return this.http.post('https://localhost:5001/api/users', this.loginForm.value).subscribe({

      next: (user) => {
        console.log(user);
        this.toastr.success('User has been successfully authenticated!')
      },
      complete: () => console.log('Request completed'),
      error: (error) => this.toastr.error(error.error)

    });

  }

}
