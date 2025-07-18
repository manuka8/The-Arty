package lk.artify.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class ArtWork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String artworkName;
    private String type;
    private String subType;
    private String artist;
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal price; 


    
    @Column(precision = 10, scale = 2)
    private BigDecimal price_of_copy;
    
    private String unit;
    
    private Integer widthOfArt; 
    
    private Integer heightOfArt;
    
    private Integer lengthOfArt;
    private boolean availability;

    private LocalDate addedDate;

    private Integer availablecopies; 

    private boolean approved;
    
    @OneToMany(mappedBy = "artWork", cascade = CascadeType.ALL)
    private List<ArtWorkImage> images = new ArrayList<>();


    @Enumerated(EnumType.STRING)
    private SellingStatus sellingStatus;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private Seller seller;
    
    @ManyToOne
    @JoinColumn(name = "auction_id")
    private Auction auction;

    @Column(precision = 10, scale = 2)
    private BigDecimal minimumBid;

    @Column(precision = 10, scale = 2)
    private BigDecimal currentBid;
    

    
    
    public enum SellingStatus{
    	AVAILABLE,
    	SOLD_OUT,
    	PENDING_AUCTION
    }
    


    public Long getId() {
        return id;
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
    
    

    public String getSubType() {
		return subType;
	}

	public void setSubType(String subType) {
		this.subType = subType;
	}

	public void setType(String type) {
        this.type = type;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }
    
    public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setId(Long id) {
		this.id = id;
	}

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

   
    public boolean isAvailability() {
        return availability;
    }

    public void setAvailability(boolean availability) {
        this.availability = availability;
    }

    public LocalDate getAddedDate() {
        return addedDate;
    }

    public void setAddedDate(LocalDate addedDate) {
        this.addedDate = addedDate;
    }

    

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

	

	public BigDecimal getPrice_of_copy() {
		return price_of_copy;
	}

	public void setPrice_of_copy(BigDecimal price_of_copy) {
		this.price_of_copy = price_of_copy;
	}

	public SellingStatus getSellinStatus() {
		return sellingStatus;
	}

	public void setSellinStatus(SellingStatus sellinStatus) {
		this.sellingStatus = sellinStatus;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Integer getWidthOfArt() {
		return widthOfArt;
	}

	public void setWidthOfArt(Integer widthOfArt) {
		this.widthOfArt = widthOfArt;
	}

	public Integer getHeightOfArt() {
		return heightOfArt;
	}

	public void setHeightOfArt(Integer heightOfArt) {
		this.heightOfArt = heightOfArt;
	}

	public Integer getLengthOfArt() {
		return lengthOfArt;
	}

	public void setLengthOfArt(Integer lengthOfArt) {
		this.lengthOfArt = lengthOfArt;
	}
    
	public List<ArtWorkImage> getImages() {
	    return images;
	}

	public Integer getAvailablecopies() {
		return availablecopies;
	}

	

	public BigDecimal getCurrentBid() {
		return currentBid;
	}

	public void setCurrentBid(BigDecimal currentBid) {
		this.currentBid = currentBid;
	}

	public Auction getAuction() {
		return auction;
	}

	public BigDecimal getMinimumBid() {
		return minimumBid;
	}

	public void setImages(List<ArtWorkImage> images) {
	    this.images = images;
	}

	public SellingStatus getSellingStatus() {
		return sellingStatus;
	}

	public void setSellingStatus(SellingStatus sellingStatus) {
		this.sellingStatus = sellingStatus;
	}

	public Seller getSeller() {
		return seller;
	}

	public void setSeller(Seller seller) {
		this.seller = seller;
	}
	public void setAuction(Auction auction) {
        this.auction = auction;
    }
	public void setMinimumBid(BigDecimal minimumBid) {
	    this.minimumBid = minimumBid;
	}

	public void setAvailablecopies(Integer minimumQuantityPerBuyer) {
		this.availablecopies = availablecopies;
		
	}

}
