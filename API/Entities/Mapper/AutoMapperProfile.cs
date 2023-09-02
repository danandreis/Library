using API.Entities.DTO;
using AutoMapper;

namespace API.Entities.Mapper
{
    public class AutoMapperProfile : Profile
    {

        public AutoMapperProfile()
        {

            CreateMap<AppUser, UserDTO>();
            CreateMap<UserDTO, AppUser>();
            CreateMap<AppUser, LoginUserDTO>();
            CreateMap<RegisterUserDTO, AppUser>();

            CreateMap<AppUser, AppUserDTO>();
            CreateMap<AppUserDTO, AppUser>();

            CreateMap<Book, BookDTO>();
            CreateMap<BookDTO, Book>();
            CreateMap<Book, Book>();

            CreateMap<BookBorrow, BookBorrowDTO>();
            CreateMap<BookBorrowDTO, BookBorrow>();
            CreateMap<BookBorrow, BookBorrow>();

            CreateMap<BookReservation, BookReservationDTO>();
            CreateMap<BookReservationDTO, BookReservation>();
            CreateMap<BookReservation, BookReservation>();

            CreateMap<BorrowsDTO,BorrowsDTO>();


        }

    }
}