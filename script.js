document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const replayButton = document.getElementById('replay-button');
    const typingText = document.getElementById('typing-text');
    const inputContainer = document.getElementById('input-container');
    const animationContainer = document.getElementById('animation-container');
    const fontSelect = document.getElementById('font-select');
    const bgColorSelect = document.getElementById('bg-color-select');
    const customColor = document.getElementById('custom-color');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const fontSizeValue = document.getElementById('font-size-value');
    
    let typingInterval;
    const typingSpeed = 100; // milliseconds per character
    
    // Store animation as renderable text
    let animationText = "";
    let isAnimationFinished = false;
    let currentFontSize = 3; // default font size in rem
    
    // Keyboard shortcuts tooltip elements
    const resetTooltip = document.createElement('span');
    resetTooltip.className = 'shortcut-tooltip';
    resetTooltip.textContent = 'Esc';
    resetButton.appendChild(resetTooltip);
    
    const replayTooltip = document.createElement('span');
    replayTooltip.className = 'shortcut-tooltip';
    replayTooltip.textContent = 'Space';
    replayButton.appendChild(replayTooltip);
    
    // Sync the custom color picker with the select dropdown
    bgColorSelect.addEventListener('change', function() {
        customColor.value = bgColorSelect.value;
    });
    
    customColor.addEventListener('input', function() {
        // Create a new option for custom color if it doesn't match any presets
        let found = false;
        for (let i = 0; i < bgColorSelect.options.length; i++) {
            if (bgColorSelect.options[i].value === customColor.value) {
                bgColorSelect.selectedIndex = i;
                found = true;
                break;
            }
        }
        
        if (!found) {
            bgColorSelect.selectedIndex = -1; // Deselect any option
        }
    });
    
    // Font size slider functionality
    fontSizeSlider.addEventListener('input', function() {
        currentFontSize = parseFloat(this.value);
        fontSizeValue.textContent = currentFontSize.toFixed(1);
        
        // Update the preview if animation is active
        if (animationContainer.classList.contains('active')) {
            typingText.style.fontSize = currentFontSize + 'rem';
        }
    });
    
    startButton.addEventListener('click', function() {
        const text = textInput.value.trim();
        
        if (text === '') {
            alert('Please enter some text first!');
            return;
        }
        
        // Store animation text for recreation
        animationText = text;
        isAnimationFinished = false;
        
        // Apply selected font to typing text
        const selectedFont = fontSelect.value;
        typingText.style.fontFamily = selectedFont;
        
        // Apply selected background color
        const selectedColor = customColor.value;
        animationContainer.style.backgroundColor = selectedColor;
        
        // Apply selected font size
        typingText.style.fontSize = currentFontSize + 'rem';
        
        // Reset the typing area with just the cursor
        typingText.innerHTML = '<span class="cursor"></span>';
        
        // Show animation container, hide input
        animationContainer.classList.add('active');
        
        // Clear any previous interval
        clearInterval(typingInterval);
        
        // Run the typing animation
        runTypingAnimation(text);
    });
    
    function runTypingAnimation(text) {
        let charIndex = 0;
        
        typingInterval = setInterval(function() {
            if (charIndex < text.length) {
                // Add the next character
                const cursor = typingText.querySelector('.cursor');
                const charToType = document.createTextNode(text[charIndex]);
                typingText.insertBefore(charToType, cursor);
                charIndex++;
            } else {
                // End of text, clear interval
                clearInterval(typingInterval);
                isAnimationFinished = true;
            }
        }, typingSpeed);
    }
    
    // Reset functionality
    function resetAnimation() {
        // Only reset if animation is active
        if (animationContainer.classList.contains('active')) {
            // Hide animation, show input
            animationContainer.classList.remove('active');
            
            // Clear interval if animation is still running
            clearInterval(typingInterval);
        }
    }
    
    resetButton.addEventListener('click', resetAnimation);
    
    // Replay functionality
    function replayAnimation() {
        if (animationText === "") {
            alert('Please run the animation first before replaying.');
            return;
        }
        
        // Only replay if animation is active
        if (animationContainer.classList.contains('active')) {
            // Clear any previous interval
            clearInterval(typingInterval);
            
            // Reset typing area with just the cursor
            typingText.innerHTML = '<span class="cursor"></span>';
            
            // Run the animation again
            runTypingAnimation(animationText);
        }
    }
    
    replayButton.addEventListener('click', replayAnimation);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape key for reset
        if (e.key === 'Escape' || e.key === 'Esc') {
            resetAnimation();
        }
        
        // Space bar for replay
        if (e.key === ' ' && animationContainer.classList.contains('active')) {
            // Prevent default space behavior (page scroll)
            e.preventDefault();
            replayAnimation();
        }
    });
}); 