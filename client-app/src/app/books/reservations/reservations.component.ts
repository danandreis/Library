import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReservedBook } from 'src/app/_models/ReservedBook';
import { LoginUser } from 'src/app/_models/User';
import { AccountService } from 'src/app/_services/account.service';
import { ReserveService } from 'src/app/_services/reserve.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {


  user: LoginUser | undefined;
  reservationsList: ReservedBook[] = []

  constructor(private reservationService: ReserveService, private accountService: AccountService,
    private spinner: NgxSpinnerService, private bsModalService: BsModalService) { }

  ngOnInit(): void {

    this.spinner.show();

    this.accountService.user$.subscribe({

      next: (u) => this.user = u!
    })

    this.displayReservedBooks();

  }

  displayReservedBooks() {

    this.reservationService.getReservations().subscribe({

      next: (list) => {

        if (this.user?.role == 'User')
          this.reservationsList = list.filter(r => r.appUser?.id == this.user?.id)
        else
          this.reservationsList = list;

        this.reservationsList.forEach(reservation => {

          reservation.startDate = new Date(reservation.startDate + 'Z')
          reservation.endDate = new Date(reservation.endDate + 'Z')

        })
      },
      complete: () => {

        this.spinner.hide();

        return this.reservationsList;

      }
    })
  }

}
