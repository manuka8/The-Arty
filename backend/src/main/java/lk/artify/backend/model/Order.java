package lk.artify.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "orders") 
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @OneToOne
    @JoinColumn(name = "seller_id")
    private Seller seller;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "artwork_id")
    private ArtWork artwork;

    @OneToOne
    @JoinColumn(name = "sales_id")
    private Sale sales;

    private Integer quantity;

    @Enumerated(EnumType.STRING)
    private SellingType sellingType; 

    private LocalDate date;

    private String frameType;

    private String province;
    private String district;
    private String address;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus deliveryStatus;

    @Column(precision = 10, scale = 2)
    private BigDecimal deliveryCharges;

    private String insuranceType;

    @Column(precision = 10, scale = 2)
    private BigDecimal insurancePrice;

    @Column(precision = 10, scale = 2)
    private BigDecimal taxes;

    @Column(precision = 10, scale = 2)
    private BigDecimal discounts;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalPrice;

    private boolean paid;

    public enum SellingType {
        AUCTION,
        FIXED_PRICE
    }

    public enum DeliveryStatus {
        PENDING_DELIVERY,
        CANCELED,
        DELIVERED,
        RETURNED
    }

    // Getters and Setters

    public Long getOrderId() {
        return orderId;
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

    public Sale getSales() {
        return sales;
    }

    public void setSales(Sale sales) {
        this.sales = sales;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public SellingType getSellingType() {
        return sellingType;
    }

    public void setSellingType(SellingType sellingType) {
        this.sellingType = sellingType;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getFrameType() {
        return frameType;
    }

    public void setFrameType(String frameType) {
        this.frameType = frameType;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public DeliveryStatus getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(DeliveryStatus deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public BigDecimal getDeliveryCharges() {
        return deliveryCharges;
    }

    public void setDeliveryCharges(BigDecimal deliveryCharges) {
        this.deliveryCharges = deliveryCharges;
    }

    public String getInsuranceType() {
        return insuranceType;
    }

    public void setInsuranceType(String insuranceType) {
        this.insuranceType = insuranceType;
    }

    public BigDecimal getInsurancePrice() {
        return insurancePrice;
    }

    public void setInsurancePrice(BigDecimal insurancePrice) {
        this.insurancePrice = insurancePrice;
    }

    public BigDecimal getTaxes() {
        return taxes;
    }

    public void setTaxes(BigDecimal taxes) {
        this.taxes = taxes;
    }

    public BigDecimal getDiscounts() {
        return discounts;
    }

    public void setDiscounts(BigDecimal discounts) {
        this.discounts = discounts;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }
}
