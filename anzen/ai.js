document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('ai-chat-container');
    const chatToggle = document.getElementById('ai-chat-toggle');
    const closeChat = document.getElementById('close-chat');
    const chatbaseIframe = document.getElementById('chatbase-iframe');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Backend API configuration
    const API_CONFIG = {
        endpoint: 'http://localhost:5000/api/chat'
    };

    // Initially hide the chat container
    chatContainer.style.display = 'none';

    // Toggle chat visibility
    chatToggle.addEventListener('click', (e) => {
        e.preventDefault();
        if (chatContainer.style.display === 'none') {
            chatContainer.style.display = 'block';
            setTimeout(() => {
                chatContainer.classList.add('visible');
            }, 10);
        } else {
            chatContainer.classList.remove('visible');
            setTimeout(() => {
                chatContainer.style.display = 'none';
            }, 300);
        }
    });

    // Close chat
    closeChat.addEventListener('click', () => {
        chatContainer.classList.remove('visible');
        setTimeout(() => {
            chatContainer.style.display = 'none';
        }, 300);
    });

    // Handle iframe messages
    window.addEventListener('message', (event) => {
        // Handle messages from the iframe if needed
        if (event.origin === 'https://www.chatbase.co') {
            console.log('Message from Chatbase:', event.data);
        }
    });

    // Handle quick action buttons
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');
    quickActionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            let message = '';
            switch (action) {
                case 'emergency':
                    message = 'I need emergency assistance immediately!';
                    break;
                case 'shelter':
                    message = 'Where is the nearest emergency shelter?';
                    break;
                case 'medical':
                    message = 'I need medical assistance';
                    break;
                case 'resources':
                    message = 'What emergency resources are available?';
                    break;
            }
            // Send message to iframe
            chatbaseIframe.contentWindow.postMessage({
                type: 'sendMessage',
                message: message
            }, 'https://www.chatbase.co');
        });
    });

    // Add welcome message
    addMessage('ai', 'Hello! I\'m ANZEN AI Assistant. I can help you with emergency situations, disaster preparedness, and crisis management. How can I assist you today?');

    // Handle send button click
    sendButton.addEventListener('click', sendMessage);

    // Handle Enter key press
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage('user', message);
            userInput.value = '';
            sendButton.disabled = true;
            
            // Add loading message
            const loadingMessage = addMessage('ai', 'Thinking...');
            loadingMessage.classList.add('loading');
            
            try {
                const response = await getAIResponse(message);
                loadingMessage.remove();
                addMessage('ai', response);
            } catch (error) {
                console.error('Error:', error);
                loadingMessage.remove();
                addMessage('ai', 'I apologize, but I\'m having trouble processing your request. Please try again.');
            } finally {
                sendButton.disabled = false;
            }
        }
    }

    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ${type}-message';
        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    }

    async function getAIResponse(message) {
        try {
            const response = await fetch(API_CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(errorData.error || 'Failed to get AI response');
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'Failed to get AI response');
            }

            return data.response;
        } catch (error) {
            console.error('Network Error:', error);
            throw error;
        }
    }
});
