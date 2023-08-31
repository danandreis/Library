namespace API.Entities.DTO
{
    public class BookBorrowDTO
    {

        public string Id { get; set; }

        public AppUserDTO AppUser { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? ReturnDate { get; set; }

        public int DelayTime { get; set; }   //Delay in day(s)   
        public int Extended { get; set; }  //1- if the borrow was extended, 0 - if not
    }
}