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
                        "/mesa-team/**", // <-- CRITICAL FIX: Added this resource handler
                        "/gallery*.jpg",
                        "/team*.jpg",
                        "/speaker*.jpg",
                        "/outgoing*.jpg",
                        "/images/**")
                .addResourceLocations(
                        "classpath:/static/mesa-logo/",
                        "classpath:/static/slider-img/",
                        "classpath:/static/mesa-team/", // <-- CRITICAL FIX: Added this resource location
                        "classpath:/static/", // For images directly in static
                        "classpath:/static/images/")
                .setCacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic().noTransform());


        // CSS and JS: No cache (always load fresh after deploy)
        registry.addResourceHandler("/css/**", "/js/**")
                .addResourceLocations("classpath:/static/css/", "classpath:/static/js/")
                .setCacheControl(CacheControl.noStore());


        // HTML: No cache (always load fresh)
        registry.addResourceHandler("/*.html", "/")
                .addResourceLocations("classpath:/static/")
                .setCacheControl(CacheControl.noStore());

        // Favicon and other root-level static files: Cache for a moderate period
        registry.addResourceHandler("/favicon.ico")
                .addResourceLocations("classpath:/static/")
                .setCacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic().noTransform());
    }
}
