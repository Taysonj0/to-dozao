package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.dto.UserProfileResponseDTO;
import br.edu.ufape.todozao.dto.UserProfileUpdateDTO;
import br.edu.ufape.todozao.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {

    User criar(User user);

    User buscarPorId(Long id);

    List<User> listar();

    UserProfileResponseDTO buscarPerfil(Long id);

    UserProfileResponseDTO buscarPerfilAtual(String login);

    UserProfileResponseDTO atualizarPerfil(Long id, UserProfileUpdateDTO profile);

    UserProfileResponseDTO atualizarPerfilAtual(String login, UserProfileUpdateDTO profile);

    UserProfileResponseDTO atualizarAvatarAtual(String login, MultipartFile file);

    UserProfileResponseDTO removerAvatarAtual(String login);
}
