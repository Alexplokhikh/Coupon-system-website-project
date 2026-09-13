package com.ap.security.auth;

import com.ap.repository.UserRepository;
import com.ap.security.Role;
import com.ap.service.CustomerService;
import com.ap.utils.ex.CustomerNotFoundException;
import com.ap.utils.ex.EmailIsAlreadyInUseException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository repository;

    @PostMapping("/register-company")
    public ResponseEntity<AuthenticationResponse> registerCompany(@RequestBody RegisterCompanyRequest request) throws
            EmailIsAlreadyInUseException {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailIsAlreadyInUseException("email is already in use!");
        } else {
            return ResponseEntity.ok(service.registerCompany(request));
        }
    }

    @PostMapping("/register-customer")
    public ResponseEntity<AuthenticationResponse> registerCustomer(@RequestBody RegisterCustomerRequest request) throws
            EmailIsAlreadyInUseException {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailIsAlreadyInUseException("email is already in use!");
        } else {
            return ResponseEntity.ok(service.registerCustomer(request));
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthenticationRequest request) throws
            CustomerNotFoundException {
        if (service.authenticate(request).getToken() == null ) {
            throw new CustomerNotFoundException("no such customer!");
        } else {
            service.authenticate(request);
            return ResponseEntity.ok("customer logged in");
        }
    }
}
