using System.Runtime;
using API.Data;
using API.Entities;
using API.Entities.DTO;
using AutoMapper;
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
        private readonly IMapper _mapper;

        public UsersController(DataContext context, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
        IMapper mapper)
        {
            _mapper = mapper;
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
        public async Task<ActionResult<UserDTO>> Login(UserDTO userDTO)
        {

            if (userDTO == null) return BadRequest("Invalid user");

            var userDB = await _userManager.FindByNameAsync(userDTO.UserName);

            if (userDB != null)
            {

                var passwordCheck = await _userManager.CheckPasswordAsync(userDB, userDTO.Password);

                if (passwordCheck)
                {

                    var signInResult = await _signInManager.PasswordSignInAsync(userDB, userDTO.Password, false, false);

                    if (signInResult.Succeeded)
                    {

                        userDTO = _mapper.Map<UserDTO>(userDB);
                        userDTO.Role = _userManager.GetRolesAsync(userDB).Result.ToList();

                        return Ok(userDTO);

                    }
                }
            }

            return BadRequest("Invalid login credentials");

        }

    }
}