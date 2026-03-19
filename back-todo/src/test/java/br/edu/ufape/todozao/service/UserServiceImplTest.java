package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.dto.UserProfileResponseDTO;
import br.edu.ufape.todozao.dto.UserProfileUpdateDTO;
import br.edu.ufape.todozao.exception.TaskInvalidaException;
import br.edu.ufape.todozao.infra.storage.AvatarStoragePaths;
import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
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

    @AfterEach
    void tearDown() throws IOException {
        deleteManagedAvatar(user.getAvatarUrl());
    }

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
                .avatarUrl("/uploads/avatars/joao.png")
                .build();
    }

    @Test
    void deveBuscarPerfilAtualPorLogin() {
        when(userRepository.findUserByLogin("joao")).thenReturn(user);

        UserProfileResponseDTO result = userService.buscarPerfilAtual("joao");

        assertEquals(1L, result.id());
        assertEquals("João Moura", result.name());
        assertEquals("Headline antiga", result.headline());
        assertEquals("/uploads/avatars/joao.png", result.avatarUrl());
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
        assertEquals("/uploads/avatars/joao.png", result.avatarUrl());
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
        assertEquals("/uploads/avatars/joao.png", result.avatarUrl());
    }

    @Test
    void deveAtualizarAvatarDoUsuarioAutenticado() {
        MockMultipartFile file = new MockMultipartFile("file", "avatar.png", "image/png", new byte[]{1, 2, 3, 4});

        when(userRepository.findUserByLogin("joao")).thenReturn(user);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfileResponseDTO result = userService.atualizarAvatarAtual("joao", file);

        assertEquals("João Moura", result.name());
        assertEquals(true, result.avatarUrl() != null && result.avatarUrl().startsWith("/uploads/avatars/user-1-"));
    }

    @Test
    void deveLancarErroQuandoAvatarForDeTipoInvalido() {
        MockMultipartFile file = new MockMultipartFile("file", "avatar.gif", "image/gif", new byte[]{1, 2, 3, 4});

        when(userRepository.findUserByLogin("joao")).thenReturn(user);

        TaskInvalidaException exception = assertThrows(TaskInvalidaException.class, () -> userService.atualizarAvatarAtual("joao", file));

        assertEquals("Envie uma imagem JPG, PNG ou WEBP.", exception.getMessage());
    }

    private void deleteManagedAvatar(String avatarUrl) throws IOException {
        if (avatarUrl == null || !avatarUrl.startsWith("/uploads/avatars/")) {
            return;
        }

        String fileName = avatarUrl.substring("/uploads/avatars/".length());
        Path path = AvatarStoragePaths.AVATARS_ROOT.resolve(fileName).normalize();
        Files.deleteIfExists(path);
    }
}
