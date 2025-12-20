package br.edu.ufape.todozao.exception;

public class RecurrenceRuleNotFoundException extends ResourceNotFoundException {
    public RecurrenceRuleNotFoundException(Long id) {
        super("RecurrenceRule not found with id: " + id);
    }
}
