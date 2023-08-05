namespace API.Entities.DTO
{
    //Class used to add/update userdata in database
    public class RegisterUserDTO
    {

        public string UserName { get; set; }
        public string Name { get; set; }
        public string PersonalCode { get; set; }
        public string Password { get; set; }
        public string Address { get; set; }
        public string IdCard { get; set; }
        public int FirstLogin { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string SubscriptionId { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }

    }
}