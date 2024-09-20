package com.app.account.security;

import java.io.IOException;

import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class MyAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {
        // Handle different exceptions here
        String errorMessage = "Invalid username or password";
        System.out.println("Exception Intance:"+ exception);
        if (exception instanceof BadCredentialsException) {
            errorMessage = "Invalid username or password";
        } else if (exception instanceof LockedException) {
            errorMessage = "Account is locked";
        } else if (exception instanceof DisabledException) {
            errorMessage = "Account is disabled";
        } else if (exception instanceof AccountExpiredException) {
            errorMessage = "User account has expired";
        }
        else{
            errorMessage = exception.getMessage();
        }
        // Set error message as an attribute
        request.getSession().setAttribute("loginError", errorMessage);
        // Redirect back to the login page with error flag
        response.sendRedirect("login?error");
    }

}
