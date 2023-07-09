using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<BookLease>().HasOne(b => b.Book).
                WithMany(bl => bl.BookLeases).HasForeignKey(b => b.BookId);

            modelBuilder.Entity<BookLease>().HasOne(u => u.AppUser).
                WithMany(bl => bl.BookLeases).HasForeignKey(u => u.AppUserId);

            base.OnModelCreating(modelBuilder);

        }

        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<BookDomain> BookDomains { get; set; }
        public DbSet<BookLanguage> BookLanguages { get; set; }
        public DbSet<BookType> BookTypes { get; set; }
        public DbSet<BookLease> BookLeases { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }


    }
}