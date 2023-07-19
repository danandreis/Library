using System.Runtime;
using API.Data;
using API.Entities;
using API.Entities.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class UsersController : BaseAPIController
    {
        private readonly DataContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;

        public UsersController(DataContext context, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _context = context;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {

            var users = await _context.Users.ToListAsync();

            return users;

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUser(int id)
        {

            var user = await _context.Users.FindAsync(id);

            return user;


        }

        [HttpPost]
        public async Task<ActionResult<AppUser>> Login(UserDTO user)
        {

            if (user == null) return BadRequest("Invalid user");

            var utilizator = await _userManager.FindByNameAsync(user.UserName);

            if (utilizator == null) return BadRequest("Invalid login credentials");

            var passwordCheck = await _userManager.CheckPasswordAsync(utilizator, user.Password);

            if (!passwordCheck) return BadRequest("Invalid login credentials");

            var signInResult = await _signInManager.PasswordSignInAsync(utilizator, user.Password, false, false);

            if (!signInResult.Succeeded) return BadRequest("Invalid login credentials");

            return utilizator;

        }

    }
}