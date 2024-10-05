package com.quizzard.app.data;


import com.quizzard.app.dto.RegisterDTO;
import com.quizzard.app.entity.Role;
import com.quizzard.app.entity.User;
import com.quizzard.app.enums.UserRoleEnum;
import com.quizzard.app.repository.RoleRepository;
import com.quizzard.app.repository.UserRepository;
import com.quizzard.app.service.AuthService;
import com.quizzard.app.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


@Component
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AuthService authService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public void run(String... args)  {

        if (roleRepository.count() == 0) {
            Role adminRole = new Role();
            adminRole.setRole(UserRoleEnum.ADMIN);
            roleRepository.save(adminRole);

            Role moderatorRole = new Role();
            moderatorRole.setRole(UserRoleEnum.MODERATOR);
            roleRepository.save(moderatorRole);

            Role userRole = new Role();
            userRole.setRole(UserRoleEnum.USER);
            roleRepository.save(userRole);
        }

        if (!userService.existsByUsername("admin")) {
            RegisterDTO adminUser = new RegisterDTO();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword("admin123");
            adminUser.setConfirmPassword("admin123");

            authService.registerUser(adminUser);

            User user = userRepository.findByUsername("admin")
                    .orElseThrow();

            userService.addRole(user.getId(), "admin");
        }
    }
}
