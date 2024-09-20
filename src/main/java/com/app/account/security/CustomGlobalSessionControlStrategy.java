package com.app.account.security;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.authentication.session.ConcurrentSessionControlAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


public class CustomGlobalSessionControlStrategy extends ConcurrentSessionControlAuthenticationStrategy {

    private final int maxGlobalSessions;
    private final SessionRegistry sessionRegistry;

    public CustomGlobalSessionControlStrategy(SessionRegistry sessionRegistry, int maxGlobalSessions) {
        super(sessionRegistry);
        this.sessionRegistry = sessionRegistry;
        this.maxGlobalSessions = maxGlobalSessions;
    }

    @Override
    public void onAuthentication(Authentication authentication, HttpServletRequest request,
    HttpServletResponse response) {
        int activeSessionsCount = 0;

        for (Object principal : sessionRegistry.getAllPrincipals()) {
            List<SessionInformation> activeUserSessions = sessionRegistry.getAllSessions(principal, false);
            activeSessionsCount += activeUserSessions.size();
        }

        if (activeSessionsCount >= maxGlobalSessions) {
            throw new SessionAuthenticationException("Maximum number of sessions for the application reached.");
        }

        super.onAuthentication(authentication, request, response);
    }
}
