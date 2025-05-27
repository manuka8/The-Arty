package lk.artify.backend.service;

import lk.artify.backend.model.ArtWork; 
import lk.artify.backend.model.ArtWorkImage;
import lk.artify.backend.repository.ArtWorkImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ArtWorkImageService {

    @Autowired
    private ArtWorkImageRepository imageRepository;

    public ArtWorkImage storeImage(MultipartFile file, ArtWork artWork) throws IOException {
        ArtWorkImage image = new ArtWorkImage();
        image.setFileName(file.getOriginalFilename());
        image.setContentType(file.getContentType());
        image.setData(file.getBytes());
        image.setArtWork(artWork);
        return imageRepository.save(image);
    }
}

