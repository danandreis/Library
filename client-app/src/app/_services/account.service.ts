import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../_models/User';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = "https://localhost:5001/api/";
  private userSource = new BehaviorSubject<User | null>(null);
  user$ = this.userSource.asObservable();

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  login(user: User) {

    return this.http.post('https://localhost:5001/api/users', user).subscribe({

      next: (user) => {
        console.log(user);
        this.toastr.success('User has been successfully authenticated!')
      },
      complete: () => console.log('Request completed'),
      error: (error:any) => this.toastr.error(error.error)

    });


  }
}
