using API.Entities;
using API.Entities.DTO;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<ActionResult<AppUser>> GetUser(string id)
        {

            return await _userService.GetUser(id);


        }

        [HttpPost]
        public async Task<ActionResult<LoginUserDTO>> Login(LoginUserDTO loginUserDTO)
        {

            var loginUser = await _userService.LoginUser(loginUserDTO);

            if (loginUser == null) return BadRequest("Invalid login credentials");

            return Ok(loginUser);

        }

    }
}