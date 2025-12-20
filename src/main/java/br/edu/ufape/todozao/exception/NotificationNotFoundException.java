package br.edu.ufape.todozao.exception;

public class NotificationNotFoundException extends ResourceNotFoundException {
    public NotificationNotFoundException(Long id) {
        super("Notification not found with id: " + id);
    }
}
