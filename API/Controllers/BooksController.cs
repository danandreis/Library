using API.Data.Services;
using API.Entities;
using API.Entities.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BooksController : BaseAPIController
    {
        private readonly IBookService _bookService;

        public BooksController(IBookService bookService)
        {
            _bookService = bookService;

        }

        [HttpGet]
        public async Task<IEnumerable<BookDTO>> GetBooks()
        {

            var result = await _bookService.GetBooks();
            return result;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookDTO>> GetBook(string id)
        {

            var result = await _bookService.GetBook(id);

            if (result == null) return BadRequest("There no book with this ID in database");

            return result;

        }

        [HttpGet("domains")]
        public async Task<IEnumerable<BookDomain>> GetDomain()
        {

            return await _bookService.GetDomains();
        }

        [HttpGet("languages")]
        public async Task<IEnumerable<BookLanguage>> GetLanguages()
        {

            return await _bookService.GetLanguages();
        }

        [HttpGet("bookTypes")]
        public async Task<IEnumerable<BookType>> GetBookTypes()
        {

            return await _bookService.GetTypes();
        }

        [HttpPost]
        public async Task<ActionResult<Book>> AddBook(Book book)
        {

            var result = await _bookService.AddBook(book);

            if (result == null) return BadRequest("There was an error where adding the new book");

            return book;

        }

        [HttpPost("addBorrow")]
        public async Task<ActionResult<BookBorrow>> addBorrow(BookBorrow bookBorrow)
        {

            bookBorrow.Id = Guid.NewGuid().ToString();

            var borrowedBook = await _bookService.addBorrowedBook(bookBorrow);

            if (borrowedBook == null) return BadRequest("There was an error on registering the borrow!");

            return borrowedBook;
        }


        [HttpPut]
        public async Task<ActionResult<Book>> UpdateBook(Book book)
        {

            var result = await _bookService.UpdateBook(book);

            if (result == null) return BadRequest("There was an error when updating the book's info");

            return result;

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Book>> DeleteBook(string id)
        {

            var result = await _bookService.DeleteBook(id);

            if (result == null) return BadRequest("There was an error when deleting the selected book");

            return result;
        }

    }
}