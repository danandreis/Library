using API.Entities;
using API.Entities.DTO;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;

namespace API.Controllers
{

    public class UsersController : BaseAPIController
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;

        }

        [HttpGet]
        public async Task<IEnumerable<UserDTO>> GetUsers()
        {

            var usersDB = await _userService.GetAllUsers();
            return usersDB;

        }

        [HttpGet("subscriptions")]
        public async Task<IEnumerable<Subscription>> GetSubscriptions()
        {

            return await _userService.GetSubscriptions();

        }

        [HttpGet("roles")]
        public async Task<IEnumerable<IdentityRole>> GetRoles()
        {

            return await _userService.GetRoles();

        }


        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(string id)
        {

            var user = await _userService.GetUser(id);

            if (user == null) return BadRequest("There is no user with this ID");

            return user;

        }

        [HttpPost]
        public async Task<ActionResult<LoginUserDTO>> Login(LoginUserDTO loginUserDTO)
        {

            var loginUser = await _userService.LoginUser(loginUserDTO);

            if (loginUser == null) return BadRequest("Invalid login credentials");

            return Ok(loginUser);

        }

        [HttpPost("registration")]
        public async Task<ActionResult<AppUser>> AddUser(RegisterUserDTO registerUserDTO)
        {

            var user = await _userService.AddUser(registerUserDTO);

            if (user == null)
                return BadRequest("The username " + registerUserDTO.UserName.ToUpper() + " is already registered in database!");

            return Ok(user);

        }

        [HttpPut]
        public async Task<ActionResult<AppUser>> UpdateUser(UserDTO userDTO)
        {

            if (userDTO == null) return BadRequest("New user data is invalid!");

            if (await _userService.UpdateUser(userDTO) == null)
                return BadRequest("There was an error when updating user data! ");

            return Ok(userDTO);

        }

        [HttpPut("resetPassword")]
        public async Task<ActionResult<AppUser>> ResetPassword(NewPasswordDTO newPasswordDTO)
        {

            var result = await _userService.ResetPassword(newPasswordDTO);

            if (result == null)
                return BadRequest("There is no user with this ID in database");

            return Ok(result);
        }

    }
}