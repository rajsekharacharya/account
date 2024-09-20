package com.app.account.MvcConfig;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.UrlPathHelper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class LoginPageInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        UrlPathHelper urlPathHelper = new UrlPathHelper();
        String lookupPath = urlPathHelper.getLookupPathForRequest(request);

        if ("/login".equals(lookupPath) && isAuthenticated()) {
            String encodedRedirectURL = response.encodeRedirectURL("dashboard");
            response.setStatus(HttpStatus.TEMPORARY_REDIRECT.value());
            response.setHeader("Location", encodedRedirectURL);
            return false;
        } else {
            return true;
        }
    }

    private boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null &&
                !AnonymousAuthenticationToken.class.isAssignableFrom(authentication.getClass()) &&
                authentication.isAuthenticated();
    }
}
