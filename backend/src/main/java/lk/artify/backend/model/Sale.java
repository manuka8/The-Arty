package lk.artify.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "seller_id")
    private Seller seller;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne
    @JoinColumn(name = "artwork_id")
    private ArtWork artwork;

    @Enumerated(EnumType.STRING)
    private SellingType sellingType; 

    @Column(precision = 10, scale = 2)
    private BigDecimal income;

    private boolean pendingIncome;

    private LocalDate date;

    private LocalDate incomeReleaseDate;

    @Column(precision = 10, scale = 2)
    private BigDecimal commission;

    @Column(precision = 10, scale = 2)
    private BigDecimal profit;

    public enum SellingType {
        FIXED_PRICE,
        AUCTION
    }

    @PrePersist
    public void prePersist() {
        if (this.date == null) {
            this.date = LocalDate.now();
        }
        this.incomeReleaseDate = this.date.plusWeeks(1);
        if (this.income != null) {
            this.commission = this.income.multiply(BigDecimal.valueOf(0.05));
            this.profit = this.income.subtract(this.commission);
        }
    }


    public Long getId() {
        return id;
    }

    public Seller getSeller() {
        return seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ArtWork getArtwork() {
        return artwork;
    }

    public void setArtwork(ArtWork artwork) {
        this.artwork = artwork;
    }

    public SellingType getSellingType() {
        return sellingType;
    }

    public void setSellingType(SellingType sellingType) {
        this.sellingType = sellingType;
    }

    public BigDecimal getIncome() {
        return income;
    }

    public void setIncome(BigDecimal income) {
        this.income = income;
    }

    public boolean isPendingIncome() {
        return pendingIncome;
    }

    public void setPendingIncome(boolean pendingIncome) {
        this.pendingIncome = pendingIncome;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
        if (date != null) {
            this.incomeReleaseDate = date.plusWeeks(1);
        }
    }

    public LocalDate getIncomeReleaseDate() {
        return incomeReleaseDate;
    }

    public BigDecimal getCommission() {
        return commission;
    }

    public BigDecimal getProfit() {
        return profit;
    }
}
