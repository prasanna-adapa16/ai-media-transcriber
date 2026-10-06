package com.aimedia.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path storageLocation;

    // Maximum file size = 500 MB
    private static final long MAX_FILE_SIZE =
            500L * 1024L * 1024L;

    // Supported audio and video extensions
    private static final Set<String> SUPPORTED_EXTENSIONS = Set.of(
            ".mp3",
            ".wav",
            ".m4a",
            ".aac",
            ".flac",
            ".mp4",
            ".mov",
            ".mkv",
            ".webm"
    );

    /**
     * Creates the storage service and storage directory.
     */
    public FileStorageService(
            @Value("${app.storage.location:../storage}") String storagePath) {

        try {

            this.storageLocation = Paths.get(storagePath)
                    .toAbsolutePath()
                    .normalize();

            // Create storage directory if it doesn't exist
            Files.createDirectories(this.storageLocation);

        } catch (IOException e) {

            throw new FileStorageException(
                    "Could not create storage directory",
                    e
            );
        }
    }

    /**
     * Stores an uploaded file in the storage directory.
     */
    public FileStorageResult storeFile(MultipartFile file) {

        // -----------------------------------------
        // 1. Check whether file exists
        // -----------------------------------------

        if (file == null) {

            throw new FileStorageException(
                    "File cannot be null"
            );
        }

        // -----------------------------------------
        // 2. Check empty file
        // -----------------------------------------

        if (file.isEmpty()) {

            throw new FileStorageException(
                    "Cannot store an empty file"
            );
        }

        // -----------------------------------------
        // 3. Check file size
        // -----------------------------------------

        if (file.getSize() > MAX_FILE_SIZE) {

            throw new FileStorageException(
                    "File size exceeds the maximum limit of 500 MB"
            );
        }

        // -----------------------------------------
        // 4. Get original filename
        // -----------------------------------------

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null ||
                originalFileName.isBlank()) {

            throw new FileStorageException(
                    "Invalid file name"
            );
        }

        // -----------------------------------------
        // 5. Remove path information
        // -----------------------------------------
        //
        // Example:
        // ../../malicious/file.mp4
        //
        // becomes:
        // file.mp4
        //
        // This helps prevent path traversal attacks.
        // -----------------------------------------

        originalFileName = Paths.get(originalFileName)
                .getFileName()
                .toString();

        // -----------------------------------------
        // 6. Get file extension
        // -----------------------------------------

        String extension = getExtension(originalFileName);

        // -----------------------------------------
        // 7. Validate extension
        // -----------------------------------------

        if (!SUPPORTED_EXTENSIONS.contains(
                extension.toLowerCase())) {

            throw new FileStorageException(
                    "Unsupported file type: " + extension
            );
        }

        // -----------------------------------------
        // 8. Generate unique filename
        // -----------------------------------------

        String storedFileName =
                UUID.randomUUID()
                        + "_"
                        + originalFileName;

        // -----------------------------------------
        // 9. Create target path
        // -----------------------------------------

        Path targetLocation = storageLocation
                .resolve(storedFileName)
                .normalize();

        // -----------------------------------------
        // 10. Prevent path traversal
        // -----------------------------------------

        if (!targetLocation.startsWith(storageLocation)) {

            throw new FileStorageException(
                    "Invalid file path"
            );
        }

        // -----------------------------------------
        // 11. Store the file
        // -----------------------------------------

        try {

            Files.copy(
                    file.getInputStream(),
                    targetLocation
            );

        } catch (IOException e) {

            throw new FileStorageException(
                    "Could not store file: "
                            + originalFileName,
                    e
            );
        }

        // -----------------------------------------
        // 12. Return file information
        // -----------------------------------------

        return new FileStorageResult(
                originalFileName,
                storedFileName,
                targetLocation.toString(),
                file.getSize(),
                file.getContentType()
        );
    }

    /**
     * Extracts the file extension.
     */
    private String getExtension(String fileName) {

        int lastDot =
                fileName.lastIndexOf('.');

        if (lastDot == -1) {
            return "";
        }

        return fileName
                .substring(lastDot)
                .toLowerCase();
    }

    /**
     * Result returned after successful file storage.
     */
    public record FileStorageResult(

            String originalFileName,

            String storedFileName,

            String filePath,

            long fileSize,

            String contentType

    ) {
    }
}