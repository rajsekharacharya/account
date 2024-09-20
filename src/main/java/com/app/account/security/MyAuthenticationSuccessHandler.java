package com.app.account.security;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;

import com.app.account.model.LoginHistory;
import com.app.account.model.MyUserDetails;
import com.app.account.repository.LoginHistoryRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class MyAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails user = (MyUserDetails) auth.getPrincipal();

        String redirectUrl;
        String logMessage;

        if (user.getAuthorities().contains(new SimpleGrantedAuthority("SUPERADMIN"))) {
            redirectUrl = "/super-admin-home";
            logMessage = user.getUser().getName() + " has logged in.";
        } else if (user.getAuthorities().contains(new SimpleGrantedAuthority("C"))) {
            redirectUrl = "/company-home";
            logMessage = user.getUser().getName() + " has logged in.";
        } else if (user.getAuthorities().contains(new SimpleGrantedAuthority("P"))) {
            redirectUrl = "/plant-home";
            logMessage = user.getUser().getName() + " has logged in.";
        } else {
            redirectUrl = "/403";
            logMessage = "Not Authorize";
        }

        // Log the login
        logLogin(user, logMessage);

        // Redirect to the appropriate URL
        new DefaultRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    private void logLogin(MyUserDetails user, String logMessage) {
        String sessionId = RequestContextHolder.currentRequestAttributes().getSessionId();
        LoginHistory login = new LoginHistory();
        login.setUserId(user.getUser().getId());
        login.setName(user.getUser().getName());
        login.setSessionId(sessionId);
        login.setLoginTime(LocalDateTime.now());
        login.setCoId(user.getCompanyId());
        loginHistoryRepository.save(login);
    }
}
