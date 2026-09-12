package com.ap.repository;

import com.ap.model.entity.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Optional;

import java.util.List;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Page<Coupon> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);

    Page<Coupon> findByCategoryContaining(@RequestParam(value = "category", defaultValue = "default") String category, Pageable pageable);

    @Query("select c from Coupon c where c.id in :coupon_ids")
    List<Coupon> findCouponsByCouponIds(@Param("coupon_ids") List<Long> couponId);

    Optional<Coupon> findByUuid(String uuid);
    }




