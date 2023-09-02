using API.Entities;
using API.Entities.DTO;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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
            }).ToListAsync();

            return borrowsList;

        }

        public async Task<BookBorrow> addBorrowedBook(BookBorrow bookBorrow)
        {

            if (bookBorrow == null) return null;

            await _context.BookBorrows.AddAsync(bookBorrow);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return null;

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

            var result = _context.BookBorrows.Where(bb => bb.Id == borrowDTO.Id).
                    ExecuteUpdate(bb => bb.SetProperty(b => b.ReturnDate, borrowDTO.NewDate));

            if (result != 1) return null;

            return borrowDTO.Id;
        }
    }
}