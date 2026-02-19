using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Models;
using TaskManager.Data;
using TaskManager.DTOs;

namespace TaskManager.API
{

    // Provides CRUD operations for managing user tasks.
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;


        // Initializes a new instance of the <see cref="TasksController"/> class.
        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }


        // Retrieves all tasks.
        [HttpGet("{userId}")]
        public async Task<IActionResult> Get(int userId)
        {
            var tasks = await _context.Tasks
               .Where(t => t.UserId == userId)
               .Select(t => new TaskResponseDto
               {
                   Id = t.Id,
                   Title = t.Title,
                   IsDone = t.IsDone
               })
               .ToListAsync();

            return Ok(tasks);
        }


        // Creates a new task for a specific user.
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaskCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest("Title is required.");

            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null)
                return BadRequest("Invalid user.");

            var task = new TaskItem
            {
                Title = dto.Title,
                IsDone = false,
                UserId = dto.UserId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            var response = new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                IsDone = task.IsDone
            };

            return Ok(response);
        }

        // Updates an existing task.
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TaskUpdateDto dto)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == dto.UserId);

            if (task == null)
                return NotFound();

            task.Title = dto.Title;
            task.IsDone = dto.IsDone;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                task.Id,
                task.Title,
                task.IsDone
            });
        }


        //[HttpPut("{id}")]
        //public async Task<IActionResult> Update(int id, [FromBody] TaskUpdateDto dto)
        //{
        //    var task = await _context.Tasks.FindAsync(id);
        //    if (task == null)
        //        return NotFound();

        //    task.Title = dto.Title;
        //    task.IsDone = dto.IsDone;

        //    await _context.SaveChangesAsync();

        //    return Ok(new
        //    {
        //        task.Id,
        //        task.Title,
        //        task.IsDone
        //    });
        //}


        // Deletes a task by ID.
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
