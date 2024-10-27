package com.quizzard.app.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Slf4j
@Controller
@CrossOrigin("http://localhost:5173")
public class ToggleController {

    private boolean toggleFlag = false;

    @MessageMapping("/toggle")
    @SendTo("/topic/toggleStatus")
    public boolean ToggleFlag(){
        log.info("Flag received!");
        this.toggleFlag = !this.toggleFlag;
        return this.toggleFlag;
    }

    @MessageExceptionHandler
    @SendToUser("/topic/errors")
    public String handleException(Throwable exception) {

        log.error("Message exception handling, error: {}", exception.getMessage());
        return exception.getMessage();
    }
}
