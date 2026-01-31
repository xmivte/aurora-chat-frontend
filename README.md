# Aurora Chat

A modern, secure real-time messaging application built with React, TypeScript, and Material UI. Aurora Chat features end-to-end encryption, file sharing, server-based group conversations, and a sleek dark-themed UI.

> Built during the **Sourcery Academy 2025 Fall** internship program.

## Features

- **End-to-End Encryption** — AES-GCM 256-bit client-side encryption with sender key exchange protocol
- **Real-Time Messaging** — WebSocket (STOMP) powered instant messaging with typing indicators and presence tracking
- **File Sharing** — Secure file uploads with 8 layers of validation, proxied downloads, and automatic 7-day cleanup
- **Servers & Topics** — Create servers with topic-based channels for organized group conversations
- **Pinned Messages** — Pin important messages and file attachments for easy reference
- **User Search** — Find and start conversations with other users
- **Profile Management** — Update your profile picture, display name, and account settings
- **Firebase Authentication** — Secure JWT-based authentication with Google sign-in support

## Screenshots

### Login


<img width="501" height="340" alt="image" src="https://github.com/user-attachments/assets/6ad4f513-baac-4289-b190-cf942c67ed27" />


### Main Chat View
<!-- SCREENSHOT 2: MAIN CHAT VIEW (conversations list + active chat window) -->
![Chat View](PASTE_CHAT_VIEW_IMAGE_URL_HERE)

### User Search
<!-- SCREENSHOT 3: NEW CHAT / USER SEARCH DIALOG -->
![User Search](PASTE_USER_SEARCH_IMAGE_URL_HERE)

### Servers & Topics
<!-- SCREENSHOT 4: SERVER VIEW WITH TOPIC CHANNELS -->
![Servers & Topics](PASTE_SERVER_TOPICS_IMAGE_URL_HERE)

### Typing Indicator
<!-- SCREENSHOT 5: TYPING INDICATOR IN ACTION -->
![Typing Indicator](PASTE_TYPING_INDICATOR_IMAGE_URL_HERE)

### Pinned Messages & File Sharing
<!-- SCREENSHOT 6: PINNED MESSAGES PANEL WITH FILE ATTACHMENTS -->
![Pinned Messages & File Sharing](PASTE_PINNED_MESSAGES_IMAGE_URL_HERE)

### User Settings
<!-- SCREENSHOT 7: USER SETTINGS PANEL (profile update/delete) -->
![User Settings](PASTE_USER_SETTINGS_IMAGE_URL_HERE)

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5.7 | Type-safe JavaScript |
| Vite | 6 | Build tool & dev server |
| Material UI (MUI) | 7 | Component library |
| SockJS + STOMP | — | WebSocket real-time communication |
| Firebase Auth | — | Authentication |
| Axios | — | HTTP client |
| Web Crypto API | — | Client-side E2E encryption |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/xmivte/aurora-chat-frontend.git
cd aurora-chat-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase and API configuration

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL |
| `VITE_WS_URL` | WebSocket endpoint URL |
| `VITE_FIREBASE_*` | Firebase project configuration |

## Architecture Highlights

### End-to-End Encryption
Messages are encrypted client-side using the **Web Crypto API** with AES-GCM 256-bit keys. The server never has access to plaintext message content. A sender key exchange protocol ensures only group members can decrypt messages.

### Secure File Sharing
Files are uploaded through the backend with multi-layer validation (size, type, extension, magic bytes via Apache Tika). Downloads are **fully proxied** through the backend — Cloudinary storage URLs are never exposed to the client. The frontend receives raw bytes and creates temporary blob URLs that are immediately revoked after download.

### Real-Time Communication
WebSocket connections via SockJS/STOMP provide instant message delivery, typing indicators, and online presence tracking without polling.

## Team

**Students:**
- Egle Mickeviciute
- Lukas Kasparavicius
- Matas Brazauskas
- Povilas Sakalauskas
- Ruta Gaizutyte
- Viktoras Timofejevas

**Mentor:** Edvinas Jaskovikas

## Related

- [Aurora Chat Backend](https://github.com/xmivte/aurora-chat-backend) — Java Spring Boot backend API

---

*Built at Sourcery Academy 2025*
