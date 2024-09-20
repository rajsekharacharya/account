package com.app.account.security;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.app.account.model.LoginHistory;
import com.app.account.repository.LoginHistoryRepository;

import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

@Component
public class SesssionListenerImpl implements HttpSessionListener {

	@Autowired
	LoginHistoryRepository loginHistoryRepository;

	@Override
	public void sessionDestroyed(HttpSessionEvent httpSessionEvent) {
		List<LoginHistory> findBySessionid = loginHistoryRepository
				.findBySessionId(httpSessionEvent.getSession().getId());
		if (findBySessionid.isEmpty()) {
			System.out.println("session mismatch");
		} else {
			findBySessionid.forEach(x -> {
				x.setLogoutTime(LocalDateTime.now());
				loginHistoryRepository.save(x);
			});
		}
	}
}
