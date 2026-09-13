package com.ap.config;

import com.ap.model.entity.Company;
import com.ap.model.entity.Coupon;
import com.ap.model.entity.Customer;
import com.ap.model.entity.Review;
import com.ap.repository.CompanyRepository;
import com.ap.repository.CouponRepository;
import com.ap.repository.CustomerRepository;
import com.ap.repository.ReviewRepository;
import com.ap.repository.UserRepository;
import com.ap.security.Role;
import com.ap.security.User;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(
        name = "app.demo-data.enabled",
        havingValue = "true"
)
public class DemoDataInitializer implements CommandLineRunner {

    private static final String CUSTOMER_EMAIL = "demo.customer@example.com";
    private static final String CUSTOMER_PASSWORD = "Demo123!";

    private final CompanyRepository companyRepository;
    private final CustomerRepository customerRepository;
    private final CouponRepository couponRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        Company company = createCompany();
        createCustomerAccount();

        List<Coupon> coupons = List.of(
                createCoupon(
                        "demo-running-shoes",
                        company.getId(),
                        "footwear",
                        "Performance Running Shoes",
                        24,
                        "Lightweight running shoes with responsive cushioning.",
                        "89.90",
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
                ),
                createCoupon(
                        "demo-winter-sweater",
                        company.getId(),
                        "clothing",
                        "Winter Sweater",
                        18,
                        "A warm and comfortable sweater for colder days.",
                        "49.90",
                        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80"
                ),
                createCoupon(
                        "demo-coffee-package",
                        company.getId(),
                        "food",
                        "Specialty Coffee Package",
                        30,
                        "Freshly roasted coffee beans from selected origins.",
                        "24.50",
                        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80"
                ),
                createCoupon(
                        "demo-weekend-getaway",
                        company.getId(),
                        "travel",
                        "Weekend Getaway",
                        10,
                        "A relaxing two-night coastal getaway for two.",
                        "199.00",
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80"
                )
        );

        coupons.forEach(company::add);
        companyRepository.save(company);

        createReview(coupons.get(0), 5.0,
                "Very comfortable and lightweight.");
        createReview(coupons.get(1), 4.0,
                "Warm, comfortable, and fits well.");
        createReview(coupons.get(2), 5.0,
                "Fresh coffee with an excellent aroma.");

        System.out.println("Sanitized demo data is ready.");
    }

    private Company createCompany() {
        return companyRepository.findByEmail("demo.company@example.com")
                .orElseGet(() -> companyRepository.save(
                        Company.builder()
                                .uuid(UUID.randomUUID().toString())
                                .name("Demo Marketplace")
                                .email("demo.company@example.com")
                                .build()
                ));
    }

    private void createCustomerAccount() {
        customerRepository.findByEmail(CUSTOMER_EMAIL)
                .orElseGet(() -> customerRepository.save(
                        Customer.builder()
                                .uuid(UUID.randomUUID().toString())
                                .firstName("Demo")
                                .lastName("Customer")
                                .email(CUSTOMER_EMAIL)
                                .build()
                ));

        if (userRepository.findByEmail(CUSTOMER_EMAIL).isEmpty()) {
            userRepository.save(
                    User.builder()
                            .email(CUSTOMER_EMAIL)
                            .password(passwordEncoder.encode(CUSTOMER_PASSWORD))
                            .role(Role.CUSTOMER)
                            .build()
            );
        }
    }

    private Coupon createCoupon(
            String uuid,
            long companyId,
            String category,
            String title,
            int amount,
            String description,
            String price,
            String imageUrl
    ) {
        return couponRepository.findByUuid(uuid)
                .orElseGet(() -> couponRepository.save(
                        Coupon.builder()
                                .uuid(uuid)
                                .companyId(companyId)
                                .category(category)
                                .title(title)
                                .startDate(Date.valueOf(LocalDate.now()))
                                .endDate(Date.valueOf(LocalDate.now().plusYears(1)))
                                .amount(amount)
                                .description(description)
                                .price(new BigDecimal(price))
                                .imageUrl(imageUrl)
                                .build()
                ));
    }

    private void createReview(
            Coupon coupon,
            double rating,
            String description
    ) {
        if (reviewRepository.existsByCouponIdAndUserEmail(
                coupon.getId(),
                CUSTOMER_EMAIL
        )) {
            return;
        }

        Review review = new Review();
        review.setUserEmail(CUSTOMER_EMAIL);
        review.setDate(Date.valueOf(LocalDate.now()));
        review.setRating(rating);
        review.setCouponId(coupon.getId());
        review.setReviewDescription(description);
        reviewRepository.save(review);
    }
}