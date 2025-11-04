package com.resumebuilder.service;

import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class VisionOCRService {

    public String extractText(MultipartFile file) throws IOException {
        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
            ByteString imgBytes = ByteString.readFrom(file.getInputStream());
            Image image = Image.newBuilder().setContent(imgBytes).build();
            
            Feature feat = Feature.newBuilder()
                    .setType(Feature.Type.DOCUMENT_TEXT_DETECTION)
                    .build();
            
            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .addFeatures(feat)
                    .setImage(image)
                    .build();
            
            BatchAnnotateImagesResponse response = client.batchAnnotateImages(
                    List.of(request)
            );
            
            AnnotateImageResponse res = response.getResponses(0);
            
            if (res.hasError()) {
                throw new IOException("OCR Error: " + res.getError().getMessage());
            }
            
            if (res.hasFullTextAnnotation()) {
                return res.getFullTextAnnotation().getText();
            }
            
            // Fallback: extract from text annotations if full text not available
            StringBuilder text = new StringBuilder();
            for (EntityAnnotation annotation : res.getTextAnnotationsList()) {
                if (!annotation.getDescription().isEmpty()) {
                    text.append(annotation.getDescription()).append("\n");
                }
            }
            return text.toString().trim();
        } catch (Exception e) {
            // Fallback if Google Vision is not configured
            if (e.getMessage() != null && e.getMessage().contains("credentials")) {
                throw new IOException("Google Vision API not configured. Please set GOOGLE_APPLICATION_CREDENTIALS environment variable.", e);
            }
            throw new IOException("OCR extraction failed: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> extractTextWithMetadata(MultipartFile file) throws IOException {
        Map<String, Object> result = new HashMap<>();
        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
            ByteString imgBytes = ByteString.readFrom(file.getInputStream());
            Image image = Image.newBuilder().setContent(imgBytes).build();
            
            Feature feat = Feature.newBuilder()
                    .setType(Feature.Type.DOCUMENT_TEXT_DETECTION)
                    .build();
            
            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .addFeatures(feat)
                    .setImage(image)
                    .build();
            
            BatchAnnotateImagesResponse response = client.batchAnnotateImages(
                    List.of(request)
            );
            
            AnnotateImageResponse res = response.getResponses(0);
            
            if (res.hasError()) {
                throw new IOException("OCR Error: " + res.getError().getMessage());
            }
            
            String text = "";
            double confidence = 0.0;
            
            if (res.hasFullTextAnnotation()) {
                text = res.getFullTextAnnotation().getText();
                confidence = res.getFullTextAnnotation().getPages(0).getConfidence();
            } else {
                // Fallback: extract from text annotations
                StringBuilder textBuilder = new StringBuilder();
                double totalConfidence = 0.0;
                int count = 0;
                for (EntityAnnotation annotation : res.getTextAnnotationsList()) {
                    if (!annotation.getDescription().isEmpty()) {
                        textBuilder.append(annotation.getDescription()).append("\n");
                        totalConfidence += annotation.getScore();
                        count++;
                    }
                }
                text = textBuilder.toString().trim();
                confidence = count > 0 ? totalConfidence / count : 0.0;
            }
            
            result.put("text", text);
            result.put("confidence", confidence);
            result.put("filename", file.getOriginalFilename());
            result.put("size", file.getSize());
            
            return result;
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("credentials")) {
                throw new IOException("Google Vision API not configured. Please set GOOGLE_APPLICATION_CREDENTIALS environment variable.", e);
            }
            throw new IOException("OCR extraction failed: " + e.getMessage(), e);
        }
    }
}

