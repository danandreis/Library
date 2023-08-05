namespace API.Entities.DTO
{
    public class NewPasswordDTO
    {

        public string UserId { get; set; }
        public string Password { get; set; }
        public bool ChangedByUser { get; set; }

    }
}