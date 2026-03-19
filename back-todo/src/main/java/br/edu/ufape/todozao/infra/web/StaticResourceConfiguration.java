package br.edu.ufape.todozao.infra.web;

import br.edu.ufape.todozao.infra.storage.AvatarStoragePaths;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfiguration implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(AvatarStoragePaths.UPLOADS_ROOT.toUri().toString());
    }
}