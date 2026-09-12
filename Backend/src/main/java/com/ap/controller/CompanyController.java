package com.ap.controller;

import com.ap.repository.CompanyService;
import com.ap.requestmodels.AddCouponRequest;
import com.ap.security.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/secure/api/company")
public class CompanyController {

    private CompanyService companyService;

    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/add/coupon")
    public void postCoupon(@RequestHeader(value = "Authorization") String token,
                           @RequestBody AddCouponRequest addCouponRequest) throws Exception {
        String company = ExtractJWT.payloadJWTExtraction(token, "roles");

        if (company == null || !company.equals("[COMPANY]")) {
                throw new Exception("Company page only!");
            }

        companyService.postCoupon(addCouponRequest);
    }
}
