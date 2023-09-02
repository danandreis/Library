namespace API.Entities.DTO
{
    public class BookReservationDTO
    {
        public string Id { get; set; }

        public AppUserDTO AppUser { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}