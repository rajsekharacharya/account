package com.app.account.MvcConfig;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("login");
        registry.addViewController("/login").setViewName("login");
        registry.addViewController("/dashboard").setViewName("/dashboard");
        registry.addViewController("/user-management").setViewName("/user-management");
        registry.addViewController("/particular-master").setViewName("/particular-master");
        registry.addViewController("/balance").setViewName("/balance");
        registry.addViewController("/transaction").setViewName("/transaction");
        registry.addViewController("/balance-sheet").setViewName("/balance-sheet");
        registry.addViewController("/head-balance-sheet").setViewName("/head-balance-sheet");

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
    //     String os = System.getProperty("os.name").toLowerCase();
    //     String uploadDir;

    //     if (os.contains("win")) {
    //         uploadDir = windowsUploadDir;
    //     } else {
    //         uploadDir = linuxUploadDir;
    //     }

    //     registry.addResourceHandler("/uploads/**").addResourceLocations("file:" + uploadDir + "/");
    // }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginPageInterceptor());
    }

}