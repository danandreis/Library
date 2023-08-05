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
        Task<UserDTO> GetUser(string id);
        Task<AppUser> AddUser(RegisterUserDTO registerUserDTO);
        Task DeleteUser(string id);
        Task<AppUser> UpdateUser(UserDTO userDTO);
        Task<LoginUserDTO> LoginUser(LoginUserDTO loginUserDTO);
        Task<IEnumerable<Subscription>> GetSubscriptions();
        Task<IEnumerable<IdentityRole>> GetRoles();
        Task<AppUser> ResetPassword(NewPasswordDTO newPasswordDTO);

    }
}