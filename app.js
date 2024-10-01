  const chatHistory = document.getElementById('chat-history');
      const userInput = document.getElementById('user-input');
      const form = document.getElementById('chat-form');
      const chatContainer = document.getElementById('chat-container');
      const loader = document.getElementById('loader');

      async function sendMessage() {
        const userMessage = userInput.value;
        userInput.value = ''; 
        console.log(userMessage);
    
        try {
            const response = await fetch('http://localhost:3000/chat', { // Use localhost URL here
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userInput: userMessage }),
            });
    
            const data = await response.json();
            console.log(data);
            const botMessage = data.response;
            console.log(botMessage);
            
            chatHistory.innerHTML += `<div class="user-message">${userMessage}</div>`;
            chatHistory.innerHTML += `<div class="bot-message">${botMessage}</div>`;
            chatHistory.scrollTop = chatHistory.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
        }
    }
    

      form.addEventListener('submit', (event) => {
        event.preventDefault(); 
        chatContainer.classList.add('loading');
        loader.style.display = 'block'; 
        sendMessage().finally(() => {
          loader.style.display = 'none'; 
          chatContainer.classList.remove('loading');
            });
      });
