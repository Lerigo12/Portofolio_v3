/**
 * Form Validation & EmailJS Module.
 * Client-side validation with EmailJS integration.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your EmailJS template ID

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const successEl = document.getElementById('contact-success');
  if (!form || !successEl) return;

  // Initialize EmailJS if available
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormState(form);

    const inputs = form.querySelectorAll('.contact__field-input');
    let allValid = true;
    let firstError = null;

    inputs.forEach((input) => {
      if (!validateField(input)) {
        allValid = false;
        if (!firstError) firstError = input;
      }
    });

    if (!allValid) {
      if (firstError) firstError.focus();
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.contact__submit');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>SENDING...</span>';

    try {
      // Prepare template params for EmailJS
      const templateParams = {
        from_name: form.from_name.value.trim(),
        from_email: form.from_email.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim(),
        to_email: 'achmadnaufal124@gmail.com',
      };

      if (typeof emailjs !== 'undefined' && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      } else {
        // Fallback for development - just simulate success
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      form.style.display = 'none';
      successEl.classList.add('is-active');

      setTimeout(() => {
        form.reset();
        form.style.display = 'flex';
        successEl.classList.remove('is-active');
        clearFormState(form);
      }, 5000);

    } catch (error) {
      console.error('EmailJS error:', error);
      // Show error to user
      alert('Failed to send message. Please try again later.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  form.querySelectorAll('.contact__field-input').forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-error')) validateField(input);
    });
  });
}

function validateField(input) {
  const errorEl = input.parentElement.querySelector('.contact__field-error');
  const value = input.value.trim();
  let isValid = true;

  if (input.name === 'from_email') {
    isValid = EMAIL_REGEX.test(value);
  } else {
    isValid = value.length > 0;
  }

  if (isValid) {
    input.classList.remove('is-error');
    input.classList.add('is-success');
    if (errorEl) errorEl.classList.remove('is-visible');
  } else {
    input.classList.remove('is-success');
    input.classList.add('is-error');
    if (errorEl) errorEl.classList.add('is-visible');
  }
  return isValid;
}

function clearFormState(form) {
  form.querySelectorAll('.contact__field-input').forEach((input) => {
    input.classList.remove('is-error', 'is-success');
  });
  form.querySelectorAll('.contact__field-error').forEach((el) => {
    el.classList.remove('is-visible');
  });
}