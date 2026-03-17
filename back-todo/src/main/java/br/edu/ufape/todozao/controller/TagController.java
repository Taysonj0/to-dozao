package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.dto.TagCreateDTO;
import br.edu.ufape.todozao.dto.TagResponseDTO;
import br.edu.ufape.todozao.exception.UnauthorizedTagAccessException;
import br.edu.ufape.todozao.model.Tag;
import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.repository.UserRepository;
import br.edu.ufape.todozao.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;
    private final UserRepository userRepository;

    public TagController(TagService tagService, UserRepository userRepository) {
        this.tagService = tagService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TagResponseDTO criar(@RequestBody @Valid TagCreateDTO dto, Authentication authentication) {

        User user = resolveAuthenticatedUser(authentication);

        Tag tag = tagService.criarTag(dto.getName(), dto.getColor(), user);

        return new TagResponseDTO(
                tag.getId(),
                tag.getName(),
                tag.getColor()
        );
    }

    @PutMapping("/{id}")
    public TagResponseDTO atualizar(@PathVariable Long id, @RequestBody @Valid TagCreateDTO dto, Authentication authentication) {

        User user = resolveAuthenticatedUser(authentication);

        Tag tag = tagService.atualizarTag(id, dto.getName(), dto.getColor(), user);

        return new TagResponseDTO(
                tag.getId(),
                tag.getName(),
                tag.getColor()
        );
    }

    @GetMapping
    public List<TagResponseDTO> listar(Authentication authentication) {

        User user = resolveAuthenticatedUser(authentication);

        return tagService.listarTagsDoUsuario(user)
                .stream()
                .map(tag -> new TagResponseDTO(
                        tag.getId(),
                        tag.getName(),
                        tag.getColor()
                ))
                .toList();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id, Authentication authentication) {
        tagService.deletarTag(id, resolveAuthenticatedUser(authentication));
    }

    private User resolveAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new UnauthorizedTagAccessException();
        }

        User user = userRepository.findUserByLogin(authentication.getName());

        if (user == null) {
            throw new UnauthorizedTagAccessException();
        }

        return user;
    }
}
