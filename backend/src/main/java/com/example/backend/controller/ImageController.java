package com.example.backend.controller;

import com.example.backend.model.Image;
import com.example.backend.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageController {

    @Autowired
    private ImageRepository imageRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getImage(@PathVariable String id) {
        return imageRepository.findById(id)
            .map(image -> ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.getContentType()))
                .body(image.getData()))
            .orElse(ResponseEntity.notFound().build());
    }
}