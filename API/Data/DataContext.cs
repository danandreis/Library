using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<BookBorrow>().HasOne(b => b.Book).
                WithMany(bl => bl.BookBorrows).HasForeignKey(b => b.BookId);
            modelBuilder.Entity<BookBorrow>().HasOne(u => u.AppUser).
                WithMany(bl => bl.BookBorrows).HasForeignKey(u => u.AppUserId);

            modelBuilder.Entity<BookReservation>().HasOne(b => b.Book).
                WithMany(br => br.BookReservations).HasForeignKey(b => b.BookId);
            modelBuilder.Entity<BookReservation>().HasOne(b => b.AppUser).
                WithMany(br => br.BookReservations).HasForeignKey(b => b.AppUserId);

            modelBuilder.Entity<BooksRating>().HasOne(b => b.Book).
                 WithMany(br => br.BooksRatings).HasForeignKey(b => b.BookId);
            modelBuilder.Entity<BooksRating>().HasOne(u => u.AppUser).
                WithMany(br => br.BooksRatings).HasForeignKey(u => u.AppUserId);

            base.OnModelCreating(modelBuilder);

        }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<BookDomain> BookDomains { get; set; }
        public DbSet<BookLanguage> BookLanguages { get; set; }
        public DbSet<BookType> BookTypes { get; set; }
        public DbSet<BookBorrow> BookBorrows { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<BookReservation> BookReservations { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<BooksRating> booksRatings { get; set; }


    }
}