package com.candyshare.signaling.config;

import com.candyshare.signaling.handler.SignalingHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // Creates the endpoint and allows Next.js (localhost:3000) to connect
        registry.addHandler(new SignalingHandler(), "/ws/signaling")
                .setAllowedOrigins("*"); 
    }
}