package com.app.account.security;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
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

        String redirectUrl = "/dashboard";
        String logMessage = user.getUser().getName() + " has logged in.";

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
        loginHistoryRepository.save(login);
    }
}
