package com.app.account.MvcConfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir.windows}")
    private String windowsUploadDir;

    @Value("${file.upload-dir.linux}")
    private String linuxUploadDir;

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("login");
        registry.addViewController("/login").setViewName("login");
        registry.addViewController("/home").setViewName("/home");

        registry.addViewController("/plant-home").setViewName("plant/home");
        registry.addViewController("/unloading-point").setViewName("plant/unloading-point");
        registry.addViewController("/weigh-bridge").setViewName("plant/weigh-bridge");
        registry.addViewController("/contract-form").setViewName("plant/contract-form");
        registry.addViewController("/token").setViewName("plant/token");
        registry.addViewController("/token-data-update").setViewName("plant/token-data-update");
        registry.addViewController("/gross-weight").setViewName("plant/gross-weight");
        registry.addViewController("/tare-weight").setViewName("plant/tare-weight");
        registry.addViewController("/quality-check").setViewName("plant/quality-check");
        registry.addViewController("/bill-generation").setViewName("plant/bill-generation");
        registry.addViewController("/bill-payment").setViewName("plant/bill-payment");
        registry.addViewController("/hold-bill-payment").setViewName("plant/hold-bill-payment");
        registry.addViewController("/paid-bill").setViewName("plant/paid-bill");
        registry.addViewController("/report").setViewName("plant/report");

        registry.addViewController("/user-guide").setViewName("user-guide");
        registry.addViewController("/release-notes").setViewName("release-notes");
        registry.addViewController("/privacy-policy").setViewName("privacy-policy");
        registry.addViewController("/profile").setViewName("profile");

        registry.addViewController("/404").setViewName("error404");
        registry.addViewController("/403").setViewName("error403");
        registry.addViewController("/505").setViewName("error500");

    }

    // @Override
    // public void addResourceHandlers(final ResourceHandlerRegistry registry) {
    // registry.addResourceHandler("/uploads/**").addResourceLocations("file:C:/upload/srmps/");
    // }

    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        String os = System.getProperty("os.name").toLowerCase();
        String uploadDir;

        if (os.contains("win")) {
            uploadDir = windowsUploadDir;
        } else {
            uploadDir = linuxUploadDir;
        }

        registry.addResourceHandler("/uploads/**").addResourceLocations("file:" + uploadDir + "/");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginPageInterceptor());
    }

}