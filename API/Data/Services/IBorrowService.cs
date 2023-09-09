using System.Reflection.Metadata;
using API.Entities;
using API.Entities.DTO;

namespace API.Data.Services
{
    public interface IBorrowService
    {

        Task<IEnumerable<BorrowsDTO>> getBorrowedBooks();
        Task<BookBorrow> addBorrowedBook(BookBorrow bookBorrow);
        Task<string> extendBorrow(BorrowDTO extendBorrowDTO);
        Task<string> returnBorrowedBook(BorrowDTO borrowDTO);
        Task<bool> bookIsBorrowed(string bookId);

    }
}