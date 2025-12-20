package br.edu.ufape.todozao.repository;

import br.edu.ufape.todozao.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByTaskId(Long taskId);
    List<Notification> findByRead(boolean read);
    List<Notification> findByTaskIdAndRead(Long taskId, boolean read);
}
