package com.app.account.configuration;

import java.util.Random;

public class OTPGenerator {

    // private static final int PIN_LENGTH = 6;

    public static String generateOTP(Integer pin) {
        Random random = new Random();

        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < pin; i++) {
            otp.append(random.nextInt(10));
        }

        return otp.toString();
    }
}
