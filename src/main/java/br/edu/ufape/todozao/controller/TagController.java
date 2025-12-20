package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.dto.TagCreateDTO;
import br.edu.ufape.todozao.dto.TagResponseDTO;
import br.edu.ufape.todozao.dto.TagCreateDTO;
import br.edu.ufape.todozao.model.Tag;
import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TagResponseDTO criar(@RequestBody @Valid TagCreateDTO dto) {

        User user = mockUser();

        Tag tag = tagService.criarTag(dto.getName(), dto.getColor(), user);

        return new TagResponseDTO(
                tag.getId(),
                tag.getName(),
                tag.getColor()
        );
    }

    @GetMapping
    public List<TagResponseDTO> listar() {

        User user = mockUser();

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
    public void deletar(@PathVariable Long id) {
        tagService.deletarTag(id, mockUser());
    }

    private User mockUser() {
        User u = new User();
        u.setId(1L);
        return u;
    }
}
