
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"google.golang.org/genai"
)

var apiKey string

func main() {
	apiKey = os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		log.Fatal("GEMINI_API_KEY environment variable is required")
	}

	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	})

	http.HandleFunc("/chat", chatHandler)

	log.Println("Listening on :8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

func chatHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received %s request to /chat from %s", r.Method, r.RemoteAddr)
	
	if r.Method != http.MethodPost {
		log.Printf("Method not allowed: %s", r.Method)
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	log.Printf("Content-Type: %s, Content-Length: %d", r.Header.Get("Content-Type"), r.ContentLength)

	var reqBody struct {
		Message string `json:"message"`
	}

	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Error decoding request body", http.StatusBadRequest)
		return
	}

	log.Printf("Received message: %q (length: %d)", reqBody.Message, len(reqBody.Message))

	ctx := context.Background()
	log.Println("Creating Gemini client...")
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey: apiKey,
	})
	if err != nil {
		log.Printf("Error creating Gemini client: %v", err)
		http.Error(w, fmt.Sprintf("Error creating Gemini client: %v", err), http.StatusInternalServerError)
		return
	}

	log.Println("Sending request to Gemini API...")
	resp, err := client.Models.GenerateContent(ctx, "gemini-2.5-pro", genai.Text(reqBody.Message), nil)
	if err != nil {
		log.Printf("Error sending message to Gemini: %v", err)
		http.Error(w, fmt.Sprintf("Error sending message to Gemini: %v", err), http.StatusInternalServerError)
		return
	}

	log.Printf("Received response from Gemini with %d candidates", len(resp.Candidates))

	var reply string
	for _, cand := range resp.Candidates {
		if cand.Content != nil {
			for _, part := range cand.Content.Parts {
				if part.Text != "" {
					reply += part.Text
				}
			}
		}
	}

	log.Printf("Generated reply (length: %d): %q", len(reply), reply)

	if err := json.NewEncoder(w).Encode(struct {
		Reply string `json:"reply"`
	}{Reply: reply}); err != nil {
		log.Printf("Error encoding response: %v", err)
		return
	}
	
	log.Println("Successfully sent response to client")
}
