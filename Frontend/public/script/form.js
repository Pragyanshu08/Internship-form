// Toggle between form steps
function showForm(index) {
  const forms = document.querySelectorAll('.form-step');
  const buttons = document.querySelectorAll('.form-tab');

  forms.forEach((form, i) => {
    form.classList.toggle('active', i === index);
    buttons[i].classList.toggle('active', i === index);
  });
}

// Load & auto-fill localStorage values
window.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('input, textarea, select');
  const savedData = JSON.parse(localStorage.getItem('multiStepForm')) || {};

  inputs.forEach(input => {
    const name = input.name;
    if (!name) return;

    // Prefill values if saved
    if (savedData.hasOwnProperty(name)) {
      if (input.type === 'radio') {
        input.checked = input.value === savedData[name];
      } else if (input.type === 'checkbox') {
        input.checked = savedData[name];
      } else if (input.type === 'select-multiple') {
        let selected = savedData[name];
        try {
          selected = JSON.parse(selected);
        } catch {
          selected = [];
        }
        if (!Array.isArray(selected)) selected = [];

        Array.from(input.options).forEach(option => {
          option.selected = selected.includes(option.value);
        });
      } else {
        input.value = savedData[name];
      }
    }

    // Attach input listener
    input.addEventListener('input', () => {
      const formData = JSON.parse(localStorage.getItem('multiStepForm')) || {};

      if (input.type === 'radio') {
        formData[name] = input.value;
      } else if (input.type === 'checkbox') {
        formData[name] = input.checked;
      } else if (input.type === 'select-multiple') {
        formData[name] = Array.from(input.selectedOptions).map(opt => opt.value);
      } else {
        formData[name] = input.value;
      }

      localStorage.setItem('multiStepForm', JSON.stringify(formData));
    });
  });
});

// Submit form data
async function submitMultiForm(event) {
  if (event) event.preventDefault();

  const inputs = document.querySelectorAll('input, textarea, select');
  const formData = new FormData();

  inputs.forEach(input => {
    if (!input.name) return;
    if (input.type === 'file' && input.files[0]) {
      formData.append(input.name, input.files[0]);
    } else if (input.type === 'select-multiple') {
      const selected = Array.from(input.selectedOptions).map(opt => opt.value);
      formData.append(input.name, JSON.stringify(selected));
    } else {
      formData.append(input.name, input.value);
    }
  });

  try {
    const res = await fetch('http://localhost:3000/api/submit', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      window.location.href = '/thankyou';
    } else {
      alert('Submission failed.');
    }
  } catch (error) {
    alert('An error occurred while submitting.');
    console.error(error);
  }
}
