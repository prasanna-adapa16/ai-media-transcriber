package com.aimedia.dto;

import com.aimedia.entity.MediaFile;
import com.aimedia.entity.Transcription;

import java.time.LocalDateTime;

public class TranscriptionResponse {

    private Long id;
    private Long mediaFileId;

    private String fileName;
    private String mediaType;
    private String status;

    private String transcriptText;
    private String language;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TranscriptionResponse() {
    }

    public TranscriptionResponse(
            Long id,
            Long mediaFileId,
            String fileName,
            String mediaType,
            String status,
            String transcriptText,
            String language,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.mediaFileId = mediaFileId;
        this.fileName = fileName;
        this.mediaType = mediaType;
        this.status = status;
        this.transcriptText = transcriptText;
        this.language = language;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static TranscriptionResponse fromEntity(
            Transcription entity) {

        if (entity == null) {
            return null;
        }

        MediaFile mediaFile =
                entity.getMediaFile();

        Long mediaFileId =
                mediaFile != null
                        ? mediaFile.getId()
                        : null;

        String fileName =
                mediaFile != null
                        ? mediaFile.getOriginalFileName()
                        : null;

        String mediaType =
                mediaFile != null
                        ? mediaFile.getMediaType().name()
                        : null;

        String status =
                mediaFile != null
                        ? mediaFile.getStatus().name()
                        : null;

        return new TranscriptionResponse(
                entity.getId(),
                mediaFileId,
                fileName,
                mediaType,
                status,
                entity.getTranscriptText(),
                entity.getLanguage(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMediaFileId() {
        return mediaFileId;
    }

    public void setMediaFileId(Long mediaFileId) {
        this.mediaFileId = mediaFileId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTranscriptText() {
        return transcriptText;
    }

    public void setTranscriptText(String transcriptText) {
        this.transcriptText = transcriptText;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}