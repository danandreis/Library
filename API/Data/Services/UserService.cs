using API.Entities;
using API.Entities.DTO;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Services
{
    public class UserService : IUserService
    {
        private readonly DataContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IMapper _mapper;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserService(DataContext context, UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager, IMapper mapper, RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
            _context = context;
            _mapper = mapper;
            _signInManager = signInManager;
            _userManager = userManager;


        }
        public void AddUser(AppUser appUser)
        {
            throw new NotImplementedException();
        }

        public Task DeleteUser(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<UserDTO>> GetAllUsers()
        {

            var users = await _context.Users.ToListAsync();
            UserDTO[] usersList = _mapper.Map<UserDTO[]>(users);

            return usersList;

        }

        public async Task<IEnumerable<IdentityRole>> GetRoles()
        {

            return await _roleManager.Roles.ToListAsync();

        }

        public async Task<IEnumerable<Subscription>> GetSubscriptions()
        {

            return await _context.Subscriptions.ToListAsync();

        }

        public Task<AppUser> GetUser(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<LoginUserDTO> LoginUser(LoginUserDTO loginUserDTO)
        {
            if (loginUserDTO == null) return null;

            var userDB = await _userManager.FindByNameAsync(loginUserDTO.UserName);

            if (userDB != null)
            {

                var passwordCheck = await _userManager.CheckPasswordAsync(userDB, loginUserDTO.Password);

                if (passwordCheck)
                {

                    var signInResult = await _signInManager.PasswordSignInAsync(userDB, loginUserDTO.Password, false, false);

                    if (signInResult.Succeeded)
                    {

                        LoginUserDTO loginUser = _mapper.Map<LoginUserDTO>(userDB);
                        loginUser.Roles = _userManager.GetRolesAsync(userDB).Result.ToList();
                        loginUser.FirstLogin = 0;
                        loginUser.Password = null;

                        return loginUser;

                    }
                }
            }

            return null;
        }

        public Task<AppUser> UpdateUser(AppUser appUser)
        {
            throw new NotImplementedException();
        }
    }
}