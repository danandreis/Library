using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Entities.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Data.Services
{
    public interface IBookService
    {

        Task<IEnumerable<BookDTO>> GetBooks();
        Task<BookDTO> GetBook(string id);
        Task<IEnumerable<BookDomain>> GetDomains();
        Task<IEnumerable<BookType>> GetTypes();
        Task<IEnumerable<BookLanguage>> GetLanguages();
        Task<Book> AddBook(Book book);
        Task<Book> UpdateBook(Book book);
        Task<Book> DeleteBook(string id);

    }
}