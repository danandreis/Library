namespace API.Entities.DTO
{
    public class LoginUserDTO
    {

        public string Id { get; set; }
        public string UserName { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public int FirstLogin { get; set; }
        public string Role { get; set; }

    }
}