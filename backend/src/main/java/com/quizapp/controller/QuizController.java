package com.quizapp.controller;

import com.quizapp.dto.QuizDTO;
import com.quizapp.dto.QuizDetailDTO;
import com.quizapp.dto.QuizResultDTO;
import com.quizapp.dto.QuizSubmissionDTO;
import com.quizapp.entity.User;
import com.quizapp.repository.UserRepository;
import com.quizapp.service.AttemptService;
import com.quizapp.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final AttemptService attemptService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<QuizDTO>> getAllActiveQuizzes() {
        return ResponseEntity.ok(quizService.getAllActiveQuizzes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizDetailDTO> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<QuizResultDTO> submitQuiz(@PathVariable Long id,
                                                     @RequestBody QuizSubmissionDTO submission) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new RuntimeException("User not found"));
        return ResponseEntity.ok(attemptService.submitQuiz(user.getId(), id, submission));
    }
}
