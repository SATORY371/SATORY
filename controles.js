// Smooth scrolling para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// IMPORTANTE: Header mantiene transparencia completa - SIN cambios al hacer scroll
// Removido el código que cambiaba el background del header

// Animación de entrada para las tarjetas
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animación a las tarjetas
document.querySelectorAll('.service-card, .destination-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});


// CHATBOT FUNCTIONALITY
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const closeChatbotBtn = document.getElementById('close-chatbot');
const chatbotBody = document.getElementById('chatbot-body');
const frequentQuestionsDiv = document.getElementById('frequent-questions'); // This will now hold the buttons
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSendBtn = document.getElementById('chatbot-send');

// Define general bot responses in English
const botResponses = {
    "hello": "Hello! 👋 I'm your assistant (v1.0.1). How can I help you today? 🤔",
    "default": "I can't process that at the moment, but I'm learning. 📚 For more detailed assistance, please contact us directly on WhatsApp: <a href='https://wa.me/qr/OGJA3E242N7JM1' target='_blank' style='color: #25D366; text-decoration: underline;'>Chat on WhatsApp 📱</a>",
    "contact": "You can contact us via our WhatsApp numbers: +51 984 657 022 or +51 969 249 344, or by sending an email to info@okidokitravelperu.com. 📧 Our office is at Plaza San Blas, Cusco - Peru. 📍",
    "booking": "You can book a tour by contacting us directly via our WhatsApp numbers: +51 984 657 022 or +51 969 249 344, or by sending an email to info@okidokitravelperu.com. 📧",
    "best time to travel": "The best time to travel to Cusco is during the dry season, from April to October, when the weather is sunnier and rain is less frequent. ☀️☔🚫",
    "what to bring for trek": "For a trek, we recommend bringing warm clothing, sunscreen, a hat, sunglasses, trekking shoes, a small backpack, and a reusable water bottle. We will provide a more detailed list upon booking. 🎒💧",
    "private tours": "Yes, we offer private tour services for most of our routes, including Salkantay Trek and Machu Picchu, for a more personalized experience. Enjoy the exclusivity! 👥🏞️"
};

// Define specific tour answers and their keywords (in English) derived from your HTML structure
// These are now the "frequent questions" for the bot's internal logic
const frequentTourQuestions = {
    "What tours do you offer?": "We offer a variety of tours including Salkantay Trek, Inca Trail, Machu Picchu tours (by train and bus), Inca Jungle, city tours in Cusco, and treks like Humantay Lake and Rainbow Mountain, plus Choquequirao. Do you want to know more about a specific one?",
    "Salkantay Tours": "Our Salkantay Trek options include: CAMINATA SALKANTAY A MACHUPICCHU 4 DÍAS, SALKANTAY TREK + CAMINO INCA A MACHUPICCHU 5 DÍAS, CAMINATA SALKANTAY + LAGUNA HUMANTAY 2 DÍAS, and SERVICIO PRIVADO SALKANTAY TRECK A MACHUPICCHU (4 DÍAS).",
    "Inca Trail Tours": "For the Inca Trail, we offer: CAMINO INCA A MACHUPICCHU 2 DÍAS and CAMINO INCA A MACHUPICCHU 4 DÍAS. Note that the 4-day Inca Trail requires special permits booked well in advance. 📜 We also have the SALKANTAY TREK + CAMINO INCA A MACHUPICCHU 5 DÍAS combined tour.",
    "Machu Picchu Tours": "Our Machu Picchu tours include: TOURS MACHUPICCHU EN TREN DIA COMPLETO, VIAJE VALLE SAGRADO A MACHUPICCHU 2 DÍAS, VIAJE A MACHUPICCHU EN TREN 2 DÍAS, and TOURS MACHUPICCHU EN BUS 2 DÍAS.",
    "Inca Jungle Tours": "Explore with our Inca Jungle options: INCA JUNGLE TREK A MACHUPICCHU 4 DÍAS and INKA JUNGLE TREK A MACHUPICCHU.",
    "Cusco City & Valley Tours": "Our Cusco tours cover: SUPER VALLE SAGRADO 1 DÍA, MINAS DE SAL DE MARAS MORAY, VALLE SAGRADO DE LOS INCAS, and RECORRIDO POR LA CIUDAD DE CUSCO.",
    "Other Treks & Mountains": "Our trekking tours include: EL CLÁSICO LAGO DE HUMANTAY EN GRUPO DE 20 PERSONAS, LA CLÁSICA MONTAÑA ARCOIRIS EN GRUPO DE 20 PERSONAS, MONTAÑA ARCOIRIS PALCAYO EN GRUPO DE 20 PERSONAS, TOUR 7 LAGOS DE AUSANGATE EN GRUPO DE 20 PERSONAS, TOUR AL LAGO HUMANTAY 2 DÍAS, LA MONTAÑA ARCOIRIS EN SERVICIO PRIVADO, and EL LAGGO HUMANTAY EN SERVICIO PRIVADO.",
    "Choquequirao Treks": "For Choquequirao, we have: CAMINATA A CHOQUEQUIRAO DE 4 DÍAS, CAMINATA A CHOQUEQUIRAO DE 5 DÍAS, and CAMINATA A CHOQUEQUIRAO DE 7 DÍAS."
};

// Specific tour names and their descriptions for detailed queries
const specificTourDetails = {
    "caminata salkantay a machupicchu 4 dias": "This 4-day Salkantay Trek to Machu Picchu offers an incredible journey through diverse Andean landscapes, combining stunning mountain views with cloud forest sections. It's a challenging but highly rewarding alternative to the classic Inca Trail.",
    "salkantay trek + camino inca a machupicchu 5 dias": "This 5-day combined tour offers a unique experience, blending the Salkantay Trek's scenic beauty with a section of the classic Inca Trail, culminating in Machu Picchu. It's perfect for adventurers seeking variety.",
    "caminata salkantay + laguna humantay 2 dias": "A shorter 2-day trek focusing on the stunning turquoise Humantay Lagoon, known for its breathtaking beauty at the base of Humantay Mountain. A perfect option for those with less time.",
    "servicio privado salkantay treck a machupicchu (4 dias)": "Enjoy a personalized 4-day Salkantay Trek experience to Machu Picchu with our private service. This option provides greater flexibility, personalized attention, and a more intimate journey tailored to your pace and preferences.",

    "camino inca a machupicchu 2 dias": "This 2-day Inca Trail to Machu Picchu is ideal for those with limited time but still wishing to experience part of the classic Inca Trail. It includes a scenic train ride and a trek from Km 104 to Machu Picchu, entering through the Sun Gate.",
    "camino inca a machupicchu 4 dias": "The full 4-day Classic Inca Trail to Machu Picchu is a world-renowned trek that takes you through ancient Inca ruins and stunning Andean landscapes, directly to Machu Picchu. Special permits are required and must be booked well in advance due to high demand and government regulations.",

    "tours machupicchu en tren dia completo": "Our Full-Day Machu Picchu Tour by Train offers a comfortable and efficient way to visit the citadel. It includes round-trip train tickets, bus transfers, and a guided tour of Machu Picchu, allowing you to experience its magic in one unforgettable day.",
    "viaje valle sagrado a machupicchu 2 dias": "This 2-day trip combines the beauty of the Sacred Valley with a visit to Machu Picchu. You'll explore fascinating Inca sites in the Sacred Valley on day one, and then travel to Machu Picchu for a full guided tour on day two.",
    "viaje a machupicchu en tren 2 dias": "A 2-day trip to Machu Picchu by train offers a more relaxed pace. It includes an overnight stay in Aguas Calientes (Machu Picchu town), giving you more time to explore the citadel and its surroundings, perhaps even visit Huayna Picchu or Machu Picchu Mountain (additional tickets required).",
    "tours machupicchu en bus 2 dias": "Our 2-day Machu Picchu by Bus tour is a more economical option. It involves a scenic bus journey through the cloud forest, an overnight stay in Aguas Calientes, and a full guided tour of Machu Picchu, offering a different perspective of the landscape.",

    "inca jungle trek a machupicchu 4 dias": "The 4-day Inca Jungle Trek to Machu Picchu is an adventurous and multi-sport alternative. It combines downhill mountain biking, river rafting (seasonal), zip-lining, and trekking through the jungle to reach Aguas Calientes before visiting Machu Picchu.",
    "inka jungle trek a machupicchu": "This refers to our adventurous Inca Jungle Trek to Machu Picchu, a multi-activity tour that blends biking, rafting, and trekking through diverse landscapes to reach the iconic citadel. It's perfect for adrenaline seekers.",

    "super valle sagrado 1 dia": "Our Super Sacred Valley 1-Day Tour is a comprehensive exploration of the most iconic Inca sites in the Sacred Valley, including Pisac, Ollantaytambo, and Chinchero, offering a deep dive into Inca history and culture.",
    "minas de sal de maras moray": "This tour takes you to the unique Maras Salt Mines, an ancient salt-producing site, and the mysterious Moray agricultural terraces, believed to be an Inca agricultural laboratory, offering fascinating insights into Inca ingenuity.",
    "valle sagrado de los incas": "A general tour of the Sacred Valley of the Incas, exploring its rich history, beautiful landscapes, and vibrant local markets. It's an essential part of any visit to the Cusco region.",
    "recorrido por la ciudad de cusco": "Our Cusco City Tour is a half-day exploration of the city's highlights, including the Qorikancha (Temple of the Sun), Sacsayhuaman, Q'enqo, Puka Pukara, and Tambomachay, showcasing the blend of Inca and colonial architecture.",

    "el clasico lago de humantay en grupo de 20 personas": "This classic group tour to Humantay Lake is a popular full-day trek to a stunning turquoise glacial lake, offering breathtaking views of the surrounding mountains and glaciers. It's a must-see natural wonder near Cusco.",
    "la clasica montaña arcoiris en grupo de 20 personas": "Experience the vibrant Rainbow Mountain (Vinicunca) on this classic group tour. It's a full-day trek to see the unique geological formations with their colorful stripes, a truly spectacular natural phenomenon.",
    "montaña arcoiris palcayo en grupo de 20 personas": "Explore the less crowded Palcayo Rainbow Mountain on this group tour. Palcayo offers multiple rainbow mountains in a more accessible setting, providing stunning views without the extensive trek of Vinicunca.",
    "tour 7 lagos de ausangate en grupo de 20 personas": "This group tour to the 7 Lagoons of Ausangate offers an incredible high-altitude trekking experience, surrounded by the majestic Ausangate mountain. You'll discover pristine turquoise lagoons and stunning Andean landscapes.",
    "tour al lago humantay 2 dias": "An extended 2-day tour to Humantay Lake, allowing for a more immersive experience in the Andean foothills. It typically includes an overnight stay, offering a chance to see the lake at different times of day.",
    "la montaña arcoiris en servicio privado": "Enjoy a private and personalized tour to Rainbow Mountain (Vinicunca). This service offers flexibility, a dedicated guide, and a more comfortable experience tailored to your preferences, allowing you to explore at your own pace.",
    "el laggo humantay en servicio privado": "Experience the stunning Humantay Lagoon with a private service. This ensures a personalized trek, dedicated guide, and the flexibility to enjoy the beautiful scenery at your leisure.",

    "caminata a choquequirao de 4 dias": "This challenging 4-day trek to Choquequirao, the 'cradle of gold,' is an arduous but incredibly rewarding journey to a vast Inca archaeological site, often compared to Machu Picchu but far less visited. It offers a true wilderness adventure.",
    "caminata a choquequirao de 5 dias": "An extended 5-day trek to Choquequirao provides more time to explore the expansive ruins of this remote Inca city. This option allows for a deeper appreciation of the site's history and stunning surroundings.",
    "caminata a choquequirao de 7 dias": "The 7-day trek to Choquequirao is a comprehensive expedition that allows for a full immersion in the archaeological site and its surrounding Andean landscapes. It's designed for serious trekkers looking for an in-depth experience of this magnificent Inca outpost."
};

// Function to display a message in the chatbot body
function displayMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chatbot-message', type);
    messageElement.innerHTML = message; // Use innerHTML to allow for links and emojis
    chatbotBody.appendChild(messageElement);
    chatbotBody.scrollTop = chatbotBody.scrollHeight; // Scroll to the bottom
}

// Function to simulate typing (dots animation)
function simulateTyping(callback) {
    const typingMessage = document.createElement('div');
    typingMessage.classList.add('chatbot-message', 'bot');
    typingMessage.innerHTML = 'Thinking... 💭 <span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
    chatbotBody.appendChild(typingMessage);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;

    // Remove typing message after a delay, then execute callback
    setTimeout(() => {
        if (chatbotBody.contains(typingMessage)) { // Ensure it's still in the DOM before trying to remove
            chatbotBody.removeChild(typingMessage);
        }
        callback();
    }, 1500); // Reduced "thinking" time for better UX
}

// Function to load frequent tour questions as buttons
function loadTourCategoryButtons() {
    frequentQuestionsDiv.innerHTML = ''; // Clear previous questions/buttons

    // Categories to show as buttons
    const categoriesToShow = [
        "Salkantay Tours",
        "Inca Trail Tours",
        "Machu Picchu Tours",
        "Inca Jungle Tours",
        "Cusco City & Valley Tours",
        "Other Treks & Mountains",
        "Choquequirao Treks"
    ];

    categoriesToShow.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.classList.add('frequent-question-button'); // Add a class for styling
        button.addEventListener('click', () => {
            displayMessage(category, 'user'); // Show what the user "clicked"
            // Simulate typing before bot responds with the list of tours
            simulateTyping(() => {
                displayMessage(frequentTourQuestions[category], 'bot');
            });
            // Don't clear buttons immediately. Let them stay until user types or another button is clicked
            // frequentQuestionsDiv.innerHTML = ''; // Removed this line
        });
        frequentQuestionsDiv.appendChild(button);
    });

    // Add the "Show All Tours" button
    const allToursButton = document.createElement('button');
    allToursButton.textContent = "Mostrar todos los tours";
    allToursButton.classList.add('frequent-question-button', 'all-tours-button'); // Add a specific class for styling
    allToursButton.addEventListener('click', () => {
        displayMessage("Mostrar todos los tours", 'user'); // Show what the user "clicked"
        simulateTyping(() => {
            let allToursList = "Here's a list of all our available tours:<ul>";
            for (const category in frequentTourQuestions) {
                if (category !== "What tours do you offer?") { // Exclude the general question as a category
                    allToursList += `<li><strong>${category}:</strong> ${frequentTourQuestions[category]}</li>`;
                }
            }
            allToursList += "</ul><br>For more details on any specific tour, just ask me!";
            displayMessage(allToursList, 'bot');
        });
        // frequentQuestionsDiv.innerHTML = ''; // Keep buttons visible until user types or another button is clicked
    });
    frequentQuestionsDiv.appendChild(allToursButton);

    chatbotBody.scrollTop = chatbotBody.scrollHeight; // Scroll to include new buttons
}


// Toggle chatbot visibility
chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.toggle('active');
    if (chatbotContainer.classList.contains('active')) {
        chatbotBody.innerHTML = ''; // Clear previous messages when opening
        // Display initial greeting in English
        displayMessage(botResponses["hello"], 'bot');
        displayMessage("You can ask me anything about our tours or services. Here are some quick topics:", 'bot'); // New prompt
        loadTourCategoryButtons(); // Load tour category buttons when chatbot opens
        chatbotInput.disabled = false; // Enable input when chatbot opens
        chatbotSendBtn.disabled = true; // Initially disable send button
    } else {
        // Clear messages and disable input when chatbot closes
        chatbotBody.innerHTML = '';
        frequentQuestionsDiv.innerHTML = ''; // Clear buttons when chatbot closes
        chatbotInput.value = '';
        chatbotInput.disabled = true;
        chatbotSendBtn.disabled = true;
    }
});

// Close chatbot
closeChatbotBtn.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
    // Clear messages and disable input when chatbot closes
    chatbotBody.innerHTML = '';
    frequentQuestionsDiv.innerHTML = ''; // Clear buttons when chatbot closes
    chatbotInput.value = '';
    chatbotInput.disabled = true;
    chatbotSendBtn.disabled = true;
});

// Handle sending messages
chatbotSendBtn.addEventListener('click', () => {
    const userMessage = chatbotInput.value.trim();
    if (userMessage) {
        displayMessage(userMessage, 'user');
        chatbotInput.value = ''; // Clear input
        chatbotSendBtn.disabled = true; // Disable send button after sending
        frequentQuestionsDiv.innerHTML = ''; // Clear buttons after user types

        // Process user message with typing simulation
        simulateTyping(() => {
            processUserMessage(userMessage);
        });
    }
});

// Process user message
function processUserMessage(message) {
    const lowerCaseMessage = message.toLowerCase();

    // Check for general greetings and common questions first
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
        displayMessage(botResponses["hello"], 'bot');
        // After greeting, offer to show tour categories again
        setTimeout(() => {
             displayMessage("You can ask me anything about our tours or services. Here are some quick topics:", 'bot');
             loadTourCategoryButtons();
        }, 500); // Small delay before showing buttons
        return;
    }
    if (lowerCaseMessage.includes("contact") || lowerCaseMessage.includes("where are you located")) {
        displayMessage(botResponses["contact"], 'bot');
        frequentQuestionsDiv.innerHTML = ''; // Clear buttons if not relevant
        return;
    }
    if (lowerCaseMessage.includes("book a tour") || lowerCaseMessage.includes("how to book")) {
        displayMessage(botResponses["booking"], 'bot');
        frequentQuestionsDiv.innerHTML = ''; // Clear buttons if not relevant
        return;
    }
    if (lowerCaseMessage.includes("best time to travel") || lowerCaseMessage.includes("when to visit")) {
        displayMessage(botResponses["best time to travel"], 'bot');
        frequentQuestionsDiv.innerHTML = ''; // Clear buttons if not relevant
        return;
    }
    if (lowerCaseMessage.includes("what to bring for trek") || lowerCaseMessage.includes("trekking gear")) {
        displayMessage(botResponses["what to bring for trek"], 'bot');
        frequentQuestionsDiv.innerHTML = ''; // Clear buttons if not relevant
        return;
    }
    if (lowerCaseMessage.includes("private tours")) {
        displayMessage(botResponses["private tours"], 'bot');
        frequentQuestionsDiv.innerHTML = ''; // Clear buttons if not relevant
        return;
    }

    // Explicitly handle "what tours do you offer" to show buttons
    if (lowerCaseMessage.includes("what tours do you offer") || lowerCaseMessage.includes("list of tours") || lowerCaseMessage.includes("tours available")) {
        displayMessage("Certainly! We offer a variety of tours. Please select a category to see more details:", 'bot');
        loadTourCategoryButtons(); // Load buttons with tour categories
        return;
    }

    // Check against the more general tour category questions (if user types them directly)
    // We iterate through the *keys* of frequentTourQuestions
    for (const category in frequentTourQuestions) {
        // Exclude the general "What tours do you offer?" as it's handled above to show buttons
        if (category !== "What tours do you offer?" && lowerCaseMessage.includes(category.toLowerCase())) {
            displayMessage(frequentTourQuestions[category], 'bot');
            frequentQuestionsDiv.innerHTML = ''; // Clear buttons after providing specific category info
            return;
        }
    }

    // Check against specific tour names for detailed descriptions
    for (const tourName in specificTourDetails) {
        // Normalize the tour name for better matching (remove accents, spaces, special chars, and convert to lowercase)
        const normalizedTourName = tourName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, "");
        const normalizedUserMessage = lowerCaseMessage.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, "");

        if (normalizedUserMessage.includes(normalizedTourName)) {
            displayMessage(specificTourDetails[tourName], 'bot');
            frequentQuestionsDiv.innerHTML = ''; // Clear buttons after providing specific tour info
            return;
        }
    }

    // If no specific answer found
    displayMessage(botResponses["default"], 'bot');
    frequentQuestionsDiv.innerHTML = ''; // Clear buttons if default response
}


// Enable send button if input is not empty
chatbotInput.addEventListener('input', () => {
    if (chatbotInput.value.trim().length > 0) {
        chatbotSendBtn.disabled = false;
    } else {
        chatbotSendBtn.disabled = true;
    }
});

// Initially disable input and send button
chatbotInput.disabled = true;
chatbotSendBtn.disabled = true; 