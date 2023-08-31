using API.Data.Services;
using API.Entities;
using API.Entities.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class BorrowsController : BaseAPIController
    {
        private readonly IBorrowService _borrowService;

        public BorrowsController(IBorrowService borrowService)
        {
            _borrowService = borrowService;

        }

        [HttpPost]
        public async Task<ActionResult<BookBorrow>> addBorrow(BookBorrow bookBorrow)
        {

            bookBorrow.Id = Guid.NewGuid().ToString();

            var borrowedBook = await _borrowService.addBorrowedBook(bookBorrow);

            if (borrowedBook == null) return BadRequest("There was an error on registering the borrow!");

            return borrowedBook;
        }

        [HttpPut]
        public async Task<ActionResult> extendBorrow(BorrowDTO borrowDTO)
        {

            var result = await _borrowService.extendBorrow(borrowDTO);

            if (result != null) return Ok();

            return BadRequest("There was an error where extending the borrow!");
        }

        [HttpPut("returnBook")]
        public async Task<ActionResult> returnBook(BorrowDTO borrowDTO)
        {

            var result = await _borrowService.returnBorrowedBook(borrowDTO);

            if (result != null) return Ok();

            return BadRequest("There was an error where returning the borrowed book!");

        }

    }
}