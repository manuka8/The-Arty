package lk.artify.backend.model;

import jakarta.persistence.*;

@Entity
public class ArtWorkImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;    
    private String contentType; 
    @Lob
    private byte[] data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artwork_id")
    private ArtWork artWork;

    public String getFileName() {
        return fileName;
    }
    public void setFileName(String fileName) {   
        this.fileName = fileName;
    }
    public String getContentType() {
        return contentType;
    }
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    public byte[] getData() {
        return data;
    }
    public void setData(byte[] data) {
        this.data = data;
    }
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public ArtWork getArtWork() {
		return artWork;
	}
	public void setArtWork(ArtWork artWork) {
		this.artWork = artWork;
	}
    
}
