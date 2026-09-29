<div align="center">
<a href="https://candyshare.vercel.app">

<!-- Animated Header Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=22c55e&height=180&section=header&text=CandyShare&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=Decentralized%20Zero-Cloud%20P2P%20File%20Transfer%20Engine&descFontSize=18&descAlignY=62" width="100%"/>
</a>

<br/><br/>

<!-- Interactive Quick-Action Buttons -->
<a href="https://candyshare.vercel.app">
  <img src="https://img.shields.io/badge/🌐_Launch_Live_App-22c55e?style=for-the-badge&logoColor=white" height="34"/>
</a>
&nbsp;
<a href="https://github.com/Hemantidea/CandyShare">
  <img src="https://img.shields.io/badge/📦_GitHub_Repo-0D1117?style=for-the-badge&logo=github&logoColor=white" height="34"/>
</a>
&nbsp;
<a href="https://www.linkedin.com/in/hemant-verma-ind/">
  <img src="https://img.shields.io/badge/👨‍💻_Connect_on_LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" height="34"/>
</a>

<br/><br/>

<!-- Tech Stack Badges -->
![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate_ORM-59666C?style=flat-square&logo=hibernate&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_(Neon)-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC_DataChannel-333333?style=flat-square&logo=webrtc&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

<br/><br/>

<!-- Interactive Quick Metrics Cards -->
<table>
  <tr>
    <td align="center" width="25%"><b>🔒 Zero Server Storage</b><br/><sub>Bytes never touch disks</sub></td>
    <td align="center" width="25%"><b>⚡ Gigabit LAN Speed</b><br/><sub>50-100+ MB/s over Wi-Fi</sub></td>
    <td align="center" width="25%"><b>🛡️ DTLS 1.3 Security</b><br/><sub>Native E2E Encryption</sub></td>
    <td align="center" width="25%"><b>📊 Process Audit Log</b><br/><sub>Spring JPA + Neon Postgres</sub></td>
  </tr>
</table>

<br/>

<p align="center">
  <b>CandyShare</b> is a browser-native, zero-cloud file-streaming platform designed to transfer files of arbitrary size directly between edge devices. By decoupling data transmission from server storage, payloads stream directly from sender memory to receiver memory over encrypted WebRTC data channels, backed by a Java Spring Boot WebSocket signaling plane and an anonymized PostgreSQL process audit engine.
</p>

</div>

---

## 📑 Table of Contents
- Key Architectural Highlights
- System Architecture & Deployment
- End-to-End Sequence Lifecycle
- Class & Component UML Model
- Engineering Challenges & Breakthroughs
- Technology Stack
- Author & License
---

## ⚡ Key Highlights

* 🔒 **Zero Server Storage:** Files stream directly browser-to-browser via WebRTC with native **DTLS 1.3** end-to-end encryption.
* 🚀 **LAN Gigabit Speeds:** Prioritizes local Host ICE candidates over Wi-Fi networks (**50–100+ MB/s**) with 0 MB internet data usage.
* 🌊 **Adaptive Backpressure:** Regulates `FileReader` chunking using a 1MB watermark buffer threshold, preventing browser OOM crashes.
* 🌐 **Symmetric NAT Traversal:** Bypasses mobile carrier CGNATs via dynamic **Metered.ca TURN relays** over Port 443 TCP.
* 📊 **Privacy-First Audit Logging:** Emits anonymized event telemetry (`MIME class`, `logarithmic size bucket`) to Neon PostgreSQL via Spring Data JPA.
* 🌍 **Bilingual Client:** Built with Next.js 16 and Tailwind CSS v4, supporting English and Hindi via zero-dependency client context.

---

## 🏛️ System Architecture

Decoupled architecture separating the **Data Plane** (WebRTC P2P), **Control Plane** (Spring Boot WebSockets), and **Persistence Plane** (PostgreSQL).

<div align="center">
  <img src="./assets/architecture-deployment.png" alt="Architecture Diagram" width="95%" />
</div>

* **Client Tier:** Next.js 16 browsers executing chunking, memory assembly, and direct `RTCDataChannel` streaming.
* **Signaling Tier:** Dockerized Java 17 / Spring Boot service on Render managing WebSocket rooms via `ConcurrentHashMap`.
* **Network Traversal:** Google STUN + dynamic Metered.ca TURN relays over Port 443 TCP.
* **Persistence Tier:** Serverless Neon PostgreSQL storing immutable audit logs via Hibernate ORM.

---

## 🔄 End-to-End Transfer Flow

<div align="center">
  <img src="./assets/sequence-diagram.png" alt="Sequence Diagram" width="85%" />
</div>

1. **Discovery:** Sender creates room; Receiver accepts transfer to prevent bot pre-fetching.
2. **Negotiation:** Peers exchange **SDP Offer/Answer** and **ICE candidates** via Java WebSockets.
3. **Data Plane:** Direct DTLS-encrypted channel streams **64KB chunks** with backpressure flow control.
4. **Audit Log:** Receiver triggers native download; both peers dispatch anonymized telemetry to PostgreSQL.

---

## 📐 Class & Component Model

<div align="center">
  <img src="./assets/class-diagram.png" alt="Class Diagram" width="95%" />
</div>

* `SignalingHandler`: Extends `TextWebSocketHandler` with thread-safe `ConcurrentHashMap` room state.
* `AuditController` & `TransferAuditRepository`: REST controller and `JpaRepository` interface for process audit telemetry.
* `useWebRTC`: Custom React hook managing WebSockets, candidate queues, and backpressure chunking.

---

## 🛠️ Engineering Challenges & Fixes

| Challenge | Root Cause | Solution |
| :--- | :--- | :--- |
| **Buffer Overflow (12% Hang)** | Disk read speed (~500 MB/s) overwhelmed network throughput (~15 MB/s). | **Adaptive Backpressure:** Pauses reading at 1MB buffer; resumes at 64KB via `onbufferedamountlow`. |
| **Social Crawler Hijacking** | WhatsApp link preview bots crawled URLs and consumed SDP offers. | **User Consent Gate:** Suspends WebRTC signaling until human clicks "Accept Transfer". |
| **ICE Race Conditions** | Mobile network latency caused ICE candidates to arrive before remote SDP was set. | **Candidate Queue:** In-memory queue buffers early candidates and flushes after SDP resolution. |
| **Symmetric Mobile NATs** | Cellular carriers (Jio/Airtel) randomize ports and filter arbitrary UDP traffic. | **TCP Fallback:** Dynamically provisions TURN relays over **Port 443 TCP**. |
---

## 🧰 Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling & UI** | Tailwind CSS v4, Lucide Icons, QR Code SVG |
| **P2P & Transport** | WebRTC `RTCDataChannel`, SCTP, DTLS 1.3, STUN/TURN (Metered.ca API) |
| **Backend Microservice**| Java 17, Spring Boot 3.3+, Spring WebSockets |
| **ORM & Database** | Hibernate 6, Spring Data JPA, PostgreSQL (Neon Serverless) |
| **Containerization & Cloud** | Docker (Multi-stage JRE), Render Web Services, Vercel Edge, cron-job.org |

---

## 👤 Author & Engineering Profile

<div align="center">
<a href="https://www.linkedin.com/in/hemant-verma-ind/">
<!-- Cleaned Header Banner (No Emoji Crashes) -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=22c55e&height=120&section=header&text=Hemant%20Verma&fontSize=38&fontColor=ffffff&fontAlignY=38" width="100%"/>
</a>
<br/><br/>

[![LinkedIn Profile](https://img.shields.io/badge/LinkedIn-Hemant_Verma-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hemant-verma-ind/)
[![GitHub Profile](https://img.shields.io/badge/GitHub-Hemantidea-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Hemantidea)

</div>

<br/>

## 🤝 Acknowledgments & Open Protocols

* **WebRTC Working Group (W3C / IETF):** For defining the peer-to-peer data transport standards (`RTCDataChannel`, SCTP, and DTLS 1.3).
* **Metered.ca:** For enterprise STUN and global TURN network traversal relays.
* **Spring Initializr & Hibernate Community:** For the high-performance enterprise Java signaling and persistence ecosystem.

---

<div align="center">
<a href="https://www.linkedin.com/in/hemant-verma-ind/">

<!-- Cleaned Bottom Footer (No URL Encoding Crashes) -->
<img src="https://capsule-render.vercel.app/api?type=rect&color=f0fdf4&height=40&section=footer&text=Made%20in%20India%20--%20Designed%20and%20Engineered%20by%20Hemant%20Verma&fontSize=14&fontColor=14532d&fontAlignY=60" width="100%"/>
</a>

</div>