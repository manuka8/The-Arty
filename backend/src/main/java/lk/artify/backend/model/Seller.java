package lk.artify.backend.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.*;

@Entity
@Table(name = "sellers")
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sellerId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String type; 

    @Column(nullable = false)
    private String businessName; 

    @Column(nullable = false)
    private String businessEmail;

    @Column(nullable = false)
    private String businessPhone;

    @Column
    private String faxNumber;

    @Column
    private String businessRegNo;

    @Column
    private String location; 

    @Column(nullable = false)
    private int rate; 

    @Column(nullable = false)
    private boolean verified = false;

    @Column(nullable = false)
    private double totalIncome;

    @Column(nullable = false)
    private String ownerNic;

    @Column(nullable = false)
    private String ownerPhone;

    @Column(nullable = false)
    private String ownerAddress;
    
    @Column(nullable=true)
    private String profile_pic;
    
    @Column(nullable = false)
    private double totalwithdrawal;
    
    @Column(nullable = false)
    private double pendingwithdrawal;
    
    @OneToMany(
            mappedBy = "seller",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
        )
        private List<ArtWork> artworks = new ArrayList<>();
    
    @OneToMany(mappedBy = "seller")
    private List<Auction> auctions;

    // Constructors
    public Seller() {}

    public Seller(User user, String type, String businessName, String businessEmail, String businessPhone,
                  String faxNumber, String businessRegNo, String location, int rate, boolean verified, double totalIncome,
                  String ownerNic, String ownerPhone, String ownerAddress,String profile_pic,double totalwithdrawal,double pendingwithdrawal) {
        this.user = user;
        this.type = type;
        this.businessName = businessName;
        this.businessEmail = businessEmail;
        this.businessPhone = businessPhone;
        this.faxNumber = faxNumber;
        this.businessRegNo = businessRegNo;
        this.location = location;
        this.setRate(rate);
        this.verified = verified;
        this.totalIncome = totalIncome;
        this.ownerNic = ownerNic;
        this.ownerPhone = ownerPhone;
        this.ownerAddress = ownerAddress;
        this.profile_pic=profile_pic;
        this.totalwithdrawal = totalwithdrawal;
		this.pendingwithdrawal = pendingwithdrawal;
    }

    

	public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getBusinessEmail() {
        return businessEmail;
    }

    public void setBusinessEmail(String businessEmail) {
        this.businessEmail = businessEmail;
    }

    public String getBusinessPhone() {
        return businessPhone;
    }

    public void setBusinessPhone(String businessPhone) {
        this.businessPhone = businessPhone;
    }

    public String getFaxNumber() {
        return faxNumber;
    }

    public void setFaxNumber(String faxNumber) {
        this.faxNumber = faxNumber;
    }

    public String getBusinessRegNo() {
        return businessRegNo;
    }

    public void setBusinessRegNo(String businessRegNo) {
        this.businessRegNo = businessRegNo;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getRate() {
        return rate;
    }

    public void setRate(int rate) {
        if (rate < 1 || rate > 10) {
            throw new IllegalArgumentException("Rate must be between 1 and 10");
        }
        this.rate = rate;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public String getOwnerNic() {
        return ownerNic;
    }

    public void setOwnerNic(String ownerNic) {
        this.ownerNic = ownerNic;
    }

    public String getOwnerPhone() {
        return ownerPhone;
    }

    public void setOwnerPhone(String ownerPhone) {
        this.ownerPhone = ownerPhone;
    }

    public String getOwnerAddress() {
        return ownerAddress;
    }

    public void setOwnerAddress(String ownerAddress) {
        this.ownerAddress = ownerAddress;
    }

	public String getProfile_pic() {
		return profile_pic;
	}

	public void setProfile_pic(String profile_pic) {
		this.profile_pic = profile_pic;
	}
	@ManyToMany(mappedBy = "followedSellers")
    private Set<User> followers = new HashSet<>();

    // Getter & Setter for followers
    public Set<User> getFollowers() {
        return followers;
    }

    public void setFollowers(Set<User> followers) {
        this.followers = followers;
    }

	public double getTotalwithdrawal() {
		return totalwithdrawal;
	}

	public void setTotalwithdrawal(double totalwithdrawal) {
		this.totalwithdrawal = totalwithdrawal;
	}

	public double getPendingwithdrawal() {
		return pendingwithdrawal;
	}

	public void setPendingwithdrawal(double pendingwithdrawal) {
		this.pendingwithdrawal = pendingwithdrawal;
	}
    
    
    
}
