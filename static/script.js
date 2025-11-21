
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    let isFirstMessage = true;

    // Configure marked with highlight.js
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch (err) {}
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '') return;

        // Clear welcome message on first interaction
        if (isFirstMessage) {
            chatMessages.innerHTML = '';
            isFirstMessage = false;
        }

        appendMessage('user', message, false);
        messageInput.value = '';
        sendButton.disabled = true;
        
        const loadingWrapper = appendMessage('bot', '', false);
        const loadingDots = createLoadingIndicator();
        loadingWrapper.querySelector('.message').appendChild(loadingDots);

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            loadingWrapper.remove();
            appendMessage('bot', data.reply || 'No response received', true);
            sendButton.disabled = false;
        })
        .catch(error => {
            console.error('Error:', error);
            loadingWrapper.remove();
            appendMessage('bot', '❌ Sorry, something went wrong. Please try again.', false);
            sendButton.disabled = false;
        });
    }

    function createLoadingIndicator() {
        const container = document.createElement('div');
        container.className = 'loading-dots';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dot.className = 'loading-dot';
            container.appendChild(dot);
        }
        return container;
    }

    function appendMessage(sender, text, parseMarkdown = false) {
        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${sender}`;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
        if (typeof text === 'string' && text !== '') {
            if (parseMarkdown && sender === 'bot') {
                messageElement.innerHTML = marked.parse(text);
                // Apply syntax highlighting to any code blocks
                messageElement.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            } else {
                messageElement.textContent = text;
            }
        }
        
        wrapper.appendChild(messageElement);
        chatMessages.appendChild(wrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return wrapper;
    }
});
