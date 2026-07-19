# Future Improvements

This document lists technical and functional improvements that were omitted from the current MVP scope but should be considered for a production-ready system.

---

## Technical Debt & Scalability

1. **Message Broker (Kafka / RabbitMQ)**
   - **Current**: Application uses internal events and synchronous API calls.
   - **Future**: Use a message broker to decouple the Simulation Engine from the Recovery Engine, and to handle high throughput of tracking updates.

2. **Caching (Redis)**
   - **Current**: Direct database queries.
   - **Future**: Cache static data like Help Center articles, user preferences, and frequently accessed shipment summaries.

3. **Rate Limiting**
   - **Current**: None (demo mode).
   - **Future**: Implement API Gateway rate limiting or Spring Cloud Gateway to prevent abuse.

4. **WebSockets vs SSE**
   - **Current**: Server-Sent Events (SSE) for one-way push notifications.
   - **Future**: Upgrade to WebSockets if bidirectional real-time communication is needed (e.g., live chat with the dedicated case manager).

5. **Authentication & Authorization**
   - **Current**: Simple session-based auth for Admin only; public endpoints for demo users.
   - **Future**: JWT-based authentication, OAuth2 login for customers, strict Role-Based Access Control (RBAC).

---

## Feature Enhancements

1. **AI Chatbot Integration**
   - Integrate with an LLM to automate the customer support responses and initial investigation queries.

2. **Push Notifications (Mobile)**
   - Integrate Firebase Cloud Messaging (FCM) to push delay alerts to the Viettel Post mobile app.

3. **External Logistics API Integration**
   - Connect to real Viettel Post logistics APIs to fetch actual tracking data instead of simulating it.

4. **Dynamic Compensation Calculation**
   - Integrate with a rules engine (like Drools) to allow business users to modify compensation logic without code changes.

5. **Advanced Dashboard Analytics**
   - Export data to a data warehouse and use Metabase/Tableau for advanced BI reporting on recovery success rates and financial impact.
