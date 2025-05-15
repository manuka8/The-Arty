package lk.artify.backend.repository;

import lk.artify.backend.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {
	Seller findByUserId(Long id);
}
