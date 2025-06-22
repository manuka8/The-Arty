package lk.artify.backend.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "dlohvmei6",
            "api_key", "592418275837558",
            "api_secret", "Ip5aO9s1xniR02BYPT1SD6hgIZk"
        ));
    }
}
