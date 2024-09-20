// package com.app.account.Initializer;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Component;

// import com.app.account.model.User;
// import com.app.account.repository.UserRepository;


// @Component
// public class DatabaseInitializer implements CommandLineRunner {

//     @Autowired
//     PasswordEncoder passwordEncoder;

//     @Autowired
//     UserRepository userRepository;



//     @Override
//     public void run(String... args) throws Exception {

//         User test = new User();
//         test.setUsername("admin");
//         test.setPassword(passwordEncoder.encode("admin"));
//         test.setName("ADMIN");
//         test.setEmail("admin@vareli.co.in");
//         test.setMobile("8335898602");
//         test.setRole("ADMIN");
//         test.setEnable(true);
//         userRepository.save(test);
//     }
// }
