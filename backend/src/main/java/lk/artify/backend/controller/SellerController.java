package lk.artify.backend.controller;

import lk.artify.backend.model.Seller;
import lk.artify.backend.model.User;
import lk.artify.backend.repository.SellerRepository;
import lk.artify.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/sellers")
@CrossOrigin(origins = "*")
public class SellerController {

    private static final String UPLOAD_DIR = "uploads/";

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerSeller(
            @RequestParam Long userId,
            @RequestParam String type,
            @RequestParam String businessName,
            @RequestParam String businessEmail,
            @RequestParam String businessPhone,
            @RequestParam(required = false) String faxNumber,
            @RequestParam(required = false) String businessRegNo,
            @RequestParam(required = false) String location,
            @RequestParam String ownerNic,
            @RequestParam String ownerPhone,
            @RequestParam String ownerAddress,
            @RequestParam(required = false) MultipartFile profilePicture
    ) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found.");
            }

            Seller seller = new Seller();
            seller.setUser(userOpt.get());
            seller.setType(type);
            seller.setBusinessName(businessName);
            seller.setBusinessEmail(businessEmail);
            seller.setBusinessPhone(businessPhone);
            seller.setFaxNumber(faxNumber);
            seller.setBusinessRegNo(businessRegNo);
            seller.setLocation(location);
            seller.setOwnerNic(ownerNic);
            seller.setOwnerPhone(ownerPhone);
            seller.setOwnerAddress(ownerAddress);
            seller.setVerified(false);
            seller.setRate(1);
            seller.setTotalIncome(0.0);

            if (profilePicture != null && !profilePicture.isEmpty()) {
                String filename = UUID.randomUUID() + "_" + StringUtils.cleanPath(profilePicture.getOriginalFilename());
                Path uploadPath = Paths.get(UPLOAD_DIR);
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(filename);
                Files.copy(profilePicture.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                seller.setProfile_pic("/uploads/" + filename);
            }

            Seller savedSeller = sellerRepository.save(seller); 


            Map<String, Object> response = new HashMap<>();
            response.put("message", "Seller registered successfully.");
            response.put("seller_id", savedSeller.getSellerId());

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error uploading file: " + e.getMessage());
        }
    }
    
    @GetMapping("/{sellerId}")
    public ResponseEntity<Seller> getSellerById(@PathVariable Long sellerId) {
        Optional<Seller> seller = sellerRepository.findById(sellerId);
        return seller.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/byUser/{userId}")
    public ResponseEntity<?> getSellerByUserId(@PathVariable Long userId) {
        Seller seller = sellerRepository.findByUserId(userId);
        if (seller != null) {
            return ResponseEntity.ok(seller);
        } else {
            return ResponseEntity.status(404).body("Seller not found for user ID: " + userId);
        }
    }

}
