using API.Entities.DTO;
using AutoMapper;

namespace API.Entities.Mapper
{
    public class AutoMapperProfile : Profile
    {

        public AutoMapperProfile()
        {

            CreateMap<AppUser, UserDTO>();

        }

    }
}