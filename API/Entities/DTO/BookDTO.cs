namespace API.Entities.DTO
{
    public class BookDTO
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Publisher { get; set; }
        public int Year { get; set; }
        public int Pages { get; set; }
        public string Isbn { get; set; }
        public int Copies { get; set; }
        public string Description { get; set; }
        public decimal Rating { get; set; }
        public string PictureLink { get; set; }

        public List<BookBorrowDTO> BookBorrows { get; set; }

        public List<BookReservationDTO> BookReservations { get; set; }

        public BookDomain BookDomain { get; set; }

        public BookLanguage BookLanguage { get; set; }

        public BookType BookType { get; set; }
    }
}