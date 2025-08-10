package com.sandeshsudake.MesaV2.service; // Assuming this package

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.TimeUnit;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // Images: Cache for 30 days (long cache, as images don't change frequently)
        registry.addResourceHandler(
                        "/mesa-logo/**",
                        "/slider-img/**",
                        "/gallery*.jpg",
                        "/team*.jpg",
                        "/speaker*.jpg",
                        "/outgoing*.jpg",
                        "/images/**") // Ensure all image paths are covered
                .addResourceLocations(
                        "classpath:/static/mesa-logo/",
                        "classpath:/static/slider-img/",
                        "classpath:/static/", // For images directly in static
                        "classpath:/static/images/") // For images in a dedicated /static/images folder
                .setCacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic().noTransform());


        // CSS and JS: No cache (always load fresh after deploy)
        // This will force the browser to re-download these files on every visit.
        registry.addResourceHandler("/css/**", "/js/**")
                .addResourceLocations("classpath:/static/css/", "classpath:/static/js/")
                .setCacheControl(CacheControl.noStore()); // Changed to noStore()


        // HTML: No cache (always load fresh)
        // This will force the browser to re-download HTML files on every visit.
        registry.addResourceHandler("/*.html", "/") // Also apply to the root path
                .addResourceLocations("classpath:/static/")
                .setCacheControl(CacheControl.noStore()); // Changed to noStore()

        // Favicon and other root-level static files: Cache for a moderate period
        registry.addResourceHandler("/favicon.ico")
                .addResourceLocations("classpath:/static/")
                .setCacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic().noTransform());
    }
}
