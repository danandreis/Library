using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Book
    {

        public string Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string Publisher { get; set; }
        public int Year { get; set; }
        public int Pages { get; set; }
        public string Isbn { get; set; }
        public int Copies { get; set; }
        public string Description { get; set; }
        public decimal Rating { get; set; }
        public string PictureLink { get; set; }

        //Relatia cu Domeniu
        public string BookDomainId { get; set; }
        public BookDomain BookDomain { get; set; }

        //Relatia cu Limba
        public string BookLanguageId { get; set; }
        public BookLanguage BookLanguage { get; set; }

        //Relatia cu tipul
        public string BookTypeId { get; set; }
        public BookType BookType { get; set; }

        //Relation with BookBorrows
        public List<BookBorrow> BookBorrows { get; set; }

        public List<BookReservation> BookReservations { get; set; }
        public List<BooksRating> BooksRatings { get; set; }

    }
}