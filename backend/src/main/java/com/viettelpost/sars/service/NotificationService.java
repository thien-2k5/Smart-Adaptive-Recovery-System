package com.viettelpost.sars.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.viettelpost.sars.repository.NotificationRepository;
import com.viettelpost.sars.entity.*;
import com.viettelpost.sars.enums.NotificationType;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    
    // Store emitters by customerId
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Long customerId) {
        // Timeout 30 minutes
        SseEmitter emitter = new SseEmitter(1800000L);
        emitters.put(customerId, emitter);
        
        emitter.onCompletion(() -> emitters.remove(customerId));
        emitter.onTimeout(() -> emitters.remove(customerId));
        emitter.onError((e) -> emitters.remove(customerId));
        
        return emitter;
    }

    public void sendDelayAlert(Customer customer, RecoveryCase recoveryCase) {
        String title = "Abnormal Delay Detected";
        String message = "Your parcel has remained at the sorting hub longer than expected. We have opened Recovery Case " + recoveryCase.getCaseId();
        
        Notification notif = Notification.builder()
                .customer(customer)
                .recoveryCase(recoveryCase)
                .title(title)
                .message(message)
                .notificationType(NotificationType.DELAY_DETECTED)
                .isRead(false)
                .createdAt(Instant.now())
                .build();
        
        notificationRepository.save(notif);
        
        // Push event
        SseEmitter emitter = emitters.get(customer.getId());
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("DELAY_DETECTED")
                        .data(Map.of(
                                "caseId", recoveryCase.getCaseId(),
                                "title", title,
                                "message", message
                        )));
            } catch (IOException e) {
                emitters.remove(customer.getId());
                log.warn("Failed to send SSE to customer {}: {}", customer.getId(), e.getMessage());
            }
        }
    }
}
