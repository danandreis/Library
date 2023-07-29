using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Entities.DTO;
using Microsoft.AspNetCore.Identity;

namespace API.Services
{
    public interface IUserService
    {

        Task<IEnumerable<UserDTO>> GetAllUsers();
        Task<AppUser> GetUser(string id);
        void AddUser(AppUser appUser);
        Task DeleteUser(string id);
        Task<AppUser> UpdateUser(AppUser appUser);
        Task<LoginUserDTO> LoginUser(LoginUserDTO loginUserDTO);
        Task<IEnumerable<Subscription>> GetSubscriptions();
        Task<IEnumerable<IdentityRole>> GetRoles();

    }
}