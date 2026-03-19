package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.dto.UserProfileResponseDTO;
import br.edu.ufape.todozao.dto.UserProfileUpdateDTO;
import br.edu.ufape.todozao.exception.TaskInvalidaException;
import br.edu.ufape.todozao.infra.storage.AvatarStoragePaths;
import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;

    public UserServiceImpl(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public User criar(User user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new TaskInvalidaException("Email já cadastrado");
        }

        user.setCreatedAt(LocalDateTime.now());
        return userRepo.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User buscarPorId(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() ->
                        new TaskInvalidaException("Usuário com id " + id + " não encontrado"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> listar() {
        return userRepo.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponseDTO buscarPerfil(Long id) {
        User user = buscarPorId(id);
        return toProfileResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponseDTO buscarPerfilAtual(String login) {
        return toProfileResponse(buscarPorLogin(login));
    }

    @Override
    public UserProfileResponseDTO atualizarPerfil(Long id, UserProfileUpdateDTO profile) {
        User user = buscarPorId(id);

        return atualizarPerfil(user, profile);
    }

    @Override
    public UserProfileResponseDTO atualizarPerfilAtual(String login, UserProfileUpdateDTO profile) {
        User user = buscarPorLogin(login);

        return atualizarPerfil(user, profile);
    }

    @Override
    public UserProfileResponseDTO atualizarAvatarAtual(String login, MultipartFile file) {
        User user = buscarPorLogin(login);

        if (file == null || file.isEmpty()) {
            throw new TaskInvalidaException("Selecione uma imagem para enviar.");
        }

        validateAvatarFile(file);

        try {
            Files.createDirectories(AvatarStoragePaths.AVATARS_ROOT);

            deleteManagedAvatarIfPresent(user.getAvatarUrl());

            String extension = resolveExtension(file.getContentType(), file.getOriginalFilename());
            String fileName = "user-" + user.getId() + "-" + UUID.randomUUID() + extension;
            Path destination = AvatarStoragePaths.AVATARS_ROOT.resolve(fileName).normalize();

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            user.setAvatarUrl("/uploads/avatars/" + fileName);
            return toProfileResponse(userRepo.save(user));
        } catch (IOException exception) {
            throw new TaskInvalidaException("Nao foi possivel salvar a foto de perfil.");
        }
    }

    @Override
    public UserProfileResponseDTO removerAvatarAtual(String login) {
        User user = buscarPorLogin(login);

        deleteManagedAvatarIfPresent(user.getAvatarUrl());
        user.setAvatarUrl(null);

        return toProfileResponse(userRepo.save(user));
    }

    private UserProfileResponseDTO atualizarPerfil(User user, UserProfileUpdateDTO profile) {

        if (!user.getEmail().equals(profile.email()) && userRepo.existsByEmail(profile.email())) {
            throw new TaskInvalidaException("Email já cadastrado");
        }

        user.setName(profile.name());
        user.setEmail(profile.email());
        user.setHeadline(profile.headline());
        user.setBio(profile.bio());
        user.setLocation(profile.location());

        return toProfileResponse(userRepo.save(user));
    }

    private void validateAvatarFile(MultipartFile file) {
        String contentType = file.getContentType();
        long maxBytes = 2 * 1024 * 1024;

        if (contentType == null || !Map.of(
                "image/jpeg", ".jpg",
                "image/png", ".png",
                "image/webp", ".webp"
        ).containsKey(contentType.toLowerCase())) {
            throw new TaskInvalidaException("Envie uma imagem JPG, PNG ou WEBP.");
        }

        if (file.getSize() > maxBytes) {
            throw new TaskInvalidaException("A foto de perfil deve ter no máximo 2 MB.");
        }
    }

    private String resolveExtension(String contentType, String originalFilename) {
        Map<String, String> allowedExtensions = Map.of(
                "image/jpeg", ".jpg",
                "image/png", ".png",
                "image/webp", ".webp"
        );

        String normalizedContentType = contentType == null ? "" : contentType.toLowerCase();

        if (allowedExtensions.containsKey(normalizedContentType)) {
            return allowedExtensions.get(normalizedContentType);
        }

        if (originalFilename != null && originalFilename.contains(".")) {
            return originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase();
        }

        return ".img";
    }

    private void deleteManagedAvatarIfPresent(String avatarUrl) {
        if (avatarUrl == null || !avatarUrl.startsWith("/uploads/avatars/")) {
            return;
        }

        String fileName = avatarUrl.substring("/uploads/avatars/".length());

        if (fileName.isBlank()) {
            return;
        }

        Path filePath = AvatarStoragePaths.AVATARS_ROOT.resolve(fileName).normalize();

        if (!filePath.startsWith(AvatarStoragePaths.AVATARS_ROOT)) {
            return;
        }

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException ignored) {
        }
    }

    private User buscarPorLogin(String login) {
        User user = userRepo.findUserByLogin(login);

        if (user == null) {
            throw new TaskInvalidaException("Usuário autenticado não encontrado");
        }

        return user;
    }

    private UserProfileResponseDTO toProfileResponse(User user) {
        return new UserProfileResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getLogin(),
                user.getHeadline(),
                user.getBio(),
            user.getLocation(),
            user.getAvatarUrl()
        );
    }
}
