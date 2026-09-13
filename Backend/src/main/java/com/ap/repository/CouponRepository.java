package com.ap.repository;

import com.ap.model.entity.Coupon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    @Query("""
            select c
            from Coupon c
            where lower(c.title) like lower(concat('%', :title, '%'))
            """)
    Page<Coupon> findByTitleContaining(
            @Param("title") String title,
            Pageable pageable
    );

    @Query("""
            select c
            from Coupon c
            where lower(c.category) like lower(concat('%', :category, '%'))
            """)
    Page<Coupon> findByCategoryContaining(
            @Param("category") String category,
            Pageable pageable
    );

    @Query("select c from Coupon c where c.id in :coupon_ids")
    List<Coupon> findCouponsByCouponIds(@Param("coupon_ids") List<Long> couponId);

    Optional<Coupon> findByUuid(String uuid);
    }




