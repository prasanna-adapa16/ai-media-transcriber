package com.aimedia.repository;

import com.aimedia.entity.MediaFile;
import com.aimedia.entity.MediaStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {

    Optional<MediaFile> findByStoredFileName(String storedFileName);

    List<MediaFile> findAllByOrderByCreatedAtDesc();

    long countByStatus(MediaStatus status);
}
