namespace API.Entities.DTO
{
    public class ReservationDTO
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string BookId { get; set; }
        public AppUser AppUser { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}