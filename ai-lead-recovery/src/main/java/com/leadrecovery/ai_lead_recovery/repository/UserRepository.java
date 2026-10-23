
package com.leadrecovery.ai_lead_recovery.repository;

import com.leadrecovery.ai_lead_recovery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
