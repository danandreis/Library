import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BookService } from 'src/app/_services/book.service';

@Component({
  selector: 'app-borrows',
  templateUrl: './borrows.component.html',
  styleUrls: ['./borrows.component.css']
})
export class BorrowsComponent implements OnInit {

  bsModalRef: BsModalRef = new BsModalRef();

  constructor(private modalSevice: BsModalService, private bookService: BookService) { }

  ngOnInit(): void {
  }

}
