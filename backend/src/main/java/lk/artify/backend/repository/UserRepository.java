package lk.artify.backend.repository;

import lk.artify.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    Optional<User> findByUsernameOrEmail(String username, String email);
    Optional<User> findByEmail(String email);
}
