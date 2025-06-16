package lk.artify.backend.repository;

import lk.artify.backend.dto.ArtworkBasicInfoDTO;
import lk.artify.backend.model.ArtWork;
import lk.artify.backend.model.ArtWork.SellingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtWorkRepository extends JpaRepository<ArtWork, Long> {
    List<ArtworkBasicInfoDTO> findBySeller_sellerIdAndSellingStatus(Long sellerId, SellingStatus sellingStatus);
    List<ArtWork> findByAuctionIsNull();
    List<ArtWork> findByAuctionId(Long auctionId);
}