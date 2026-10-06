package com.aimedia;

import com.aimedia.controller.HealthController;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class HealthControllerTest {

    @Test
    void healthCheckReturnsUp() {
        HealthController controller = new HealthController();
        ResponseEntity<Map<String, String>> response = controller.checkHealth();

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().get("status"));
        assertEquals("AI Media Transcriber Backend", response.getBody().get("service"));
    }
}
