package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.dto.UserProfileResponseDTO;
import br.edu.ufape.todozao.dto.UserProfileUpdateDTO;
import br.edu.ufape.todozao.exception.TaskInvalidaException;
import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

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
                user.getLocation()
        );
    }
}
