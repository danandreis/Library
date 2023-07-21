using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.DTO
{
    public class UserDTO
    {

        public string Id { get; set; }
        public string UserName { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Address { get; set; }
        public string IdCard { get; set; }
        public DateTime RegistrationDate { get; set; }
        public int SubscriptionId { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public List<string> Role { get; set; }

    }
}