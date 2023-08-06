import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { LoginUser, User } from '../_models/User';
import { UserSubscription } from '../_models/UserSubscription';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = "https://localhost:5001/api/";
  private userSource = new BehaviorSubject<LoginUser | null>(null);
  user$ = this.userSource.asObservable();
  rolesList: any = {};

  constructor(private http: HttpClient) { }

  login(user: User) {

    return this.http.post<LoginUser>(this.baseUrl + 'users', user).pipe(

      map((response: LoginUser) => {

        if (response) {

          localStorage.setItem('loginUserName', JSON.stringify(response));
          this.userSource.next(response);
          return response;

        }

        return null;

      })
    );

  }

  getLoginUser() {

    var loginUserData = localStorage.getItem('loginUserName');

    if (loginUserData != null) {

      const loginUser: LoginUser = JSON.parse(loginUserData);
      this.userSource.next(loginUser);

    }

  }

  hasAdminRole(): boolean {

    var isAdmin = false;

    this.user$.subscribe({

      next: (user) => {

        if (user)
          isAdmin = user?.role === 'Admin'

      }

    })

    return isAdmin
  }

  hasUserRole(): boolean {

    var isUser = false;

    this.user$.subscribe({
      next: (user) => {

        if (user)
          isUser = user?.role === 'User';
      }

    })

    return isUser;
  }

  hasEmployeeRole(): boolean {

    var isEmployee = false;

    this.user$.subscribe({

      next: (user) => {

        if (user)
          isEmployee = user.role === 'Employee'
      }
    })

    return isEmployee;

  }

  getAvailableSubscription() {

    return this.http.get<UserSubscription[]>(this.baseUrl + 'users/subscriptions').pipe(

      map(subscriptions => { return subscriptions })

    );

  }

  logout() {
    localStorage.removeItem('loginUserName');
    this.userSource.next(null);
  }
}
