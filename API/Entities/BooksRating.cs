namespace API.Entities
{
    public class BooksRating
    {

        public string Id { get; set; }
        public int Votes { get; set; }
        public int PositiveVotes { get; set; }
        public string Comments { get; set; }

        public string BookId { get; set; }
        public Book Book { get; set; }

        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }

    }
}