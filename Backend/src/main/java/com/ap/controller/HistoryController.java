package com.ap.controller;

import com.ap.model.entity.History;
import com.ap.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/secure/api/histories")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryRepository historyRepository;

    @GetMapping
    public Page<History> currentUserHistory(
            Authentication authentication,
            Pageable pageable
    ) {
        return historyRepository.findByUserEmail(
                authentication.getName(),
                pageable
        );
    }
}