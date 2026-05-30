package com.quizapp.service;

import com.quizapp.dto.*;
import com.quizapp.entity.*;
import com.quizapp.exception.ResourceNotFoundException;
import com.quizapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttemptService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final QuizAttemptRepository attemptRepository;
    private final AttemptAnswerRepository attemptAnswerRepository;
    private final UserRepository userRepository;

    @Transactional
    public QuizResultDTO submitQuiz(Long userId, Long quizId, QuizSubmissionDTO submission) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        List<Question> questions = questionRepository.findByQuizId(quizId);
        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        int score = 0;
        int totalPoints = questions.stream().mapToInt(Question::getPoints).sum();
        List<QuestionResultDTO> details = new ArrayList<>();

        LocalDateTime now = LocalDateTime.now();
        QuizAttempt attempt = QuizAttempt.builder()
                .user(user)
                .quiz(quiz)
                .startedAt(now.minusMinutes(quiz.getTimeLimit()))
                .completedAt(now)
                .answers(new ArrayList<>())
                .build();

        for (AnswerDTO answer : submission.getAnswers()) {
            Question question = questionMap.get(answer.getQuestionId());
            if (question == null) continue;

            Option correctOption = question.getOptions().stream()
                    .filter(Option::isCorrect)
                    .findFirst()
                    .orElse(null);

            Option selectedOption = question.getOptions().stream()
                    .filter(o -> o.getId().equals(answer.getSelectedOptionId()))
                    .findFirst()
                    .orElse(null);

            boolean isCorrect = correctOption != null && selectedOption != null
                    && correctOption.getId().equals(selectedOption.getId());

            if (isCorrect) {
                score += question.getPoints();
            }

            AttemptAnswer attemptAnswer = AttemptAnswer.builder()
                    .attempt(attempt)
                    .questionId(answer.getQuestionId())
                    .selectedOptionId(answer.getSelectedOptionId())
                    .build();
            attempt.getAnswers().add(attemptAnswer);

            details.add(QuestionResultDTO.builder()
                    .questionId(question.getId())
                    .questionText(question.getQuestionText())
                    .selectedOptionId(selectedOption != null ? selectedOption.getId() : null)
                    .selectedOptionText(selectedOption != null ? selectedOption.getOptionText() : "Not answered")
                    .correctOptionId(correctOption != null ? correctOption.getId() : null)
                    .correctOptionText(correctOption != null ? correctOption.getOptionText() : "N/A")
                    .correct(isCorrect)
                    .points(question.getPoints())
                    .build());
        }

        attempt.setScore(score);
        attempt.setTotalPoints(totalPoints);
        attemptRepository.save(attempt);

        double percentage = totalPoints > 0 ? (double) score / totalPoints * 100.0 : 0.0;

        return QuizResultDTO.builder()
                .attemptId(attempt.getId())
                .quizTitle(quiz.getTitle())
                .score(score)
                .totalPoints(totalPoints)
                .percentage(Math.round(percentage * 100.0) / 100.0)
                .startedAt(attempt.getStartedAt())
                .completedAt(attempt.getCompletedAt())
                .details(details)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AttemptSummaryDTO> getMyAttempts(Long userId) {
        return attemptRepository.findByUserIdOrderByCompletedAtDesc(userId).stream()
                .map(a -> AttemptSummaryDTO.builder()
                        .attemptId(a.getId())
                        .quizId(a.getQuiz().getId())
                        .quizTitle(a.getQuiz().getTitle())
                        .score(a.getScore())
                        .totalPoints(a.getTotalPoints())
                        .percentage(a.getTotalPoints() > 0 ? Math.round((double) a.getScore() / a.getTotalPoints() * 10000.0) / 100.0 : 0.0)
                        .completedAt(a.getCompletedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuizResultDTO getAttemptDetail(Long attemptId) {
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found with id: " + attemptId));

        Quiz quiz = attempt.getQuiz();
        List<Question> questions = questionRepository.findByQuizId(quiz.getId());
        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        List<QuestionResultDTO> details = attempt.getAnswers().stream()
                .map(ans -> {
                    Question question = questionMap.get(ans.getQuestionId());
                    if (question == null) return null;

                    Option correctOption = question.getOptions().stream()
                            .filter(Option::isCorrect).findFirst().orElse(null);
                    Option selectedOption = question.getOptions().stream()
                            .filter(o -> o.getId().equals(ans.getSelectedOptionId())).findFirst().orElse(null);

                    return QuestionResultDTO.builder()
                            .questionId(question.getId())
                            .questionText(question.getQuestionText())
                            .selectedOptionId(selectedOption != null ? selectedOption.getId() : null)
                            .selectedOptionText(selectedOption != null ? selectedOption.getOptionText() : "Not answered")
                            .correctOptionId(correctOption != null ? correctOption.getId() : null)
                            .correctOptionText(correctOption != null ? correctOption.getOptionText() : "N/A")
                            .correct(correctOption != null && selectedOption != null && correctOption.getId().equals(selectedOption.getId()))
                            .points(question.getPoints())
                            .build();
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        double percentage = attempt.getTotalPoints() > 0
                ? Math.round((double) attempt.getScore() / attempt.getTotalPoints() * 10000.0) / 100.0 : 0.0;

        return QuizResultDTO.builder()
                .attemptId(attempt.getId())
                .quizTitle(quiz.getTitle())
                .score(attempt.getScore())
                .totalPoints(attempt.getTotalPoints())
                .percentage(percentage)
                .startedAt(attempt.getStartedAt())
                .completedAt(attempt.getCompletedAt())
                .details(details)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AttemptSummaryDTO> getAllAttempts() {
        return attemptRepository.findAll().stream()
                .map(a -> AttemptSummaryDTO.builder()
                        .attemptId(a.getId())
                        .quizId(a.getQuiz().getId())
                        .quizTitle(a.getQuiz().getTitle())
                        .score(a.getScore())
                        .totalPoints(a.getTotalPoints())
                        .percentage(a.getTotalPoints() > 0 ? Math.round((double) a.getScore() / a.getTotalPoints() * 10000.0) / 100.0 : 0.0)
                        .completedAt(a.getCompletedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaderboardDTO> getLeaderboard() {
        return attemptRepository.findAllByOrderByScoreDesc().stream()
                .map(a -> LeaderboardDTO.builder()
                        .username(a.getUser().getUsername())
                        .quizTitle(a.getQuiz().getTitle())
                        .score(a.getScore())
                        .totalPoints(a.getTotalPoints())
                        .percentage(a.getTotalPoints() > 0 ? Math.round((double) a.getScore() / a.getTotalPoints() * 10000.0) / 100.0 : 0.0)
                        .completedAt(a.getCompletedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
