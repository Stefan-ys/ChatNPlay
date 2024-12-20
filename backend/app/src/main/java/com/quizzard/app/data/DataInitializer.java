package com.quizzard.app.data;


import com.quizzard.app.domain.dto.request.RegisterRequestDTO;
import com.quizzard.app.domain.entity.*;
import com.quizzard.app.domain.enums.UserRoleEnum;
import com.quizzard.app.repository.*;
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
    private final LobbyRepository lobbyRepository;
    private final ChatRepository chatRepository;

    @Override
    public void run(String... args) {

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
            RegisterRequestDTO adminUser = new RegisterRequestDTO();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword("admin123");
            adminUser.setConfirmPassword("admin123");

            authService.registerUser(adminUser);

            User user = userRepository.findByUsername("admin")
                    .orElseThrow();

            userService.addRole(user.getId(), "admin");
        }

        if (lobbyRepository.count() == 0) {
            Lobby lobby = new Lobby();
            lobby.setName("Quiz Maze Lobby");
            Chat chat = new Chat();
            lobby.setChat(chatRepository.save(chat));
            lobbyRepository.save(lobby);
        }
    }
}
