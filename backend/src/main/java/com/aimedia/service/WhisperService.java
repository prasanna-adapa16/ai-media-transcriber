package com.aimedia.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.file.Path;
import java.util.Map;

@Service
public class WhisperService {

    private final RestTemplate restTemplate;

    @Value("${app.whisper.url:http://localhost:8001}")
    private String whisperUrl;

    public WhisperService() {
        this.restTemplate = new RestTemplate();
    }

    public TranscriptionResult transcribe(Path audioFile) {

        String url = whisperUrl + "/transcribe";

        System.out.println("======================================");
        System.out.println("Sending audio to Whisper");
        System.out.println("Whisper URL: " + url);
        System.out.println("Audio file: " + audioFile);
        System.out.println("======================================");

        FileSystemResource fileResource =
                new FileSystemResource(audioFile.toFile());

        MultiValueMap<String, Object> body =
                new LinkedMultiValueMap<>();

        body.add("file", fileResource);

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(
                MediaType.MULTIPART_FORM_DATA
        );

        HttpEntity<MultiValueMap<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        url,
                        request,
                        Map.class
                );

        if (!response.getStatusCode().is2xxSuccessful()
                || response.getBody() == null) {

            throw new RuntimeException(
                    "Whisper transcription failed"
            );
        }

        Map responseBody =
                response.getBody();

        System.out.println("Whisper response:");
        System.out.println(responseBody);

        Object transcript =
                responseBody.get("transcript");

        if (transcript == null) {

            throw new RuntimeException(
                    "Whisper response did not contain transcript"
            );
        }

        Object language =
                responseBody.get("language");

        String languageValue;

        if (language != null
                && !language.toString().trim().isEmpty()) {

            languageValue =
                    language.toString().trim();

        } else {

            languageValue = "unknown";
        }

        System.out.println(
                "Detected language: "
                        + languageValue
        );

        return new TranscriptionResult(
                transcript.toString(),
                languageValue
        );
    }

    public record TranscriptionResult(
            String transcript,
            String language
    ) {
    }
}