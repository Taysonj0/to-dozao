package br.edu.ufape.todozao.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.edu.ufape.todozao.dto.TagCreateDTO;
import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.repository.UserRepository;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class TagControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

        @Autowired
        private UserRepository userRepository;

    @Test
    void deveCriarETrazerTag() throws Exception {
        User user = userRepository.save(User.builder()
            .name("Usuário Tags")
            .login("tag-user")
            .email("tag-user@teste.com")
            .password("p")
            .build());

        TagCreateDTO dto = new TagCreateDTO();
        dto.setName("Trabalho");
        dto.setColor("Vermelho");

        // CREATE
        mockMvc.perform(post("/api/tags")
                .with(user(user.getLogin()).roles("USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Trabalho"))
                .andExpect(jsonPath("$.color").value("Vermelho"));

        // LIST
        mockMvc.perform(get("/api/tags")
                .with(user(user.getLogin()).roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Trabalho"));
    }
}

