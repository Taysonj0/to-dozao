package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.model.Tag;
import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Tag criarTag(@RequestBody @Valid Tag tag) {

        User user = mockUser();

        return tagService.criarTag(
                tag.getName(),
                tag.getColor(),
                user
        );
    }

    @GetMapping
    public List<Tag> listarTags() {

        User user = mockUser();

        return tagService.listarTagsDoUsuario(user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarTag(@PathVariable Long id) {

        User user = mockUser();

        tagService.deletarTag(id, user);
    }

    private User mockUser() {
        User user = new User();
        user.setId(1L);
        return user;
    }
}
