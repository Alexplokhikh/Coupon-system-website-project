package com.ap.controller;

import com.ap.model.entity.Coupon;
import com.ap.model.response.ProfileCurrentPurchasesResponse;
import com.ap.security.config.JwtService;
import com.ap.security.utils.ExtractJWT;
import com.ap.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/secure/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private CouponService couponService;

    @Autowired
    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @GetMapping("/currentpurchases")
    public List<ProfileCurrentPurchasesResponse> currentPurchases(@RequestHeader(value = "Authorization") String token)
            throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "sub");
        return couponService.currentPurchases(userEmail);
    }

    @GetMapping("/currentpurchases/count")
    public int currentPurchasesCount(@RequestHeader(value = "Authorization") String token) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "sub");
        return couponService.currentPurchasesCount(userEmail);
    }

    @GetMapping("/ischeckedout/byuser")
    public Boolean checkoutCouponByUser(@RequestHeader(value = "Authorization") String token,
                                        @RequestParam Long couponId) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "sub");
        return couponService.checkoutCouponByUser(userEmail, couponId);
    }

    @PutMapping("/checkout")
    public Coupon checkoutCoupon(@RequestHeader(value = "Authorization") String token,
                                 @RequestParam Long couponId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "sub");
        return couponService.checkoutCoupon(userEmail, couponId);
    }

    @PutMapping("/remove")
    public void removeCoupon(@RequestHeader(value = "Authorization")String token,
                             @RequestParam Long couponId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token,"sub");
        couponService.removeCoupon(userEmail, couponId);
    }
}
