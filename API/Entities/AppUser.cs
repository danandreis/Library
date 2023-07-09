using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser
    {

        public string Name { get; set; }
        public string Address { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string IdCard { get; set; }

        //Relatia cu subscription
        public string SubscriptionId { get; set; }
        public Subscription subscription { get; set; }

        //Relation with BookLease
        public List<BookLease> BookLeases { get; set; }
    }
}