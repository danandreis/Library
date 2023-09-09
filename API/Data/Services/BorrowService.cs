using API.Entities;
using API.Entities.DTO;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Services
{
    public class BorrowService : IBorrowService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public BorrowService(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;

        }

        public async Task<IEnumerable<BorrowsDTO>> getBorrowedBooks()
        {

            var borrowsList = await _context.Books.Join(_context.BookBorrows, b => b.Id, bb => bb.BookId, (b, bb) => new BorrowsDTO
            {
                Id = bb.Id,
                Title = b.Title,
                Author = b.Author,
                BookId = bb.BookId,
                AppUser = bb.AppUser,
                StartDate = bb.StartDate,
                EndDate = bb.EndDate,
                ReturnDate = bb.ReturnDate,
                DelayTime = bb.DelayTime,
                Extended = bb.Extended
            }).OrderByDescending(bl => bl.StartDate).OrderBy(bl => bl.ReturnDate).ToListAsync();

            return borrowsList;

        }

        public async Task<BookBorrow> addBorrowedBook(BookBorrow bookBorrow)
        {

            if (bookBorrow == null) return null;

            await _context.BookBorrows.AddAsync(bookBorrow);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return null;

            //After adding the booking - there is need to remove the reservation from database and update the following reservations

            var reservationsListForBook = await _context.BookReservations.OrderBy(r => r.StartDate).
                                Where(r => r.BookId == bookBorrow.BookId).ToListAsync();

            var selectedReservation = reservationsListForBook[0];

            //1. Delete reservation fron database
            _context.BookReservations.Remove(selectedReservation);
            await _context.SaveChangesAsync();

            //2. Update dates fror upcoming reservations
            var nextResevations = await _context.BookReservations.OrderBy(r => r.StartDate).
                                    Where(r => r.StartDate > selectedReservation.StartDate && r.BookId == bookBorrow.BookId).ToListAsync();

            int index = 0;
            foreach (var reservation in nextResevations)
            {

                reservation.StartDate = bookBorrow.EndDate.AddDays(1);

                if (reservation.StartDate.DayOfWeek.Equals(DayOfWeek.Sunday))
                    reservation.StartDate = DateTime.Now.AddDays(7 * index + 2);

                if (reservation.StartDate.DayOfWeek.Equals(DayOfWeek.Saturday))
                    reservation.StartDate = DateTime.Now.AddDays(7 * index + 1);

                reservation.EndDate = reservation.StartDate.Date.AddDays(7 * (index + 1));

                if (reservation.EndDate.DayOfWeek.Equals(DayOfWeek.Sunday))
                    reservation.EndDate = DateTime.Now.AddDays(7 * (index + 1) + 2);

                if (reservation.EndDate.DayOfWeek.Equals(DayOfWeek.Saturday))
                    reservation.EndDate = DateTime.Now.AddDays(7 * (index + 1) + 1);

                _context.BookReservations.Update(reservation);
                await _context.SaveChangesAsync();

                index++;

            }

            return bookBorrow;

        }

        public async Task<string> extendBorrow(BorrowDTO borrowDTO)
        {

            if (borrowDTO.Id == null) return null;

            var result = _context.BookBorrows.Where(bb => bb.Id == borrowDTO.Id).
                    ExecuteUpdate(bb => bb.SetProperty(b => b.EndDate, borrowDTO.NewDate).
                                            SetProperty(b => b.Extended, 1));

            if (result != 1) return null;

            return borrowDTO.Id;
        }

        public async Task<string> returnBorrowedBook(BorrowDTO borrowDTO)
        {

            if (borrowDTO.Id == null) return null;

            var borrow = _context.BookBorrows.Where(bb => bb.Id == borrowDTO.Id);

            var result = borrow.ExecuteUpdate(bb => bb.SetProperty(b => b.ReturnDate, borrowDTO.NewDate));

            if (result != 1) return null;

            //updates the dates for all the reservations - from today
            var borrowedBook = await borrow.ToListAsync();

            var reservations = await _context.BookReservations.Where(br => br.BookId == borrowedBook[0].BookId).
                                OrderBy(r => r.StartDate).ToListAsync();

            int index = 0;
            foreach (var reservation in reservations)
            {

                reservation.StartDate = DateTime.Now.AddDays(7 * index + 1);

                if (reservation.StartDate.DayOfWeek.Equals(DayOfWeek.Sunday))
                    reservation.StartDate = DateTime.Now.AddDays(7 * index + 2);

                if (reservation.StartDate.DayOfWeek.Equals(DayOfWeek.Saturday))
                    reservation.StartDate = DateTime.Now.AddDays(7 * index + 1);

                reservation.EndDate = DateTime.Now.AddDays(7 * (index + 1) + 1);

                if (reservation.EndDate.DayOfWeek.Equals(DayOfWeek.Sunday))
                    reservation.EndDate = DateTime.Now.AddDays(7 * (index + 1) + 2);

                if (reservation.StartDate.DayOfWeek.Equals(DayOfWeek.Saturday))
                    reservation.StartDate = DateTime.Now.AddDays(7 * (index + 1) + 1);

                _context.BookReservations.Update(reservation);

                index++;

            }

            await _context.SaveChangesAsync();

            return borrowDTO.Id;
        }

        public async Task<bool> bookIsBorrowed(string bookId)
        {

            var result = await _context.BookBorrows.Where(bb => bb.BookId == bookId).ToListAsync();

            return result.Count() > 0;

        }
    }
}