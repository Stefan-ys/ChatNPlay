package com.quizzard.app.data;


import com.quizzard.app.dto.request.RegisterRequestDTO;
import com.quizzard.app.entity.Chat;
import com.quizzard.app.entity.Lobby;
import com.quizzard.app.entity.Role;
import com.quizzard.app.entity.User;
import com.quizzard.app.enums.UserRoleEnum;
import com.quizzard.app.repository.ChatRepository;
import com.quizzard.app.repository.LobbyRepository;
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
            lobby.setName("General Lobby");

            Chat chat = new Chat();
            lobby.setChat(chat);

            chatRepository.save(chat);
            lobbyRepository.save(lobby);
        }
    }
}
