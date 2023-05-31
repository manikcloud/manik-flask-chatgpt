document.getElementById('submitBtn').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        sendMessage();
    }
});

function sendMessage() {
    var userInput = document.getElementById('userInput').value;

    // Display user's message
    var userMsgContainer = document.createElement('div');
    userMsgContainer.className = 'user-message';
    userMsgContainer.textContent = userInput;
    document.querySelector('.chatbox').appendChild(userMsgContainer);

    // Save chat history
    localStorage.setItem('chatHistory', document.querySelector('.chatbox').innerHTML);

    // Send message to backend and get response
    fetch('/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'message': userInput
        }),
    })
    .then(response => response.json())
    .then(data => {
        // Display bot's message
        var botMsgContainer = document.createElement('pre');
        botMsgContainer.className = 'bot-message code language-python';

        // Add copy button
        var copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Code';
        copyButton.className = 'copy-button';

        copyButton.onclick = async function() {
            console.log("Trying to copy: ", data.message);
            try {
                await navigator.clipboard.writeText(data.message);
                console.log("Copied to clipboard successfully");
            } catch (err) {
                console.log('Failed to copy text: ', err);
            }
        };
        

        // copyButton.onclick = function() {
        //     navigator.clipboard.writeText(data.message).then(function() {
        //         alert('Code copied to clipboard!');
        //     })
        //     .catch(function() {
        //         alert('Error in copying text to clipboard');
        //     });
        // };
        botMsgContainer.appendChild(copyButton);

        var botMsgText = document.createElement('code');
        botMsgText.textContent = data.message;
        botMsgText.className = 'language-python';
        Prism.highlightElement(botMsgText);
        botMsgContainer.appendChild(botMsgText);

        document.querySelector('.chatbox').appendChild(botMsgContainer);

        // Save chat history
        localStorage.setItem('chatHistory', document.querySelector('.chatbox').innerHTML);
    });

    // Clear input field
    document.getElementById('userInput').value = '';
}

// Load chat history
window.onload = function() {
    var chatHistory = localStorage.getItem('chatHistory');
    if (chatHistory) {
        document.querySelector('.chatbox').innerHTML = chatHistory;
    }
};
