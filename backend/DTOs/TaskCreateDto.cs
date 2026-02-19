namespace TaskManager.DTOs
{
    public class TaskCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public int UserId { get; set; }
    }
}
