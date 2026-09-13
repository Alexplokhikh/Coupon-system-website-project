package com.ap.controller;

import com.ap.model.request.ReviewRequest;
import com.ap.security.utils.ExtractJWT;
import com.ap.service.ReviewService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/secure/api/reviews")
public class ReviewController {

    private ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public void postReview(@RequestHeader(value = "Authorization") String token,
                           @RequestBody ReviewRequest reviewRequest) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "sub");
        if (userEmail == null) {
            throw new Exception("User email is missing");
        }
        reviewService.postReview(userEmail, reviewRequest);
    }

    @GetMapping("/user/coupon")
    public boolean reviewCouponByUser(@RequestHeader(value = "Authorization")String token,
                                    @RequestParam Long couponId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "sub");

        if (userEmail == null) {
            throw new Exception("User email is missing");
        }
        return reviewService.userReviewListed(userEmail, couponId);
    }
}
