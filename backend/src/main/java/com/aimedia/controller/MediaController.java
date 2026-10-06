package com.aimedia.controller;

import com.aimedia.dto.MediaHistoryResponse;
import com.aimedia.dto.TranscriptionResponse;
import com.aimedia.entity.MediaFile;
import com.aimedia.entity.MediaStatus;
import com.aimedia.entity.MediaType;
import com.aimedia.entity.Transcription;
import com.aimedia.repository.MediaFileRepository;
import com.aimedia.repository.TranscriptionRepository;
import com.aimedia.service.FFmpegService;
import com.aimedia.service.FileStorageException;
import com.aimedia.service.FileStorageService;
import com.aimedia.service.WhisperService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "http://localhost:5173")
public class MediaController {

    private final FileStorageService fileStorageService;
    private final MediaFileRepository mediaFileRepository;
    private final TranscriptionRepository transcriptionRepository;
    private final FFmpegService ffmpegService;
    private final WhisperService whisperService;

    public MediaController(
            FileStorageService fileStorageService,
            MediaFileRepository mediaFileRepository,
            TranscriptionRepository transcriptionRepository,
            FFmpegService ffmpegService,
            WhisperService whisperService) {

        this.fileStorageService = fileStorageService;
        this.mediaFileRepository = mediaFileRepository;
        this.transcriptionRepository = transcriptionRepository;
        this.ffmpegService = ffmpegService;
        this.whisperService = whisperService;
    }

    // =========================================================
    // 1. UPLOAD + TRANSCRIBE MEDIA
    // =========================================================

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file) {

        Path storedPath = null;
        Path extractedAudioPath = null;

        try {

            // 1. Store uploaded file
            FileStorageService.FileStorageResult storedFile =
                    fileStorageService.storeFile(file);

            storedPath = Path.of(
                    storedFile.filePath()
            );

            // 2. Determine media type
            MediaType mediaType =
                    determineMediaType(
                            storedFile.originalFileName()
                    );

            // 3. Create MediaFile record
            MediaFile mediaFile = new MediaFile();

            mediaFile.setOriginalFileName(
                    storedFile.originalFileName()
            );

            mediaFile.setStoredFileName(
                    storedFile.storedFileName()
            );

            mediaFile.setFileType(
                    storedFile.contentType()
            );

            mediaFile.setFileSize(
                    storedFile.fileSize()
            );

            mediaFile.setFilePath(
                    storedFile.filePath()
            );

            mediaFile.setMediaType(
                    mediaType
            );

            mediaFile.setStatus(
                    MediaStatus.PROCESSING
            );

            mediaFile.setCreatedAt(
                    LocalDateTime.now()
            );

            MediaFile savedMediaFile =
                    mediaFileRepository.save(mediaFile);

            // 4. Prepare audio for Whisper
            Path audioForWhisper;

            if (mediaType == MediaType.VIDEO) {

                // Video -> FFmpeg -> WAV
                extractedAudioPath =
                        ffmpegService.extractAudio(
                                storedPath.toString()
                        );

                audioForWhisper =
                        extractedAudioPath;

            } else {

                // Audio -> directly to Whisper
                audioForWhisper =
                        storedPath;
            }

            // 5. Send audio to Whisper
            WhisperService.TranscriptionResult whisperResult =
                    whisperService.transcribe(
                            audioForWhisper
                    );

            String transcriptText =
                    whisperResult.transcript();

            String detectedLanguage =
                    whisperResult.language();

            // 6. Save transcription
            Transcription transcription =
                    new Transcription();

            transcription.setTranscriptText(
                    transcriptText
            );

            transcription.setLanguage(
                    detectedLanguage
            );

            transcription.setMediaFile(
                    savedMediaFile
            );

            transcription.setCreatedAt(
                    LocalDateTime.now()
            );

            transcription.setUpdatedAt(
                    LocalDateTime.now()
            );

            transcriptionRepository.save(
                    transcription
            );

            // 7. Update media status
            savedMediaFile.setStatus(
                    MediaStatus.COMPLETED
            );

            mediaFileRepository.save(
                    savedMediaFile
            );

            // 8. Return actual transcription response
            TranscriptionResponse response =
                    new TranscriptionResponse(
                            transcription.getId(),
                            savedMediaFile.getId(),
                            savedMediaFile.getOriginalFileName(),
                            savedMediaFile.getMediaType().name(),
                            savedMediaFile.getStatus().name(),
                            transcriptText,
                            detectedLanguage,
                            transcription.getCreatedAt(),
                            transcription.getUpdatedAt()
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (FileStorageException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Transcription failed: "
                                    + e.getMessage()
                    );

        } finally {

            // Delete temporary FFmpeg WAV
            if (extractedAudioPath != null) {

                try {
                    Files.deleteIfExists(
                            extractedAudioPath
                    );
                } catch (Exception ignored) {
                }
            }
        }
    }

    // =========================================================
    // 2. GET ALL MEDIA - HISTORY
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getAllMedia() {

        try {

            List<MediaFile> mediaFiles =
                    mediaFileRepository.findAll();

            List<MediaHistoryResponse> response =
                    mediaFiles.stream()
                            .map(MediaHistoryResponse::fromEntity)
                            .toList();

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Failed to fetch media history"
                    );
        }
    }

    // =========================================================
    // 3. GET SINGLE MEDIA BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getMediaById(
            @PathVariable Long id) {

        try {

            return mediaFileRepository
                    .findById(id)
                    .map(mediaFile -> {

                        Transcription transcription =
                                mediaFile.getTranscription();

                        // No transcription available
                        if (transcription == null) {

                            return ResponseEntity
                                    .status(
                                            HttpStatus.NOT_FOUND
                                    )
                                    .body(null);
                        }

                        // Return FULL transcription
                        TranscriptionResponse response =
                                TranscriptionResponse
                                        .fromEntity(
                                                transcription
                                        );

                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() ->
                            ResponseEntity
                                    .status(
                                            HttpStatus.NOT_FOUND
                                    )
                                    .body(null)
                    );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            "Failed to fetch media"
                    );
        }
    }

    // =========================================================
    // 4. DETERMINE MEDIA TYPE
    // =========================================================

    private MediaType determineMediaType(
            String fileName) {

        String extension =
                fileName.substring(
                        fileName.lastIndexOf(".")
                ).toLowerCase();

        switch (extension) {

            // -------------------------
            // VIDEO
            // -------------------------

            case ".mp4":
            case ".mov":
            case ".mkv":
            case ".webm":

                return MediaType.VIDEO;

            // -------------------------
            // AUDIO
            // -------------------------

            case ".mp3":
            case ".wav":
            case ".m4a":
            case ".aac":
            case ".flac":

                return MediaType.AUDIO;

            // -------------------------
            // UNSUPPORTED
            // -------------------------

            default:

                throw new IllegalArgumentException(
                        "Unsupported media type: "
                                + extension
                );
        }
    }
}