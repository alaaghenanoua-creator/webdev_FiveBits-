

const dateInput = document.getElementById('Date');
const timeInput = document.getElementById('start_time');
const durationInput = document.getElementById('expected_duration');

// Show a red message right after the given element
function showError(target, message) {
    const error = document.createElement('p');
    error.className = 'error-message';
    error.textContent = message;
    target.insertAdjacentElement('afterend', error);
    if (target.matches('input')) target.classList.add('invalid');
}

// Remove every error message and red border 
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(function (e) {
        e.remove();
    });
    document.querySelectorAll('.invalid').forEach(function (i) {
        i.classList.remove('invalid');
    });
}

// Today's date as yyyy-mm-dd (local time), to compare with the date input
function todayString() {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + month + '-' + day;
}

// Returns true when everything is correct
function validateForm() {
    clearErrors();
    let valid = true;

    // --- Date: required and not in the past ---
    if (!dateInput.value) {
        showError(dateInput, 'Please choose a date.');
        valid = false;
    } else if (dateInput.value < todayString()) {
        showError(dateInput, 'The date cannot be in the past.');
        valid = false;
    }

    // --- Start time: required (and not already passed if the date is today) ---
    if (!timeInput.value) {
        showError(timeInput, 'Please choose a start time.');
        valid = false;
    } else if (dateInput.value === todayString()) {
        const now = new Date();//to check if the start time is passed in case when we have reserving in the current day
        const currentTime =
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0');
        if (timeInput.value <= currentTime) {
            showError(timeInput, 'The start time has already passed.');
            valid = false;
        }
    }

    //duration: required and must be one of the datalist options ---
    const allowed = Array.from(document.querySelectorAll('#durations option'))
        .map(function (o) { return o.value.toLowerCase(); });
    const duration = durationInput.value.trim().toLowerCase();
    if (!duration) {
        showError(durationInput, 'Please choose an expected duration.');
        valid = false;
    } else if (!allowed.includes(duration)) {
        showError(durationInput, 'Please pick a duration from the list.');
        valid = false;
    }

    // --- Where: one radio must be checked ---
    if (!document.querySelector('input[name="where"]:checked')) {
        const lastCard = document.querySelector('.remote');
        showError(lastCard, 'Please choose in person or remote.');
        valid = false;
    }

    // --- Purpose: one radio must be checked ---
    if (!document.querySelector('input[name="purpose"]:checked')) {
        const lastBlock = document.querySelector('.right');
        showError(lastBlock, 'Please choose a purpose.');
        valid = false;
    }

    // Communication preferences and additional information are optional.

    return valid;
}

// Run the check when "Review request" is pressed
document.getElementById('review_btn').addEventListener('click', function (event) {
    event.preventDefault();

    if (validateForm()) {
        // Everything is OK -> continue to the review step here
        alert('Form is valid. Continue to review.');
    } else {
        // Scroll to the first error so the user sees it
        const firstError = document.querySelector('.error-message');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// Remove an error as soon as the user fixes the field
[dateInput, timeInput, durationInput].forEach(function (input) {
    input.addEventListener('input', function () {
        input.classList.remove('invalid');
        const next = input.nextElementSibling;
        if (next && next.classList.contains('error-message')) next.remove();
    });
});

document.querySelectorAll('input[name="where"], input[name="purpose"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        const group = radio.name === 'where' ? '.remote' : '.right';
        const next = document.querySelector(group).nextElementSibling;
        if (next && next.classList.contains('error-message')) next.remove();
    });
});