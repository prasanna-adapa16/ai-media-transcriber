package com.aimedia.dto;

import com.aimedia.entity.MediaFile;
import com.aimedia.entity.Transcription;

import java.time.LocalDateTime;

public class MediaHistoryResponse {

    private Long id;
    private String fileName;
    private String mediaType;
    private String status;
    private LocalDateTime createdAt;

    private Long transcriptionId;
    private String transcriptPreview;
    private String language;

    public MediaHistoryResponse() {
    }

    public MediaHistoryResponse(
            Long id,
            String fileName,
            String mediaType,
            String status,
            LocalDateTime createdAt,
            Long transcriptionId,
            String transcriptPreview,
            String language) {

        this.id = id;
        this.fileName = fileName;
        this.mediaType = mediaType;
        this.status = status;
        this.createdAt = createdAt;
        this.transcriptionId = transcriptionId;
        this.transcriptPreview = transcriptPreview;
        this.language = language;
    }

    public static MediaHistoryResponse fromEntity(
            MediaFile mediaFile) {

        Transcription transcription =
                mediaFile.getTranscription();

        String preview = null;

        if (transcription != null &&
                transcription.getTranscriptText() != null) {

            String text =
                    transcription.getTranscriptText();

            // Only send a small preview to History API
            preview =
                    text.length() > 200
                            ? text.substring(0, 200) + "..."
                            : text;
        }

        return new MediaHistoryResponse(
                mediaFile.getId(),

                mediaFile.getOriginalFileName(),

                mediaFile.getMediaType() != null
                        ? mediaFile.getMediaType().name()
                        : null,

                mediaFile.getStatus() != null
                        ? mediaFile.getStatus().name()
                        : null,

                mediaFile.getCreatedAt(),

                transcription != null
                        ? transcription.getId()
                        : null,

                preview,

                transcription != null
                        ? transcription.getLanguage()
                        : null
        );
    }

    public Long getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public String getMediaType() {
        return mediaType;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getTranscriptionId() {
        return transcriptionId;
    }

    public String getTranscriptPreview() {
        return transcriptPreview;
    }

    public String getLanguage() {
        return language;
    }
}