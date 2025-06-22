package lk.artify.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class ArtWorkDTO {
	private Long id;
    private String artworkName;
    private String type; // ✅ new field
    private String sellingStatus;
    private boolean availability;
    private List<String> imageUrls;
    private BigDecimal price;
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
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
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getSellingStatus() {
		return sellingStatus;
	}
	public void setSellingStatus(String sellingStatus) {
		this.sellingStatus = sellingStatus;
	}
	public boolean isAvailability() {
		return availability;
	}
	public void setAvailability(boolean availability) {
		this.availability = availability;
	}
	public List<String> getImageUrls() {
		return imageUrls;
	}
	public void setImageUrls(List<String> imageUrls) {
		this.imageUrls = imageUrls;
	}

    
}

