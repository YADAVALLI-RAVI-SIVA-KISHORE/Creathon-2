document.addEventListener("DOMContentLoaded", () => {
    // Navigation Logic
    const navHome = document.getElementById('nav-home');
    const navPredict = document.getElementById('nav-predict');
    const navMenu = document.getElementById('nav-menu');
    const navAbout = document.getElementById('nav-about');
    const startBtn = document.getElementById('start-prediction-btn');
    
    const homeSection = document.getElementById('home-section');
    const predictSection = document.getElementById('predict-section');
    const menuSection = document.getElementById('menu-section');
    const aboutSection = document.getElementById('about-section');

    function navigateTo(section) {
        // hide all sections
        [homeSection, predictSection, menuSection, aboutSection].forEach(sec => {
            sec.classList.remove('active-section');
            sec.classList.add('hidden-section');
        });
        
        // deactive all nav buttons
        [navHome, navPredict, navMenu, navAbout].forEach(btn => btn.classList.remove('active'));

        if (section === 'home') {
            homeSection.classList.remove('hidden-section');
            homeSection.classList.add('active-section');
            navHome.classList.add('active');
        } else if (section === 'predict') {
            predictSection.classList.remove('hidden-section');
            predictSection.classList.add('active-section');
            navPredict.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (section === 'menu') {
            menuSection.classList.remove('hidden-section');
            menuSection.classList.add('active-section');
            navMenu.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (section === 'about') {
            aboutSection.classList.remove('hidden-section');
            aboutSection.classList.add('active-section');
            navAbout.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    navHome.addEventListener('click', () => navigateTo('home'));
    navPredict.addEventListener('click', () => navigateTo('predict'));
    navMenu.addEventListener('click', () => navigateTo('menu'));
    navAbout.addEventListener('click', () => navigateTo('about'));
    startBtn.addEventListener('click', () => navigateTo('predict'));

    // Form Logic
    const form = document.getElementById('prediction-form');
    const resultsCard = document.getElementById('results-card');
    const predictedNumber = document.getElementById('predicted-number');
    const friendlyMessage = document.getElementById('friendly-message');
    const recalculateBtn = document.getElementById('recalculate-btn');
    
    // Chart Instance
    let demandChart = null;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get values
        const day = document.getElementById('dayOfWeek').value;
        const time = document.getElementById('mealTime').value;
        const weather = document.getElementById('weather').value;
        const event = document.getElementById('event').value;

        // Prediction Logic (Rule-based simple model)
        let baseDemand = 100; // Base baseline number of meals
        
        // Meal time factor
        if (time === 'Breakfast') baseDemand = 70;
        else if (time === 'Lunch') baseDemand = 150;
        else if (time === 'Dinner') baseDemand = 100;

        // Day of week factor
        let dayFactor = 1.0;
        if (day === 'Friday') dayFactor = 1.2;
        else if (day === 'Saturday' || day === 'Sunday') dayFactor = 1.3;

        // Weather factor
        let weatherFactor = 1.0;
        if (weather === 'Rainy') weatherFactor = 1.15; // Rainy slightly increases
        else if (weather === 'Sunny') weatherFactor = 0.95; 

        // Event factor
        let eventFactor = 1.0;
        if (event === 'Yes') eventFactor = 1.5; // Event significantly increases

        // Calculate final
        let predictedMeals = Math.round(baseDemand * dayFactor * weatherFactor * eventFactor);
        
        // Display results
        displayResults(predictedMeals, time, day);
    });

    recalculateBtn.addEventListener('click', () => {
        resultsCard.classList.add('hidden-section');
        form.reset();
        window.scrollTo({ top: document.querySelector('.prediction-container').offsetTop - 100, behavior: 'smooth' });
    });

    function displayResults(total, time, day) {
        // Show the results section
        resultsCard.classList.remove('hidden-section');
        
        // Animate counting numbers
        animateNumber(predictedNumber, 0, total, 1000);
        
        // Set message
        friendlyMessage.innerHTML = `Recommended food preparation for <strong>${day}'s ${time}</strong> is approximately <strong>${total} meals</strong>.`;

        // Generate Chart
        renderChart(total);
        
        // Scroll to results if on mobile or let it just be visible
        if (window.innerWidth < 800) {
            setTimeout(() => {
                resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    }

    function animateNumber(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerText = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function renderChart(predictionTotal) {
        const ctx = document.getElementById('demandChart').getContext('2d');
        
        // Destroy old chart if exists
        if (demandChart) {
            demandChart.destroy();
        }

        // Buffer for safety (produce 10% more)
        const safetyBuffer = Math.round(predictionTotal * 0.10);
        const coreDemand = predictionTotal;

        demandChart = new Chart(ctx, {
            type: 'bar', // Using bar chart as requested for simple visualization
            data: {
                labels: ['Expected Demand', 'Safety Buffer (10%)', 'Total to Prepare'],
                datasets: [{
                    label: 'Number of Meals',
                    data: [coreDemand, safetyBuffer, coreDemand + safetyBuffer],
                    backgroundColor: [
                        'rgba(37, 99, 235, 0.7)', // Primary blue
                        'rgba(234, 179, 8, 0.7)', // Warning yellow
                        'rgba(34, 197, 94, 0.7)'  // Success green
                    ],
                    borderColor: [
                        'rgba(37, 99, 235, 1)',
                        'rgba(234, 179, 8, 1)',
                        'rgba(34, 197, 94, 1)'
                    ],
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        bodyFont: {
                            size: 16
                        },
                        titleFont: {
                            size: 16
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Meals',
                            font: {
                                size: 14
                            }
                        },
                        ticks: {
                            font: {
                                size: 14
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    }

    // Chatbot Logic
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('hidden');
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
    });

    const botResponses = {
        "hello": "Hi there! How can I help you manage the canteen today?",
        "hi": "Hello! Need help predicting meals?",
        "predict": "You can predict by clicking 'Predict' at the top menu and filling in the day and weather.",
        "waste": "Reducing food waste is our #1 goal. Use the predictor to cook exactly what's needed!",
        "menu": "We typically suggest common items like Rice Bowls, Sandwiches, and Pasta depending on the day. See the 'Menu Items' tab!",
        "weather": "Rainy weather means people stay indoors, often boosting canteen sales! Clear skies might mean lower demand.",
        "about": "This website helps canteen managers reduce leftover food by predicting demand accurately.",
        "default": "I'm a simple AI aide. Could you try asking about 'predict', 'waste', 'menu', or 'weather'?"
    };

    function processMessage() {
        const text = chatInput.value.trim().toLowerCase();
        if (!text) return;

        // Display User message
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'user-msg';
        userMsgDiv.textContent = chatInput.value;
        chatbotMessages.appendChild(userMsgDiv);
        
        chatInput.value = '';
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        // Determine Bot response
        setTimeout(() => {
            let reply = botResponses["default"];
            for (let key in botResponses) {
                if (text.includes(key)) {
                    reply = botResponses[key];
                    break;
                }
            }
            
            const botMsgDiv = document.createElement('div');
            botMsgDiv.className = 'bot-msg';
            botMsgDiv.textContent = reply;
            chatbotMessages.appendChild(botMsgDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 500);
    }

    chatSend.addEventListener('click', processMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processMessage();
    });
});
