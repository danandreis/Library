using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser
    {

        public string Name { get; set; }
        public string Address { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string PersonalCode { get; set; }  //User personal code 
        public string IdCard { get; set; }

        //Field used to check if it is the first time when user login (to reset password)
        public int FirstLogin { get; set; } //1 - when uer login 1st time; 0 - when user login more than once

        //Relation cu subscription
        public string SubscriptionId { get; set; }
        public Subscription subscription { get; set; }

        //Relation with BookLease
        public List<BookBorrow> BookBorrows { get; set; }
        public List<BookReservation> BookReservations { get; set; }
    }
}