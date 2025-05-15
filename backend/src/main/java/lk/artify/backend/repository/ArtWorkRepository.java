package lk.artify.backend.repository;

import lk.artify.backend.model.ArtWork;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtWorkRepository extends JpaRepository<ArtWork, Long> {
	List<ArtWork> findBySeller_SellerId(Long sellerId);
}
