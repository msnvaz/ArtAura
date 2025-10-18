package com.artaura.artaura.util;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvUtil {
    private static final Dotenv dotenv = Dotenv.configure()
            .directory("../..") // Go up to project root
            .filename(".env")
            .ignoreIfMissing()
            .load();

    public static String getEnv(String key, String defaultValue) {
        String value = dotenv != null ? dotenv.get(key) : null;
        return value != null ? value : defaultValue;
    }
}
