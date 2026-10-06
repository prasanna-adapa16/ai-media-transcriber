package com.aimedia.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FFmpegService {

    @Value("${app.storage.location:../storage}")
    private String storagePath;

    @Value("${app.ffmpeg.path:ffmpeg}")
    private String ffmpegPath;

    /**
     * Extracts audio from a video file and converts it to WAV.
     */
    public Path extractAudio(String videoFilePath) {

        Path inputPath = Paths.get(videoFilePath)
                .toAbsolutePath()
                .normalize();

        if (!Files.exists(inputPath)) {
            throw new RuntimeException(
                    "Input video file does not exist: " + inputPath
            );
        }

        String outputFileName =
                UUID.randomUUID() + "_audio.wav";

        Path outputPath = Paths.get(storagePath)
                .toAbsolutePath()
                .normalize()
                .resolve(outputFileName)
                .normalize();

        try {

            Files.createDirectories(outputPath.getParent());

            ProcessBuilder processBuilder =
                    new ProcessBuilder(
                            ffmpegPath,
                            "-y",
                            "-i",
                            inputPath.toString(),
                            "-vn",
                            "-ac",
                            "1",
                            "-ar",
                            "16000",
                            "-c:a",
                            "pcm_s16le",
                            outputPath.toString()
                    );

            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            StringBuilder output =
                    new StringBuilder();

            try (BufferedReader reader =
                         new BufferedReader(
                                 new InputStreamReader(
                                         process.getInputStream()))) {

                String line;

                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {

                throw new RuntimeException(
                        "FFmpeg failed:\n" + output
                );
            }

            if (!Files.exists(outputPath)) {

                throw new RuntimeException(
                        "FFmpeg completed but audio file was not created"
                );
            }

            return outputPath;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not execute FFmpeg. Make sure FFmpeg is installed.",
                    e
            );

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "FFmpeg process was interrupted",
                    e
            );
        }
    }
}