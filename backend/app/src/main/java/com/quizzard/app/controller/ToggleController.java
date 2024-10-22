package com.quizzard.app.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ToggleController {

    private boolean toggleFlag = false;

    private final SimpMessagingTemplate messagingTemplate;

    public ToggleController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/toggle")
    public void ToggleFlag(){
        toggleFlag = !toggleFlag;
        messagingTemplate.convertAndSend("topic/toggleStatus", toggleFlag);
    }
}
