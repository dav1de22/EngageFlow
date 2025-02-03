using Microsoft.EntityFrameworkCore;
using ProductivityAPI.Models;
using TaskModel = ProductivityAPI.Models.Task;

namespace ProductivityAPI.Data
{
    public class ProductivityContext : DbContext
    {
        public ProductivityContext(DbContextOptions<ProductivityContext> options) : base(options) { }
        public DbSet<TaskModel> Tasks { get; set; }
    }
}