package com.aimedia;

import com.aimedia.dto.MediaHistoryResponse;
import com.aimedia.dto.TranscriptionResponse;
import com.aimedia.entity.MediaFile;
import com.aimedia.entity.MediaStatus;
import com.aimedia.entity.MediaType;
import com.aimedia.entity.Transcription;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class EntityTest {

    @Test
    void testMediaFileAndTranscriptionRelationship() {

        MediaFile mediaFile = new MediaFile(
                "sample_lecture.mp4",
                "uuid_sample_lecture.mp4",
                "video/mp4",
                10485760L,
                "/uploads/uuid_sample_lecture.mp4",
                MediaType.VIDEO,
                MediaStatus.UPLOADED
        );

        mediaFile.setId(1L);
        mediaFile.setCreatedAt(LocalDateTime.now());

        Transcription transcription = new Transcription(
                "Welcome to the lecture.",
                "en",
                mediaFile
        );

        transcription.setId(10L);
        transcription.setCreatedAt(LocalDateTime.now());
        transcription.setUpdatedAt(LocalDateTime.now());

        mediaFile.setTranscription(transcription);

        // =====================================================
        // Test MediaFile
        // =====================================================

        assertEquals(1L, mediaFile.getId());

        assertEquals(
                "sample_lecture.mp4",
                mediaFile.getOriginalFileName()
        );

        assertEquals(
                MediaType.VIDEO,
                mediaFile.getMediaType()
        );

        assertEquals(
                MediaStatus.UPLOADED,
                mediaFile.getStatus()
        );

        // =====================================================
        // Test Relationship
        // =====================================================

        assertNotNull(
                mediaFile.getTranscription()
        );

        assertEquals(
                "Welcome to the lecture.",
                mediaFile
                        .getTranscription()
                        .getTranscriptText()
        );

        assertEquals(
                mediaFile,
                transcription.getMediaFile()
        );

        // =====================================================
        // Test MediaHistoryResponse DTO
        // =====================================================

        MediaHistoryResponse mediaResponse =
                MediaHistoryResponse.fromEntity(
                        mediaFile
                );

        assertNotNull(mediaResponse);

        assertEquals(
                1L,
                mediaResponse.getId()
        );

        assertEquals(
                MediaStatus.UPLOADED.name(),
                mediaResponse.getStatus()
        );

        // =====================================================
        // Test TranscriptionResponse DTO
        // =====================================================

        TranscriptionResponse transResponse =
                TranscriptionResponse.fromEntity(
                        transcription
                );

        assertNotNull(transResponse);

        assertEquals(
                10L,
                transResponse.getId()
        );

        assertEquals(
                1L,
                transResponse.getMediaFileId()
        );

        assertEquals(
                "Welcome to the lecture.",
                transResponse.getTranscriptText()
        );
    }
}