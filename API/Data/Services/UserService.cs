using API.Entities;
using API.Entities.DTO;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
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
        public async Task<AppUser> AddUser(RegisterUserDTO registerUserDTO)
        {

            //Check if username is already used in data base
            var userDB = await _userManager.FindByNameAsync(registerUserDTO.UserName);

            if (userDB != null && userDB.UserName.Equals(registerUserDTO.UserName)) return null;

            //Check is role exists - if thot they are created
            if (!await _roleManager.RoleExistsAsync(registerUserDTO.Role))
            {

                await _roleManager.CreateAsync(new IdentityRole(registerUserDTO.Role));

            }


            var newUser = _mapper.Map<AppUser>(registerUserDTO);

            newUser.EmailConfirmed = true;

            await _userManager.CreateAsync(newUser, registerUserDTO.Password);

            await _userManager.AddToRoleAsync(newUser, registerUserDTO.Role);

            return newUser;

        }

        public Task DeleteUser(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<UserDTO>> GetAllUsers()
        {

            var users = await _context.Users.Include(u => u.subscription).OrderBy(u => u.Name).ToListAsync();

            UserDTO[] usersList = _mapper.Map<UserDTO[]>(users);

            foreach (UserDTO userDTO in usersList)
            {

                userDTO.Role = _userManager.GetRolesAsync(users.Find(u => u.UserName == userDTO.UserName)).
                                    Result.ToList()[0];

            }

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

        public async Task<UserDTO> GetUser(string id)
        {

            var userDB = await _userManager.FindByIdAsync(id);

            if (userDB == null) return null;

            var user = _mapper.Map<UserDTO>(userDB);
            user.Subscription = await _context.Subscriptions.FindAsync(userDB.SubscriptionId);
            user.Role = _userManager.GetRolesAsync(userDB).Result.ToList()[0];


            return user;

        }

        public async Task<LoginUserDTO> LoginUser(LoginUserDTO loginUserDTO)
        {
            if (loginUserDTO == null) return null;

            var userDB = await _userManager.FindByNameAsync(loginUserDTO.UserName);

            if (userDB != null)
            {

                if (_userManager.GetAccessFailedCountAsync(userDB).Result == 3)
                {

                    loginUserDTO.isBlocked = true;
                    return loginUserDTO;

                }
                loginUserDTO.isBlocked = false;

                var passwordCheck = await _userManager.CheckPasswordAsync(userDB, loginUserDTO.Password);

                if (passwordCheck)
                {

                    var signInResult = await _signInManager.PasswordSignInAsync(userDB, loginUserDTO.Password, false, false);

                    if (signInResult.Succeeded)
                    {

                        LoginUserDTO loginUser = _mapper.Map<LoginUserDTO>(userDB);
                        loginUser.Role = _userManager.GetRolesAsync(userDB).Result.ToList()[0];
                        loginUser.FirstLogin = 0;
                        loginUser.Password = null;

                        await _userManager.ResetAccessFailedCountAsync(userDB);

                        return loginUser;

                    }

                }

                await _userManager.AccessFailedAsync(userDB);
            }

            return null;
        }



        public async Task<AppUser> UpdateUser(UserDTO userDTO)
        {

            var userDB = await _userManager.FindByIdAsync(userDTO.Id);

            if (userDB == null) return null;

            var updatedUser = _mapper.Map(userDTO, userDB);

            await _userManager.UpdateAsync(userDB);

            var roluri = await _userManager.GetRolesAsync(userDB);

            foreach (var rol in roluri)
            {

                await _userManager.RemoveFromRoleAsync(userDB, rol);

            }

            var deleteRoleResult = await _roleManager.FindByNameAsync(userDTO.Role);

            if (deleteRoleResult == null)
            {

                await _roleManager.CreateAsync(new IdentityRole(userDTO.Role));
            }

            await _userManager.AddToRoleAsync(userDB, userDTO.Role);


            return updatedUser;

        }

        public async Task<AppUser> ResetPassword(NewPasswordDTO newPasswordDTO)
        {

            if (newPasswordDTO.UserId == null) return null;

            var userDB = await _userManager.FindByIdAsync(newPasswordDTO.UserId);

            if (userDB == null) return null;

            var token = await _userManager.GeneratePasswordResetTokenAsync(userDB);

            var changePassword = await _userManager.ResetPasswordAsync(userDB, token, newPasswordDTO.Password);

            if (!newPasswordDTO.ChangedByUser)
            {

                //update firstLogin field in order to client to change the password preset by admin at first login after password reseting -
                userDB.FirstLogin = 1;

                await _userManager.UpdateAsync(userDB);

            }

            if (!changePassword.Succeeded) return null;

            return userDB;

        }

        //AccessFailedCount - When equal to 3 the user is blocked. To Unblock user is set to 0
        public async Task<AppUser> BlockUser(string id)
        {
            var userDB = await _userManager.FindByIdAsync(id);


            if (userDB == null) return null;

            for (int indx = 0; indx < 3; indx++)
                await _userManager.AccessFailedAsync(userDB);


            var x = _userManager.GetAccessFailedCountAsync(userDB);

            return userDB;

        }

        public async Task<AppUser> UnblockUser(string id)
        {

            var userDB = await _userManager.FindByIdAsync(id);

            if (userDB == null) return null;

            await _userManager.ResetAccessFailedCountAsync(userDB);

            return userDB;

        }
    }
}