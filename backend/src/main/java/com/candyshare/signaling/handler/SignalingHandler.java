package com.candyshare.signaling.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

public class SignalingHandler extends TextWebSocketHandler {

    // This HashMap stores active rooms. Key = RoomID, Value = List of Users (Sessions)
    private static final ConcurrentHashMap<String, CopyOnWriteArrayList<WebSocketSession>> rooms = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Parse the incoming JSON message from Next.js
        JsonNode jsonMessage = objectMapper.readTree(message.getPayload());
        String roomId = jsonMessage.get("roomId").asText();
        String type = jsonMessage.get("type").asText();

        // If a user is joining, add them to the correct Room list
        if ("join".equals(type)) {
            rooms.putIfAbsent(roomId, new CopyOnWriteArrayList<>());
            rooms.get(roomId).add(session);
            System.out.println("User joined room: " + roomId + " | Total users in room: " + rooms.get(roomId).size());
            return;
        }

        // If it's an Offer, Answer, or ICE Candidate, forward it to the OTHER person in the room
        CopyOnWriteArrayList<WebSocketSession> roomSessions = rooms.get(roomId);
        if (roomSessions != null) {
            for (WebSocketSession s : roomSessions) {
                // Make sure we don't send the message back to the person who sent it
                if (s.isOpen() && !s.getId().equals(session.getId())) {
                    s.sendMessage(message);
                }
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
        // If someone closes their tab, remove them from all rooms
        rooms.forEach((roomId, roomSessions) -> {
            roomSessions.remove(session);
            // If the room is now empty, destroy it to free up RAM!
            if (roomSessions.isEmpty()) {
                rooms.remove(roomId);
                System.out.println("Room destroyed: " + roomId);
            }
        });
    }
}