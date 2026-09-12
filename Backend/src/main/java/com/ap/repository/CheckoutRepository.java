package com.ap.repository;

import com.ap.model.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface CheckoutRepository extends JpaRepository<Checkout, Long> {

    Checkout findByUserEmailAndCouponId(String userEmail, Long couponId);

    List<Checkout> findCouponsByUserEmail(String userEmail);

}
