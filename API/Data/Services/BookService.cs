using API.Entities;
using API.Entities.DTO;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Services
{
    public class BookService : IBookService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public BookService(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;

        }
        public async Task<Book> AddBook(Book book)
        {

            book.Id = Guid.NewGuid().ToString();
            await _context.Books.AddAsync(book);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return null;

            return book;

        }

        public Task<Book> DeleteBook(string id)
        {
            throw new NotImplementedException();
        }

        public Task<Book> EditBook(Book book)
        {
            throw new NotImplementedException();
        }

        public Task<Book> GetBook(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<BookDTO>> GetBooks()
        {

            var result = await _context.Books.Include(b => b.BookDomain).Include(b => b.BookType).
                            Include(b => b.BookLanguage).ToListAsync();

            return _mapper.Map<IEnumerable<BookDTO>>(result);
        }

        public async Task<IEnumerable<BookDomain>> GetDomains()
        {
            return await _context.BookDomains.OrderBy(d => d.Domain).ToListAsync();
        }

        public async Task<IEnumerable<BookLanguage>> GetLanguages()
        {

            return await _context.BookLanguages.ToListAsync();

        }

        public async Task<IEnumerable<BookType>> GetTypes()
        {

            return await _context.BookTypes.ToListAsync();

        }
    }
}