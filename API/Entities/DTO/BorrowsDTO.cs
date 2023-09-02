using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities.DTO
{
    public class BorrowsDTO
    {

        public string Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string BookId { get; set; }
        public AppUser AppUser { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? ReturnDate { get; set; }

        public int DelayTime { get; set; }   //Delay in day(s)

        public int Extended { get; set; }  //1- if the borrow was extended, 0 - if not

    }
}