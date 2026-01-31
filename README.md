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

<img width="2559" height="1320" alt="image" src="https://github.com/user-attachments/assets/f00346f8-2a55-4858-afbb-7af82db916bc" />


### User Search


<img width="2559" height="1321" alt="image" src="https://github.com/user-attachments/assets/7442d2ff-9bd4-4a0b-8dd1-e6c31779d1b8" />


### Servers & Topics


<img width="2546" height="1321" alt="image" src="https://github.com/user-attachments/assets/4a83d57b-f32f-43a4-bd96-9f471873c458" />


### Typing Indicator


<img width="301" height="116" alt="image" src="https://github.com/user-attachments/assets/5fc4147f-82da-42f9-9111-f8c7dadb5a27" />


### Pinned Messages & File Sharing


<img width="803" height="353" alt="image" src="https://github.com/user-attachments/assets/73a4cc37-4228-4c0b-b6e4-70e458a3810c" />


### User Settings


<img width="566" height="372" alt="image" src="https://github.com/user-attachments/assets/9fe9757f-475d-49e2-bfc5-6062159c4a01" />


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
