package lk.artify.backend.controller;

import lk.artify.backend.model.ArtWork;
import lk.artify.backend.model.ArtWork.SellingStatus;
import lk.artify.backend.model.ArtWorkImage;
import lk.artify.backend.model.Seller;
import lk.artify.backend.repository.ArtWorkRepository;
import lk.artify.backend.repository.SellerRepository;
import lk.artify.backend.service.ArtWorkImageService;
import lk.artify.backend.dto.ArtworkBasicInfoDTO;
import lk.artify.backend.dto.ArtworkHomeDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/artworks")
@CrossOrigin(origins = "*")
public class ArtworkController {

    @Autowired
    private ArtWorkRepository artWorkRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private ArtWorkImageService artWorkImageService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createArtwork(
        @RequestParam String artworkName,
        @RequestParam String type,
        @RequestParam(required = false) String subType,
        @RequestParam(required = false) String artist,
        @RequestParam String description,
        @RequestParam(required = false) BigDecimal price,
        @RequestParam boolean copyAvailability,
        @RequestParam(required = false) ArtWork.ArtCopyType artCopyType,
        @RequestParam(required = false) Integer noOfCopies,
        @RequestParam(required = false) BigDecimal price_of_copy,
        @RequestParam(required = false) String unit,
        @RequestParam(required = false) Integer widthOfArt,
        @RequestParam(required = false) Integer heightOfArt,
        @RequestParam(required = false) Integer lengthOfArt,
        @RequestParam boolean availability,
        @RequestParam(required = false) Integer minimumQuantityPerBuyer,
        @RequestParam ArtWork.SellingStatus sellinStatus,
        @RequestParam Long sellerId,
        @RequestParam("images") List<MultipartFile> images
    ) {
        try {
            ArtWork artWork = new ArtWork();
            artWork.setArtworkName(artworkName);
            artWork.setType(type);
            artWork.setSubType(subType);
            artWork.setArtist(artist);
            artWork.setDescription(description);
            artWork.setPrice(price);
            artWork.setCopyAvailability(copyAvailability);
            artWork.setArtCopyType(artCopyType);
            artWork.setNoOfCopies(noOfCopies);
            artWork.setPrice_of_copy(price_of_copy);
            artWork.setUnit(unit);
            artWork.setWidthOfArt(widthOfArt);
            artWork.setHeightOfArt(heightOfArt);
            artWork.setLengthOfArt(lengthOfArt);
            artWork.setAvailability(availability);
            artWork.setMinimumQuantityPerBuyer(minimumQuantityPerBuyer);
            artWork.setSellingStatus(sellinStatus);
            artWork.setApproved(false);
            artWork.setAddedDate(LocalDate.now());

            Seller seller = sellerRepository.findById(sellerId)
                    .orElseThrow(() -> new IllegalArgumentException("Seller not found"));
            artWork.setSeller(seller);

            ArtWork savedArtWork = artWorkRepository.save(artWork);

            List<ArtWorkImage> imageEntities = new ArrayList<>();
            for (MultipartFile imageFile : images) {
                ArtWorkImage image = artWorkImageService.storeImage(imageFile, savedArtWork);
                imageEntities.add(image);
            }

            savedArtWork.setImages(imageEntities);
            artWorkRepository.save(savedArtWork); 

            return ResponseEntity.ok().body("{\"success\": true}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("{\"success\": false, \"message\": \"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping
    public List<ArtworkBasicInfoDTO> getArtworksBySellerAndStatus(
            @RequestParam Long sellerId,
            @RequestParam SellingStatus status) {
        
        return artWorkRepository.findBySeller_sellerIdAndSellingStatus(sellerId, status)
                .stream()
                .map(artwork -> new ArtworkBasicInfoDTO(
                        artwork.getId(),
                        artwork.getArtworkName()))
                .collect(Collectors.toList());
    }

    // New endpoint for home screen
    @GetMapping("/home")
    public ResponseEntity<List<ArtworkHomeDTO>> getArtworksForHome(
            @RequestParam(required = false) Long auctionId) {
        
        // Get artworks that are not in any auction (auctionId is null)
        List<ArtWork> artworks;
        if (auctionId != null) {
            artworks = artWorkRepository.findByAuctionId(auctionId);
        } else {
            artworks = artWorkRepository.findByAuctionIsNull();
        }

        // Convert to DTOs with image data
        List<ArtworkHomeDTO> result = artworks.stream()
                .map(artwork -> {
                    ArtworkHomeDTO dto = new ArtworkHomeDTO();
                    dto.setId(artwork.getId());
                    dto.setArtworkName(artwork.getArtworkName());
                    dto.setArtist(artwork.getArtist());
                    dto.setType(artwork.getType());
                    dto.setPrice(artwork.getPrice());
                    dto.setSellingStatus(artwork.getSellingStatus());
                    
                    // Get first image if available
                    if (!artwork.getImages().isEmpty()) {
                        ArtWorkImage firstImage = artwork.getImages().get(0);
                        dto.setImageId(firstImage.getId());
                        dto.setImageContentType(firstImage.getContentType());
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}