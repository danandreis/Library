using API.Entities;
using API.Entities.DTO;

namespace API.Data.Services
{
    public interface IBorrowService
    {

        Task<BookBorrow> addBorrowedBook(BookBorrow bookBorrow);
        Task<string> extendBorrow(BorrowDTO extendBorrowDTO);

        Task<string> returnBorrowedBook(BorrowDTO borrowDTO);

    }
}