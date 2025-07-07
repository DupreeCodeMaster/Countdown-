document.addEventListener('DOMContentLoaded', function() {
    const countdownNameInput = document.getElementById('countdown-name');
    const countdownDateInput = document.getElementById('countdown-date');
    const createButton = document.getElementById('create-countdown');
    const countdownDisplay = document.querySelector('.countdown-display');
    const celebrationDisplay = document.getElementById('celebration');
    const currentCountdownName = document.getElementById('current-countdown-name');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const qrCodeElement = document.getElementById('qr-code');
    
    let countdownInterval;
    let targetDate;
    
    createButton.addEventListener('click', function() {
        const countdownName = countdownNameInput.value.trim();
        const countdownDate = countdownDateInput.value;
        
        if (!countdownName || !countdownDate) {
            alert('Bitte geben Sie einen Namen und ein Datum ein.');
            return;
        }
        
        // Clear previous countdown
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        
        // Set new countdown
        targetDate = new Date(countdownDate);
        currentCountdownName.textContent = countdownName;
        countdownDisplay.style.display = 'block';
        celebrationDisplay.style.display = 'none';
        
        // Generate QR Code
        generateQRCode(countdownName, targetDate);
        
        // Start countdown
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    });
    
    function updateCountdown() {
        const now = new Date();
        const difference = targetDate - now;
        
        if (difference <= 0) {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = 'none';
            celebrationDisplay.style.display = 'flex';
            startFireworks();
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }
    
    function generateQRCode(name, date) {
        // Clear previous QR code
        qrCodeElement.innerHTML = '';
        
        // Create data for QR code (URL with countdown parameters)
        const data = {
            name: name,
            date: date.toISOString()
        };
        
        const dataString = JSON.stringify(data);
        const url = `${window.location.href}?countdown=${encodeURIComponent(dataString)}`;
        
        // Generate QR code
        new QRCode(qrCodeElement, {
            text: url,
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    
    function startFireworks() {
        // Simple fireworks effect (can be enhanced with fireworks.js)
        const fireworksLeft = document.querySelector('.fireworks-left');
        const fireworksRight = document.querySelector('.fireworks-right');
        
        fireworksLeft.innerHTML = '🎇';
        fireworksRight.innerHTML = '🎆';
        
        // For more advanced fireworks, you would use a library like fireworks.js
    }
    
    // Check for countdown in URL parameters
    function checkForSavedCountdown() {
        const urlParams = new URLSearchParams(window.location.search);
        const countdownParam = urlParams.get('countdown');
        
        if (countdownParam) {
            try {
                const data = JSON.parse(decodeURIComponent(countdownParam));
                countdownNameInput.value = data.name;
                countdownDateInput.value = data.date.slice(0, 16); // Format for datetime-local input
                createButton.click();
            } catch (e) {
                console.error('Error loading countdown from URL:', e);
            }
        }
    }
    
    checkForSavedCountdown();
});