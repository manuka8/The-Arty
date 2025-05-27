package lk.artify.backend.controller;
import lk.artify.backend.model.User;
import lk.artify.backend.repository.UserRepository;
import lk.artify.backend.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    


    @PostMapping("/register")

    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Error:Email is already in use!");
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Error:Username is already taken!");
        }

        User savedUser = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        response.put("userId", savedUser.getId()); 

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        String identifier = loginData.get("identifier");
        String password = loginData.get("password");

        Optional<User> userOpt = userRepository.findByUsernameOrEmail(identifier, identifier);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (password.equals(user.getPassword())) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful!");
                response.put("userId", user.getId());
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid username/email or password."));
    }


}
