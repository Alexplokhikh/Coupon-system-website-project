package com.ap.repository;

import com.ap.model.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@Repository
@RepositoryRestResource(exported = false)
public interface CompanyRepository extends JpaRepository<Company, Long> {



}
