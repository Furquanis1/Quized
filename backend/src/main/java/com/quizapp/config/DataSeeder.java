package com.quizapp.config;

import com.quizapp.entity.*;
import com.quizapp.repository.QuizRepository;
import com.quizapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedQuizzes();
        log.info("=== Data seeding completed ===");
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        User admin = User.builder()
                .username("admin")
                .email("admin@quiz.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN)
                .build();

        User user = User.builder()
                .username("user")
                .email("user@quiz.com")
                .password(passwordEncoder.encode("user123"))
                .role(User.Role.USER)
                .build();

        userRepository.saveAll(List.of(admin, user));
        log.info("Seeded users: admin, user");
    }

    private void seedQuizzes() {
        if (quizRepository.count() > 0) return;

        // Quiz 1: Java Fundamentals
        Quiz javaQuiz = Quiz.builder()
                .title("Java Fundamentals")
                .description("Test your knowledge of core Java concepts including OOP, collections, and language features.")
                .timeLimit(10)
                .active(true)
                .build();

        Question jq1 = createQuestion(javaQuiz, "Which of the following is NOT a pillar of Object-Oriented Programming?", 2,
                new String[]{"Encapsulation", "Compilation", "Inheritance", "Polymorphism"}, 1);
        Question jq2 = createQuestion(javaQuiz, "What is the default value of a boolean instance variable in Java?", 2,
                new String[]{"true", "false", "null", "0"}, 1);
        Question jq3 = createQuestion(javaQuiz, "Which collection class allows duplicate elements and maintains insertion order?", 2,
                new String[]{"HashSet", "TreeSet", "ArrayList", "HashMap"}, 2);
        Question jq4 = createQuestion(javaQuiz, "What keyword is used to prevent a class from being inherited?", 2,
                new String[]{"static", "abstract", "final", "private"}, 2);
        Question jq5 = createQuestion(javaQuiz, "Which interface must a class implement to be used in a try-with-resources statement?", 2,
                new String[]{"Serializable", "Cloneable", "AutoCloseable", "Iterable"}, 2);

        javaQuiz.setQuestions(Arrays.asList(jq1, jq2, jq3, jq4, jq5));
        quizRepository.save(javaQuiz);

        // Quiz 2: Python Basics
        Quiz pythonQuiz = Quiz.builder()
                .title("Python Basics")
                .description("Test your understanding of Python fundamentals including syntax, data types, and built-in functions.")
                .timeLimit(8)
                .active(true)
                .build();

        Question pq1 = createQuestion(pythonQuiz, "What is the output of print(type([]))?", 2,
                new String[]{"<class 'tuple'>", "<class 'list'>", "<class 'dict'>", "<class 'set'>"}, 1);
        Question pq2 = createQuestion(pythonQuiz, "Which keyword is used to define a function in Python?", 2,
                new String[]{"function", "func", "def", "define"}, 2);
        Question pq3 = createQuestion(pythonQuiz, "What does the 'len()' function return when called on a dictionary?", 2,
                new String[]{"Number of values", "Number of key-value pairs", "Total memory size", "Number of unique values"}, 1);
        Question pq4 = createQuestion(pythonQuiz, "Which of the following is an immutable data type in Python?", 2,
                new String[]{"List", "Dictionary", "Set", "Tuple"}, 3);
        Question pq5 = createQuestion(pythonQuiz, "What operator is used for floor division in Python?", 2,
                new String[]{"/", "//", "%", "**"}, 1);

        pythonQuiz.setQuestions(Arrays.asList(pq1, pq2, pq3, pq4, pq5));
        quizRepository.save(pythonQuiz);

        // Quiz 3: General Knowledge
        Quiz gkQuiz = Quiz.builder()
                .title("General Knowledge")
                .description("A fun mix of geography, science, and history questions to test your general knowledge.")
                .timeLimit(5)
                .active(true)
                .build();

        Question gq1 = createQuestion(gkQuiz, "What is the largest planet in our solar system?", 2,
                new String[]{"Mars", "Saturn", "Jupiter", "Neptune"}, 2);
        Question gq2 = createQuestion(gkQuiz, "Which country is home to the Great Barrier Reef?", 2,
                new String[]{"Brazil", "Australia", "Indonesia", "Mexico"}, 1);
        Question gq3 = createQuestion(gkQuiz, "What is the chemical symbol for gold?", 2,
                new String[]{"Go", "Gd", "Au", "Ag"}, 2);
        Question gq4 = createQuestion(gkQuiz, "In which year did World War II end?", 2,
                new String[]{"1943", "1944", "1945", "1946"}, 2);
        Question gq5 = createQuestion(gkQuiz, "What is the smallest continent by land area?", 2,
                new String[]{"Europe", "Antarctica", "Australia", "South America"}, 2);

        gkQuiz.setQuestions(Arrays.asList(gq1, gq2, gq3, gq4, gq5));
        quizRepository.save(gkQuiz);

        log.info("Seeded 3 quizzes with 5 questions each");
    }

    private Question createQuestion(Quiz quiz, String text, int points, String[] optionTexts, int correctIndex) {
        Question question = Question.builder()
                .quiz(quiz)
                .questionText(text)
                .points(points)
                .build();

        List<Option> options = new java.util.ArrayList<>();
        for (int i = 0; i < optionTexts.length; i++) {
            options.add(Option.builder()
                    .question(question)
                    .optionText(optionTexts[i])
                    .correct(i == correctIndex)
                    .build());
        }
        question.setOptions(options);
        return question;
    }
}
