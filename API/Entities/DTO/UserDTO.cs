namespace API.Entities.DTO
{

    //Class used to select userdata in database
    public class UserDTO : RegisterUserDTO
    {

        public string Id { get; set; }
        public Subscription Subscription { get; set; }

    }
}