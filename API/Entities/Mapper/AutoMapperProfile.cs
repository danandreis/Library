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

            CreateMap<Book, BookDTO>();
            CreateMap<BookDTO, Book>();
            CreateMap<Book, Book>();


        }

    }
}