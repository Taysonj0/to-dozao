package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.model.UserRole;
import br.edu.ufape.todozao.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerProfileIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    private User savedUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        savedUser = userRepository.save(User.builder()
                .name("João Moura")
                .email("joao@todozao.app")
                .login("joao")
                .password(new BCryptPasswordEncoder().encode("12345678"))
                .role(UserRole.USER)
                .headline("Responsável pelo perfil")
                .bio("Bio inicial")
                .location("Garanhuns, PE")
                .build());
    }

    @Test
    void deveBuscarPerfilDoUsuarioAutenticado() throws Exception {
        mockMvc.perform(get("/users/me/profile")
                        .with(SecurityMockMvcRequestPostProcessors.user(savedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedUser.getId()))
                .andExpect(jsonPath("$.name").value("João Moura"))
                .andExpect(jsonPath("$.headline").value("Responsável pelo perfil"));
    }

    @Test
    void deveAtualizarPerfilDoUsuarioAutenticado() throws Exception {
        String body = """
                {
                                    "name": "João Atualizado",
                                    "email": "joao.atualizado@todozao.app",
                                    "headline": "Nova headline",
                                    "bio": "Nova bio",
                                    "location": "Recife, PE"
                }
                """;

        mockMvc.perform(put("/users/me/profile")
                        .with(SecurityMockMvcRequestPostProcessors.user(savedUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("João Atualizado"))
                .andExpect(jsonPath("$.email").value("joao.atualizado@todozao.app"))
                .andExpect(jsonPath("$.headline").value("Nova headline"))
                .andExpect(jsonPath("$.location").value("Recife, PE"));
    }
}
