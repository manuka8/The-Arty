package lk.artify.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "followers", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "seller_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Follower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;
}
