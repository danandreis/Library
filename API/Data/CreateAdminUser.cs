using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public class CreateAdminUser
    {

        public static async Task CreateAdmin(IApplicationBuilder applicationBuilder)
        {

            using (var serviceScope = applicationBuilder.ApplicationServices.CreateScope())
            {

                var roleManager = serviceScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                if (!await roleManager.RoleExistsAsync("Admin"))
                {

                    await roleManager.CreateAsync(new IdentityRole("Admin"));

                }

                var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

                var admin = await userManager.FindByNameAsync("admin");

                if (admin == null)
                {

                    var administrator = new AppUser()
                    {

                        Name = "admin",
                        Email = "admin@Library.com",
                        UserName = "admin",
                        EmailConfirmed = true,
                        RegistrationDate = DateTime.Now,
                        IdCard = null

                    };

                    await userManager.CreateAsync(administrator, "Password_1234");
                    await userManager.AddToRoleAsync(administrator, "Admin");
                }

            }

        }

    }
}