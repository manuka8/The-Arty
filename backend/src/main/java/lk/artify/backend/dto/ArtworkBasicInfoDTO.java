package lk.artify.backend.dto;

public class ArtworkBasicInfoDTO {
    private Long id;
    private String artworkName;

    public ArtworkBasicInfoDTO(Long id, String artworkName) {
        this.id = id;
        this.artworkName = artworkName;
    }

    public Long getId() {
        return id;
    }

    public String getArtworkName() {
        return artworkName;
    }
}