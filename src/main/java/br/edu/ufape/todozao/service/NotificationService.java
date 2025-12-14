package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.model.QNotification;
import br.edu.ufape.todozao.model.Notification;
import br.edu.ufape.todozao.repository.NotificationRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository){
        this.repository = repository;
    }

    public Notification save(Notification notification) {
        return repository.save(notification);
    }

    public Optional<Notification> findById(Long id) {
        return repository.findById(id);
    }

    public List<Notification> findByTaskId(Long taskId) {
        return repository.findByTaskId(taskId);
    }

    public List<Notification> findByRead(boolean read) {
        return repository.findByRead(read);
    }

    public List<Notification> findByTaskIdAndRead(Long taskId, boolean read) {
        return repository.findByTaskIdAndRead(taskId, read);
    }

    public List<Notification> findAll() {
        return repository.findAll();
    }

    public Notification update(Long id, Notification notification) {
        Notification existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));
        
        existing.setTitle(notification.getTitle());
        existing.setMessage(notification.getMessage());
        existing.setRead(notification.isRead());
        
        return repository.save(existing);
    }

    public Notification markAsRead(Long id) {
        Notification notification = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));
        notification.setRead(true);
        return repository.save(notification);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Notification> findUnreadNotifications() {
        QNotification qNotification = QNotification.notification;
        Predicate predicate = qNotification.read.eq(false);
        return (List<Notification>) repository.findAll(predicate);
    }

    public List<Notification> findByTitleContaining(String title) {
        QNotification qNotification = QNotification.notification;
        Predicate predicate = qNotification.title.containsIgnoreCase(title);
        return (List<Notification>) repository.findAll(predicate);
    }

    public List<Notification> findByTaskIdAndUnread(Long taskId) {
        QNotification qNotification = QNotification.notification;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qNotification.task.id.eq(taskId));
        builder.and(qNotification.read.eq(false));
        return (List<Notification>) repository.findAll(builder);
    }
}

