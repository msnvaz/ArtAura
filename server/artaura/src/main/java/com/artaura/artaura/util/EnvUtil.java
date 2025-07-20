package com.artaura.artaura.util;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvUtil {
    private static final Dotenv dotenv = Dotenv.configure().directory(".").filename(".env") // Specify the folder containing the .env fil
                                                .load();

    public static String getEnv(String key, String defaultValue) {
        return dotenv.get(key, defaultValue);
    }
}
