package lk.artify.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lk.artify.backend.model.User;
import lk.artify.backend.repository.UserRepository;
import lk.artify.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("profile_pic", user.getProfile_pic()); 
            response.put("verify", user.isVerify()); 
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
    
    
    @Autowired
    private EmailService emailService;
    
    private Map<String, Integer> verificationCodes = new HashMap<>();

    @PostMapping("/send-code")
    public ResponseEntity<?> sendVerificationCode(@RequestParam String email) {
    	Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = userOpt.get();
        if (user.isVerify()) {
            return ResponseEntity.badRequest().body("Email already verified");
        }
        
        int code = new Random().nextInt(900000) + 100000;
        verificationCodes.put(email, code);
        
        String subject = "Your Artify Verification Code";
        String message = "Your verification code is: " + code;
        emailService.sendEmail(email, subject, message);
        
        return ResponseEntity.ok("Verification code sent");
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestParam String email, 
                                       @RequestParam int code) {
    	Optional<User> userOpt = userRepository.findByEmail(email);
    	if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        
    	User user = userOpt.get();

        Integer storedCode = verificationCodes.get(email);
        if (storedCode == null || storedCode != code) {
            return ResponseEntity.badRequest().body("Invalid verification code");
        }
        
        if (!user.isVerify()) {
            user.setVerify(true);
            userRepository.save(user);
            
            verificationCodes.remove(email);
            
            return ResponseEntity.ok("Email verified successfully");
        }
        
        return ResponseEntity.ok("Email verified successfully");
    }

}

