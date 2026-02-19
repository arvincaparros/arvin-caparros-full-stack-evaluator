namespace TaskManager.DTOs
{
    public class TaskUpdateDto
    {
        public string Title { get; set; } = string.Empty;
        public bool IsDone { get; set; }
    }
}
