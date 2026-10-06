package com.aimedia.repository;

import com.aimedia.entity.Transcription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TranscriptionRepository extends JpaRepository<Transcription, Long> {

    Optional<Transcription> findByMediaFileId(Long mediaFileId);
}
