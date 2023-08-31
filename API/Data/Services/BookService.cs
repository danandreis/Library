using API.Entities;
using API.Entities.DTO;
using AutoMapper;
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

        public async Task<Book> DeleteBook(string id)
        {

            if (id == null) return null;

            var book = await _context.Books.FirstOrDefaultAsync(b => b.Id == id);

            if (book == null) return null;

            _context.Books.Remove(book);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return null;

            return book;

        }

        public async Task<Book> UpdateBook(Book book)
        {
            if (book == null) return null;

            var bookDB = await _context.Books.FindAsync(book.Id);

            _mapper.Map(book, bookDB);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return null;

            return book;

        }

        public async Task<BookDTO> GetBook(string id)
        {

            var result = await _context.Books.Include(b => b.BookDomain).Include(b => b.BookType).
                Include(b => b.BookLanguage).FirstOrDefaultAsync(b => b.Id == id);

            return _mapper.Map<BookDTO>(result);

        }

        public async Task<IEnumerable<BookDTO>> GetBooks()
        {

            var result = await _context.Books.OrderBy(b => b.Title).Include(b => b.BookDomain).
                            Include(b => b.BookType).Include(b => b.BookLanguage).Include(b => b.BookBorrows).ThenInclude(bb => bb.AppUser).ToListAsync();

            var resultToSend = _mapper.Map<IEnumerable<BookDTO>>(result);

            return resultToSend;
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

        public async Task<BookBorrow> addBorrowedBook(BookBorrow bookBorrow)
        {

            if (bookBorrow == null) return null;

            await _context.BookBorrows.AddAsync(bookBorrow);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return null;

            return bookBorrow;

        }
    }
}