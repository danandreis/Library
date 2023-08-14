using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data.Services;
using API.Entities;
using API.Entities.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

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

            return await _bookService.GetBooks();
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

    }
}