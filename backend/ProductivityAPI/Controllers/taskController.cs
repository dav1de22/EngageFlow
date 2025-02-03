using Microsoft.AspNetCore.Mvc;
using ProductivityAPI.Data;
using ProductivityAPI.Models;
using TaskModel = ProductivityAPI.Models.Task;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace ProductivityAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ProductivityContext _context;

        public TasksController(ProductivityContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<TaskModel>> GetTasks()
        {
            return _context.Tasks.ToList();
        }

        [HttpPost]
        public ActionResult<TaskModel> CreateTask(TaskModel task)
        {
            _context.Tasks.Add(task);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetTasks), new { id = task.TaskId }, task);
        }
        [HttpPut("{id}")]
        public ActionResult<TaskModel> UpdateTask(int id, TaskModel task)
        {
            if (id != task.TaskId)
            {
                return BadRequest();
            }

            _context.Entry(task).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok(task);
        }
    }
}