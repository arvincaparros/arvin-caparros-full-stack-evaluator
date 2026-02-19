using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.Models;
using TaskManager.DTOs;
using System.Security.Cryptography;
using System.Text;

namespace TaskManager.API
{
    // Handles user registration and login
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Register new user
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Email and Password are required.");

            // Check if email already exists
            var existing = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (existing != null)
                return BadRequest("Email already exists.");

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { user.Id, user.Email });
        }

        // Login user
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return Unauthorized("Invalid credentials.");

            // Validate password
            if (user.PasswordHash != HashPassword(dto.Password))
                return Unauthorized("Invalid credentials.");

            return Ok(new { user.Id, user.Email });
        }

        // Simple SHA256 password hashing
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
