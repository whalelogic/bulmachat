# 🦜 Go-Bulma Chat UI

A sleek and intuitive chat user interface built with Go, Bulma, and calls the `gemini-2.5` model 🤖.

#### Don't forget your API key! 

`export GEMINI_API_KEY="YOUR_API_KEY"`


## Features

- Real-time messaging
- User authentication
- Responsive design for various devices
- Emoji support
- Message history persistence
- Immersive user experience with enhanced UI elements

## Technologies Used

- **Server**: Golang
- **User Interface**: Bulma CSS
- **Database**: None yet!
- **Deployment**: Docker

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Go 1.25
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/whalelogic/bulmachat.git
   cd chat-ui
   ```

2. Install dependencies:
   ```bash
   go mod download
   ```


### Configuration

1. Create a `.env` file or simple `export GEMINI_API_KEY` in your shell (must be set).


### Running the Application


#### Go Static File Server

```bash
cd bulmachat
go run main.go || go run .
```

The default port is `8080`.

Server is `http://localhost:8080`.

## Docker Deployment (Optional)

1. Build Docker images:
   ```bash
   docker-compose build
   ```
2. Run containers:
   ```bash
   docker-compose up
   ```

## API Endpoints

 // TODO: Define API endpoints, create html files and handlers, configure Auth

## Contributing

We welcome contributions! Please see our `CONTRIBUTING.md` for details.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---
© 2025 Keith Thomson
<img width="1229" height="840" alt="image" src="https://github.com/user-attachments/assets/2e14d01b-7472-486d-a6a2-35ce51118da1" />

