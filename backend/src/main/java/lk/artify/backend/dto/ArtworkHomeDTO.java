package lk.artify.backend.dto;

import lk.artify.backend.model.ArtWork.SellingStatus;
import java.math.BigDecimal;

public class ArtworkHomeDTO {
    private Long id;
    private String artworkName;
    private String artist;
    private String type;
    private BigDecimal price;
    private SellingStatus sellingStatus;
    private Long imageId;
    private String imageContentType;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getArtworkName() {
        return artworkName;
    }

    public void setArtworkName(String artworkName) {
        this.artworkName = artworkName;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public SellingStatus getSellingStatus() {
        return sellingStatus;
    }

    public void setSellingStatus(SellingStatus sellingStatus) {
        this.sellingStatus = sellingStatus;
    }

    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }
}