package com.quizzard.app.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;


@Configuration
public class FirebaseConfig {

    @Value("${DB_FIREBASE_PROJECT_ID}")
    private String projectId;

    @Value("${DB_FIREBASE_PRIVATE_KEY}")
    private String privateKey;

    @Value("${DB_FIREBASE_CLIENT_EMAIL}")
    private String clientEmail;

    @Value("${DB_FIREBASE_STORAGE_BUCKET}")
    private String storageBucket;

    @Bean
    public FirebaseApp initializeFirebase() throws IOException {

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(new ByteArrayInputStream(privateKey.getBytes())))
                .setProjectId(projectId)
                .setStorageBucket(storageBucket)
                .setServiceAccountId(clientEmail)
                .build();

        return FirebaseApp.initializeApp(options);
    }
}
