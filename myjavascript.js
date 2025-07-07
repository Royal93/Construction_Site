// Company Configuration - Corrected and consistent
const COMPANY_CONFIG = {
    whatsapp: '27675931789', // Your WhatsApp number (consistent across all files)
    email: 'josephndimu0@gmail.com', // Your company email (consistent)
    name: 'J. NDIMU FIXING PTY LTD'
};

// EmailJS Configuration - You need to get these from emailjs.com
const EMAILJS_CONFIG = {
    publicKey: 'AVL9ApJUojyKrG1f-', // Replace with your EmailJS public key
    serviceId: 'service_dgvzpcc', // Replace with your EmailJS service ID
    templateId: 'template_6op9b2m' // Replace with your EmailJS template ID
};

// Initialize EmailJS when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS initialized successfully');
    } else {
        console.warn('EmailJS not loaded. Make sure to include the EmailJS script in your HTML.');
    }
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Initialize video fallback
    const video = document.getElementById('heroVideo');
    if (video) {
        video.addEventListener('error', function() {
            // Create fallback background if video fails to load
            const videoContainer = document.querySelector('.video-container');
            if (videoContainer) {
                videoContainer.style.background = 'linear-gradient(135deg, #ff6b35 0%, #ff8f65 100%)';
            }
        });
    }
});

// Contact Form Handling with WhatsApp and EmailJS Integration
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        console.log('Contact form found, attaching event listener...');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted, processing...');
            
            // Get form data with proper trimming
            const formData = new FormData(contactForm);
            const firstName = formData.get('firstName')?.trim();
            const surname = formData.get('surname')?.trim();
            const email = formData.get('email')?.trim();
            const phone = formData.get('phone')?.trim();
            const service = formData.get('service');
            const message = formData.get('message')?.trim() || 'No additional message provided';
            
            console.log('Form data collected:', {
                firstName, surname, email, phone, service, message
            });
            
            // Validate required fields
            if (!firstName || !surname || !email || !phone || !service) {
                console.log('Validation failed: missing required fields');
                showErrorMessage('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                console.log('Validation failed: invalid email');
                showErrorMessage('Please enter a valid email address.');
                return;
            }
            
            // Phone validation (basic but flexible)
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
            if (!phoneRegex.test(phone)) {
                console.log('Validation failed: invalid phone');
                showErrorMessage('Please enter a valid phone number.');
                return;
            }
            
            console.log('Validation passed, processing form...');
            
            // Process form submission with WhatsApp and Email
            processFormSubmission({
                firstName,
                surname,
                email,
                phone,
                service,
                message
            });
        });
    } else {
        console.error('Contact form not found! Make sure the form has id="contactForm"');
    }
});

function processFormSubmission(data) {
    console.log('Processing form submission...');
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    if (!submitBtn) {
        console.error('Submit button not found!');
        return;
    }
    
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    try {
        console.log('Creating messages...');
        
        // Create formatted messages
        const whatsappMessage = createWhatsAppMessage(data);
        const emailContent = createEmailContent(data);
        
        console.log('Messages created, showing options...');
        
        // Show options to user
        showSendOptions(whatsappMessage, emailContent, data, () => {
            console.log('Send completed, resetting form...');
            
            // Reset button after user chooses
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Clear form
            document.getElementById('contactForm').reset();
            
            // Show success message
            showSuccessMessage();
        });
        
        // Log form data for debugging
        console.log('Form Data Processed Successfully:', {
            firstName: data.firstName, 
            surname: data.surname, 
            email: data.email, 
            phone: data.phone, 
            service: data.service, 
            message: data.message.substring(0, 100) + '...',
            whatsappNumber: COMPANY_CONFIG.whatsapp,
            companyEmail: COMPANY_CONFIG.email
        });
        
    } catch (error) {
        console.error('Error processing form:', error);
        showErrorMessage('There was an error processing your request. Please try again.');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function createWhatsAppMessage(data) {
    const fullName = `${data.firstName} ${data.surname}`;
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const timeStr = currentDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    return `*NEW CONSTRUCTION INQUIRY*
=============================

*Client Details:*
Name: ${fullName}
Email: ${data.email}
Phone: ${data.phone}

*Service Required:*
${data.service}

*Message:*
${data.message}

*Date:* ${dateStr}
*Time:* ${timeStr}

This inquiry was submitted through your website contact form. Please respond promptly.

Thanks!
Premier Construction`;
}

function createEmailContent(data) {
    const fullName = `${data.firstName} ${data.surname}`;
    const currentDate = new Date();
    const timestamp = currentDate.toLocaleString();
    
    const subject = `New Construction Inquiry - ${fullName}`;
    
    const body = `Dear ${COMPANY_CONFIG.name} Team,

You have received a new construction inquiry through your website.

CLIENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${fullName}
Email: ${data.email}
Phone: ${data.phone}

SERVICE REQUESTED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.service}

CLIENT MESSAGE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message}

INQUIRY DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted: ${timestamp}
Source: Website Contact Form
Status: New Inquiry

ACTION REQUIRED:
Please respond to this client within 24 hours to maintain excellent customer service standards.

Best regards,
Website Contact System`;

    return { subject, body };
}

function showSendOptions(whatsappMessage, emailContent, formData, callback) {
    console.log('Showing send options modal...');
    
    // Remove any existing modal first
    const existingModal = document.querySelector('.send-options-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal for send options
    const modal = document.createElement('div');
    modal.className = 'send-options-modal';
    modal.style.display = 'flex'; // Show immediately
    modal.innerHTML = `
        <div class="send-options-content">
            <h3>Choose How to Send Your Inquiry</h3>
            <p>Your inquiry has been prepared. Choose your preferred method to contact Premier Construction:</p>
            
            <div class="send-buttons">
                <button class="send-btn whatsapp-btn" id="whatsappBtn">
                    <i class="fab fa-whatsapp"></i>
                    Send via WhatsApp
                </button>
                
                <button class="send-btn email-btn" id="emailBtn">
                    <i class="fas fa-envelope"></i>
                    Send via Email
                </button>
                
                <button class="send-btn both-btn" id="bothBtn">
                    <i class="fas fa-paper-plane"></i>
                    Send Both Ways
                </button>
            </div>
            
            <button class="close-btn" id="closeBtn">Cancel</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners to the buttons
    document.getElementById('whatsappBtn').addEventListener('click', function() {
        console.log('WhatsApp button clicked');
        sendViaWhatsApp(whatsappMessage);
        closeModal();
        callback();
    });
    
    document.getElementById('emailBtn').addEventListener('click', function() {
        console.log('Email button clicked');
        sendViaEmailJS(formData, closeModal, callback);
    });
    
    document.getElementById('bothBtn').addEventListener('click', function() {
        console.log('Both button clicked');
        sendViaWhatsApp(whatsappMessage);
        sendViaEmailJS(formData, closeModal, callback);
    });
    
    document.getElementById('closeBtn').addEventListener('click', function() {
        console.log('Close button clicked');
        closeModal();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            console.log('Modal backdrop clicked');
            closeModal();
        }
    });
    
    function closeModal() {
        console.log('Closing modal...');
        if (modal && modal.parentNode) {
            modal.remove();
        }
    }
    
    console.log('Modal created and displayed');
}

function sendViaWhatsApp(message) {
    const cleanNumber = COMPANY_CONFIG.whatsapp.replace(/[^\d]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    console.log('Opening WhatsApp with:', {
        number: cleanNumber,
        originalNumber: COMPANY_CONFIG.whatsapp,
        url: whatsappURL.substring(0, 100) + '...' // Log first 100 chars of URL
    });
    
    try {
        window.open(whatsappURL, '_blank');
    } catch (error) {
        console.error('WhatsApp error:', error);
        showErrorMessage('Could not open WhatsApp. Please contact us directly at: ' + COMPANY_CONFIG.whatsapp);
    }
}

// NEW: EmailJS Integration - This actually sends emails from your website!
function sendViaEmailJS(formData, closeModal, callback) {
    console.log('Sending email via EmailJS...');
    
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS not available');
        showErrorMessage('Email service not available. Please use WhatsApp or contact us directly.');
        closeModal();
        return;
    }
    
    // Check if configuration is set
    if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY' || 
        EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID' || 
        EMAILJS_CONFIG.templateId === 'YOUR_TEMPLATE_ID') {
        console.error('EmailJS not configured');
        showErrorMessage('Email service not configured. Please use WhatsApp or contact us directly.');
        closeModal();
        return;
    }
    
    // Show loading state
    const emailBtn = document.getElementById('emailBtn');
    if (emailBtn) {
        emailBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        emailBtn.disabled = true;
    }
    
    // Prepare template parameters for EmailJS
    const templateParams = {
        to_email: COMPANY_CONFIG.email,
        from_name: `${formData.firstName} ${formData.surname}`,
        from_email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        reply_to: formData.email
    };
    
    console.log('Sending email with params:', templateParams);
    
    // Send email using EmailJS
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
        .then(function(response) {
            console.log('Email sent successfully!', response.status, response.text);
            closeModal();
            callback();
            showSuccessMessage('Email sent successfully! We will respond within 24 hours.');
        })
        .catch(function(error) {
            console.error('Email sending failed:', error);
            closeModal();
            showErrorMessage('Failed to send email. Please try WhatsApp or contact us directly at: ' + COMPANY_CONFIG.email);
        })
        .finally(function() {
            // Reset button state
            if (emailBtn) {
                emailBtn.innerHTML = '<i class="fas fa-envelope"></i> Send via Email';
                emailBtn.disabled = false;
            }
        });
}

// Fallback mailto function (kept as backup)
function sendViaEmailFallback(emailContent) {
    const { subject, body } = emailContent;
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const mailtoURL = `mailto:${COMPANY_CONFIG.email}?subject=${encodedSubject}&body=${encodedBody}`;
    
    console.log('Opening Email with fallback method:', {
        email: COMPANY_CONFIG.email,
        subject: subject.substring(0, 50) + '...',
        urlLength: mailtoURL.length
    });
    
    // Check if URL is too long (common issue)
    if (mailtoURL.length > 2000) {
        console.warn('Email URL too long, showing copy option instead');
        showCopyEmailOption(emailContent);
        return;
    }
    
    // Try multiple methods to open email
    try {
        window.location.href = mailtoURL;
        // Give user feedback
        setTimeout(() => {
            if (confirm('Did your email client open? If not, click OK to copy the message instead.')) {
                showCopyEmailOption(emailContent);
            }
        }, 3000);
    } catch (error) {
        console.log('Primary email method failed, trying fallback...');
        // Fallback method
        const link = document.createElement('a');
        link.href = mailtoURL;
        link.click();
        
        // Still show copy option as backup
        setTimeout(() => {
            showCopyEmailOption(emailContent);
        }, 2000);
    }
}

function showCopyEmailOption(emailContent) {
    const { subject, body } = emailContent;
    const fullEmail = `To: ${COMPANY_CONFIG.email}
Subject: ${subject}

${body}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(fullEmail).then(() => {
            alert('Email content copied to clipboard! You can now paste it into your email client.');
        }).catch(() => {
            showTextToCopy(fullEmail);
        });
    } else {
        showTextToCopy(fullEmail);
    }
}

function showTextToCopy(text) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 3000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; max-height: 80vh; overflow-y: auto;">
            <h3>Copy Email Content</h3>
            <p>Copy this text and paste it into your email client:</p>
            <textarea style="width: 100%; height: 200px; margin: 10px 0; padding: 10px; border: 1px solid #ccc;" readonly>${text}</textarea>
            <div style="text-align: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="background: #ff6b35; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showSuccessMessage(customMessage = null) {
    console.log('Showing success message...');
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        if (customMessage) {
            const successText = successMessage.querySelector('p');
            if (successText) {
                successText.textContent = customMessage;
            }
        }
        successMessage.style.display = 'flex';
    } else {
        console.error('Success message element not found!');
        // Create a simple alert as fallback
        alert(customMessage || 'Message sent successfully! We will get back to you soon.');
    }
}

function showErrorMessage(message) {
    console.log('Showing error message:', message);
    
    // Create error message element if it doesn't exist
    let errorDiv = document.getElementById('errorMessage');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'errorMessage';
        errorDiv.className = 'error-message-popup';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
                <p id="errorText"></p>
                <button onclick="closeErrorMessage()">Close</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }
    
    // Update error message text
    document.getElementById('errorText').textContent = message;
    errorDiv.style.display = 'flex';
    
    // Auto-hide after 8 seconds (longer for error messages)
    setTimeout(() => {
        closeErrorMessage();
    }, 8000);
}

function closeErrorMessage() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

function closeSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'none';
    }
}

// Gallery Functionality
function filterGallery(category) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter gallery items
    galleryItems.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
            // Add animation
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        } else {
            item.style.display = 'none';
        }
    });
}

// Modal Functionality
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    if (modal && modalImg) {
        modal.style.display = 'block';
        modalImg.src = imageSrc;
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside the image
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});

// Smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity for loading effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // If image is already loaded (from cache)
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
});

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Animate service cards, gallery items, etc.
    const elementsToAnimate = document.querySelectorAll('.service-card, .service-detail, .gallery-item, .home-project-item');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Active navigation highlighting
document.addEventListener('DOMContentLoaded', function() {
    const currentLocation = location.pathname.split('/').pop() || 'home.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentLocation || (currentLocation === '' && href === 'home.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && hamburger) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
});

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button functionality
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ff6b35;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('click', scrollToTop);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.4)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    });
});

// Debug functions for testing
function testWhatsApp() {
    const testMessage = "Test message from Premier Construction website";
    sendViaWhatsApp(testMessage);
}

function testEmailJS() {
    const testData = {
        firstName: "Test",
        surname: "User",
        email: "test@example.com",
        phone: "1234567890",
        service: "concrete",
        message: "This is a test email from the website contact form."
    };
    
    sendViaEmailJS(testData, () => {}, () => {});
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('J.NDIMU FIXING JavaScript loaded successfully');
    console.log('Contact configuration:', {
        whatsapp: COMPANY_CONFIG.whatsapp,
        email: COMPANY_CONFIG.email,
        company: COMPANY_CONFIG.name
    });
    
    // Check EmailJS configuration
    if (EMAILJS_CONFIG.publicKey === 'AVL9ApJUojyKrG1f-') {
        console.warn('⚠️ EmailJS not configured yet. Please set up your EmailJS credentials.');
    }
});

// ==========================================
// ENHANCED GALLERY FUNCTIONALITY
// Add these functions to your myjavavascript.js file
// ==========================================

// Updated Gallery Functionality with Image Loading and Better Filtering
function filterGallery(category) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Count visible items for each category
    let visibleCount = 0;
    
    // Filter gallery items with improved animation
    galleryItems.forEach((item, index) => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
            visibleCount++;
            
            // Add staggered animation
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px) scale(0.9)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            }, index * 100); // Stagger animation by 100ms per item
            
        } else {
            // Hide items with fade out
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px) scale(0.8)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
    
    // Update category info (optional)
    updateCategoryInfo(category, visibleCount);
}

// Function to update category information
function updateCategoryInfo(category, count) {
    const categoryNames = {
        'all': 'All Projects',
        'concrete': 'Concrete & Rebar Work',
        'formwork': 'Formwork & Scaffolding',
        'foundation': 'Foundation Construction',
        'structural': 'Structural Steel Work',
        'building': 'Building Construction'
    };
    
    // Log category info for debugging
    console.log(`Showing ${count} items in category: ${categoryNames[category] || category}`);
}

// Enhanced Modal Functionality with Image Loading
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('modalCaption');
    
    if (modal && modalImg) {
        // Show loading state
        modalImg.style.opacity = '0';
        modal.style.display = 'block';
        
        // Create new image to preload
        const img = new Image();
        img.onload = function() {
            modalImg.src = imageSrc;
            modalImg.style.opacity = '1';
            
            // Extract image name for caption
            const imageName = imageSrc.split('/').pop().replace(/\.[^/.]+$/, "");
            const formattedName = imageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            if (caption) {
                caption.textContent = formattedName;
            }
        };
        
        img.onerror = function() {
            modalImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
            modalImg.style.opacity = '1';
            if (caption) {
                caption.textContent = 'Image not found';
            }
        };
        
        img.src = imageSrc;
    }
}

// Enhanced closeModal function
function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Enhanced image loading for gallery items
function initializeGalleryImages() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(img => {
        // Create placeholder while loading
        img.style.background = '#f0f0f0';
        img.style.minHeight = '250px';
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.parentElement.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            // Create a placeholder SVG for missing images
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PGcgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTE0MCA5MGg0MHY0MGgtNDB6bTUwIDBoNDB2NDBoLTQweiIvPjxjaXJjbGUgY3g9IjE2MCIgY3k9IjExMCIgcj0iNSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjExMCIgcj0iNSIvPjwvZz48dGV4dCB4PSI1MCUiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db25zdHJ1Y3Rpb24gSW1hZ2U8L3RleHQ+PC9zdmc+';
            this.style.opacity = '1';
        });
        
        // Set initial opacity for loading effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        // If image is already loaded (from cache)
        if (img.complete && img.naturalHeight !== 0) {
            img.style.opacity = '1';
            img.parentElement.classList.add('loaded');
        }
    });
}

// Add this to your existing DOMContentLoaded event listener
// Or create a new one if you don't have one for gallery
document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery images
    initializeGalleryImages();
    
    // Add keyboard navigation for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Close modal when clicking outside the image (enhanced)
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Add loading animation for gallery items on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const galleryObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        // Set initial state for animation
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        
        galleryObserver.observe(item);
    });
    
    console.log('Gallery initialized with', galleryItems.length, 'items');
});