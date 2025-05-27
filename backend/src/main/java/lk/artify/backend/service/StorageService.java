package lk.artify.backend.service;

import lk.artify.backend.model.ArtWork;
import lk.artify.backend.model.ArtWorkImage;
import lk.artify.backend.repository.ArtWorkImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class StorageService {

    private final ArtWorkImageRepository imageRepository;

    public StorageService(ArtWorkImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public List<ArtWorkImage> storeArtworkImages(List<MultipartFile> files, ArtWork artWork) throws IOException {
        List<ArtWorkImage> imageList = new ArrayList<>();

        for (MultipartFile file : files) {
            ArtWorkImage image = new ArtWorkImage();
            image.setFileName(file.getOriginalFilename());
            image.setContentType(file.getContentType());
            image.setData(file.getBytes());
            image.setArtWork(artWork); 

            imageList.add(imageRepository.save(image));
        }

        return imageList;
    }
}

