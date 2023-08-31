namespace API.Entities
{
    public class BookBorrow
    {
        public string Id { get; set; }

        public string BookId { get; set; }
        public Book Book { get; set; }

        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? ReturnDate { get; set; }

        public int DelayTime { get; set; }   //Delay in day(s)

        public int Extended { get; set; }  //1- if the borrow was extended, 0 - if not

    }
}