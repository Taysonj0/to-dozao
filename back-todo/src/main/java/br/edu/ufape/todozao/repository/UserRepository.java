package br.edu.ufape.todozao.repository;

import br.edu.ufape.todozao.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserRepository extends JpaRepository<User, Long> {

    UserDetails findByLogin(String login);

    User findUserByLogin(String login);

    boolean existsByEmail(String email);
}
