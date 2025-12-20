package br.edu.ufape.todozao.exception;

public class SubtaskNotFoundException extends ResourceNotFoundException {
    public SubtaskNotFoundException(Long id) {
        super("Subtask not found with id: " + id);
    }
}
