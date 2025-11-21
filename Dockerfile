# Stage 1: Build the Go application
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum to download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build the application as a static binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /main .

# Stage 2: Create the final, minimal image
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /app

# Copy static assets
COPY --from=builder /app/index.html ./
COPY --from=builder /app/static ./static/

# Copy the pre-built binary from the builder stage
COPY --from=builder /main .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
