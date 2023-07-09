using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class BookLease
    {

        public string Id { get; set; }

        public string BookId { get; set; }
        public Book Book { get; set; }


        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int DelayTime { get; set; }   //Delay in day(s)
    }
}