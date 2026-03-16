package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.dto.UserProfileResponseDTO;
import br.edu.ufape.todozao.dto.UserProfileUpdateDTO;
import br.edu.ufape.todozao.exception.TaskInvalidaException;
import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@DisplayName("User Service Profile Tests")
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = User.builder()
                .id(1L)
                .name("João Moura")
                .email("joao@todozao.app")
                .login("joao")
                .headline("Headline antiga")
                .bio("Bio antiga")
                .location("Recife, PE")
                .build();
    }

    @Test
    void deveBuscarPerfilAtualPorLogin() {
        when(userRepository.findUserByLogin("joao")).thenReturn(user);

        UserProfileResponseDTO result = userService.buscarPerfilAtual("joao");

        assertEquals(1L, result.id());
        assertEquals("João Moura", result.name());
        assertEquals("Headline antiga", result.headline());
    }

    @Test
    void deveAtualizarPerfilAtualComTodosOsCampos() {
        UserProfileUpdateDTO updateDTO = new UserProfileUpdateDTO(
                "João Atualizado",
                "joao.atualizado@todozao.app",
                "Nova headline",
                "Nova bio",
                "Garanhuns, PE"
        );

        when(userRepository.findUserByLogin("joao")).thenReturn(user);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfileResponseDTO result = userService.atualizarPerfilAtual("joao", updateDTO);

        assertEquals("João Atualizado", result.name());
        assertEquals("joao.atualizado@todozao.app", result.email());
        assertEquals("Nova headline", result.headline());
        assertEquals("Nova bio", result.bio());
        assertEquals("Garanhuns, PE", result.location());
    }

    @Test
    void deveLancarErroQuandoUsuarioAutenticadoNaoForEncontrado() {
        when(userRepository.findUserByLogin("joao")).thenReturn(null);

        assertThrows(TaskInvalidaException.class, () -> userService.buscarPerfilAtual("joao"));
    }

    @Test
    void deveAtualizarPerfilPorId() {
        UserProfileUpdateDTO updateDTO = new UserProfileUpdateDTO(
                "João Atualizado",
                "joao.novo@todozao.app",
                "Headline nova",
                "Bio nova",
                "Caruaru, PE"
        );

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfileResponseDTO result = userService.atualizarPerfil(1L, updateDTO);

        assertEquals("João Atualizado", result.name());
        assertEquals("Headline nova", result.headline());
        assertEquals("Caruaru, PE", result.location());
    }
}
