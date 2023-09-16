The application manage the borrows and reservation process for a Library.

There are 3 types of users:
  * Admin - who add/edit user data, block/unblock users and change passwords
  * Employee - who add/edit/delete books, see the reservations and borrowed books
  * Users - who can borrow/reserve a book

At first run the application creates an Admin account with Password: "Password_1234".
The application was made using MS SQL Database.

  An User can borrow or reserve a book. A book can be borrowed for 2 weeks and reserved for 1 week. An user cand borrow/reserve only 1 book. 
  
  After a book is borrowed other users can only reserve the book. (A book cand be borrowed once but reserved by many users). Each reservation has a start date established base on the presvious borrow/reservation.
  
  When a book is returned (the Return process can be executed only by Employee) the date for the next reservations is updates accordingly. 
  A reserved book can be borrowed only after the previous reservations are canceled or expire 
        
