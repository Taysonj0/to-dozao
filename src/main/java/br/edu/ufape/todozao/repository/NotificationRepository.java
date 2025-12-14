package br.edu.ufape.todozao.repository;

import br.edu.ufape.todozao.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long>, QuerydslPredicateExecutor<Notification> {//solicita um repositório para Notification e o tipo da chave primária é Long
    
    List<Notification> findByTaskId(Long taskId);
    
    List<Notification> findByRead(boolean read);
    
    List<Notification> findByTaskIdAndRead(Long taskId, boolean read);



}
