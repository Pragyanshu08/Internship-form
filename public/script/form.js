function showForm(index) {
  const forms = document.querySelectorAll('.form-step');
  const buttons = document.querySelectorAll('.toggle-buttons button');

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
    if (!name || !savedData.hasOwnProperty(name)) return;

    if (input.type === 'radio') {
      input.checked = input.value === savedData[name];
    } else if (input.type === 'checkbox') {
      input.checked = savedData[name];
    } else if (input.type === 'select-multiple') {
      let selected = savedData[name];
      if (typeof selected === 'string') {
        try {
          selected = JSON.parse(selected);
        } catch {
          selected = [];
        }
      }
      if (!Array.isArray(selected)) selected = [];

      Array.from(input.options).forEach(option => {
        option.selected = selected.includes(option.value);
      });
    } else {
      input.value = savedData[name];
    }

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


// Add Section
let add = document.querySelector(".add");

add.addEventListener("click", function (e) {
  let span = e.target.parentElement;
  let container = span.parentElement;

  span.removeChild(e.target);

  let newSpan = document.createElement("span");

  let newInput = document.createElement("input");
  newInput.type = "text";
  newInput.name = "tech_uses";
  
  let newButton = document.createElement("button");
  newButton.className = "add";
  newButton.type = "button";
  newButton.textContent = "+";
  
  let currentId = parseInt(e.target.id) || 1;
  newButton.id = currentId + 1;

  newButton.addEventListener("click", arguments.callee); 

  newSpan.appendChild(newInput);
  newSpan.appendChild(newButton);

  container.appendChild(newSpan);

  console.log("New input added. Current button ID:", newButton.id);
});





// Submit form data
async function submitMultiForm() {
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
      alert('Form submitted successfully!');
      localStorage.removeItem('multiStepForm'); // Optional
      // location.reload();
      window.location.href = '/thankyou';
    } else {
      alert('Submission failed.');
    }
  } catch (error) {
    alert('An error occurred while submitting.');
    console.error(error);
  }
}



//admin secret button reveal code




const konamiCode = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a"
];

let enteredKeys = [];

window.addEventListener("keydown", (e) => {
  enteredKeys.push(e.key);
  if (enteredKeys.length > konamiCode.length) {
    enteredKeys.shift(); // keep last N keys
  }

  if (JSON.stringify(enteredKeys) === JSON.stringify(konamiCode)) {
    const adminBtn = document.getElementById("admin-secret");
    if (adminBtn) {
      adminBtn.style.display = "block";
      adminBtn.classList.add("flash-reveal");

    }


    enteredKeys = []; // reset
  }
});
