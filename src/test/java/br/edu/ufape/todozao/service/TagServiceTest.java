package br.edu.ufape.todozao.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.*;

import br.edu.ufape.todozao.model.Tag;
import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.repository.TagRepository;

@ExtendWith(MockitoExtension.class)
class TagServiceTest {

    @Mock
    private TagRepository tagRepository;

    @InjectMocks
    private TagService tagService;

    @Test
    void deveCriarTagComSucesso() {

        User user = new User();
        user.setId(1L);

        when(tagRepository.existsByNameAndUserId("Estudo", 1L))
                .thenReturn(false);

        when(tagRepository.save(any(Tag.class)))
                .thenAnswer(invocation -> {
                    Tag tag = invocation.getArgument(0);
                    tag.setId(10L);
                    return tag;
                });

        Tag tag = tagService.criarTag("Estudo", "Azul", user);

        assertNotNull(tag);
        assertEquals("Estudo", tag.getName());
        assertEquals("Azul", tag.getColor());
        assertEquals(10L, tag.getId());
    }

    @Test
    void naoDeveCriarTagDuplicada() {

        User user = new User();
        user.setId(1L);

        when(tagRepository.existsByNameAndUserId("Estudo", 1L))
                .thenReturn(true);

        assertThrows(IllegalArgumentException.class, () ->
                tagService.criarTag("Estudo", "Azul", user)
        );
    }
}
