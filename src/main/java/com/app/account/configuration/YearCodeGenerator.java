package com.app.account.configuration;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class YearCodeGenerator {


        public static String generateFiscalYearCode(String dateString) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date inputDate = sdf.parse(dateString);

        // Create a calendar instance and set the given date
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(inputDate);

        // Determine the fiscal year start date (e.g., April 1st of the current year)
        calendar.set(Calendar.MONTH, Calendar.APRIL);
        calendar.set(Calendar.DAY_OF_MONTH, 1);

        // Check if the given date is before or after the fiscal year start date
        if (inputDate.before(calendar.getTime())) {
            // If before, consider the previous year as the start of fiscal year
            calendar.add(Calendar.YEAR, -1);
        }

        // Get the fiscal year start and end years
        int fiscalYearStartYear = calendar.get(Calendar.YEAR);
        int fiscalYearEndYear = fiscalYearStartYear + 1;

        // Format the fiscal year code as "YYYY-YY"
                return fiscalYearStartYear + "-" + String.format("%02d", fiscalYearEndYear % 100);

    }
    
}
