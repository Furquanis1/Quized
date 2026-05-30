package com.quizapp.controller;

import com.quizapp.dto.AttemptSummaryDTO;
import com.quizapp.dto.QuizResultDTO;
import com.quizapp.dto.LeaderboardDTO;
import com.quizapp.entity.User;
import com.quizapp.repository.UserRepository;
import com.quizapp.service.AttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attempts")
@RequiredArgsConstructor
public class AttemptController {

    private final AttemptService attemptService;
    private final UserRepository userRepository;

    @GetMapping("/my")
    public ResponseEntity<List<AttemptSummaryDTO>> getMyAttempts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new RuntimeException("User not found"));
        return ResponseEntity.ok(attemptService.getMyAttempts(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizResultDTO> getAttemptDetail(@PathVariable Long id) {
        return ResponseEntity.ok(attemptService.getAttemptDetail(id));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardDTO>> getLeaderboard() {
        return ResponseEntity.ok(attemptService.getLeaderboard());
    }
}
