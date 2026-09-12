package com.ap.repository;

import com.ap.model.entity.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface HistoryRepository extends JpaRepository<History, Long> {
    Page<History> findByUserEmail(String userEmail, Pageable pageable);
}
