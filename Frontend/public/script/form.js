// Toggle between form steps with validation and button highlighting
function showForm(index) {
  const allForms = document.querySelectorAll(".form-step");
  const currentForm = document.querySelector(".form-step.active");
  const buttons = document.querySelectorAll('.form-tab');

  if (index > [...allForms].indexOf(currentForm)) {
    const inputs = currentForm.querySelectorAll("input, select, textarea");
    for (let input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity(); 
        return; 
      }
    }
  }

  allForms.forEach((form, i) => {
    form.classList.toggle("active", i === index);
    buttons[i].classList.toggle("active", i === index);
  });
}


// Load & auto-fill localStorage values
window.addEventListener('DOMContentLoaded', () => {
  const savedData = JSON.parse(localStorage.getItem('multiStepForm')) || {};
  const academicContainer = document.getElementById("academic-section-container");

  // Step 1: Create all academic sections based on savedData
  let academicIndex = 0;
  while (savedData[`education${academicIndex}`]) {
    if (academicIndex > 0) {
      const newSection = document.createElement("div");
      newSection.className = "academic-section contains";
      newSection.innerHTML = `
        <label>Level of Education:</label>
        <select name="education${academicIndex}">
          <option value="">Select Education</option>
          <option value="10th">10th</option>
          <option value="12th">12th</option>
          <option value="Diploma">Diploma</option>
          <option value="Graduation">Graduation</option>
          <option value="Post-Graduation">Post-Graduation</option>
          <option value="Other">Other</option>
        </select> 

        <label>Board/University:</label>
        <input type="text" name="board-university${academicIndex}" required>

        <label>School/Institute:</label>
        <input type="text" name="school-institute${academicIndex}" required>

        <label>Passing Year:</label>
        <input type="month" name="passYear${academicIndex}">

        <label>Percentage/CGPA:</label>
        <input type="number" name="percentage${academicIndex}">
      `;
      academicContainer.appendChild(newSection);
    }
    academicIndex++;
  }

  // Set the academicCount for Add More button
  academicCount = academicIndex;

  // Step 2: Fill all inputs and add listeners
  const allInputs = document.querySelectorAll('input, select, textarea');
  allInputs.forEach(input => {
    const name = input.name;
    if (!name) return;

    if (savedData.hasOwnProperty(name)) {
      if (input.type === 'radio') {
        input.checked = input.value === savedData[name];
      } else if (input.type === 'checkbox') {
        input.checked = savedData[name];
      } else if (input.type === 'select-multiple') {
        const selected = Array.isArray(savedData[name]) ? savedData[name] : [];
        Array.from(input.options).forEach(opt => {
          opt.selected = selected.includes(opt.value);
        });
      } else {
        input.value = savedData[name];
      }
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

  // Step 3: Restore skills multi-select
  if (savedData.skills && Array.isArray(savedData.skills)) {
    selected = savedData.skills;
    renderSelected();
  }
});





// Add input fields for technology used in project
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
});


// Add new project section
document.getElementById("add-project-btn").addEventListener("click", () => {
  const projectContainer = document.getElementById("project-section-container");
  const section = document.createElement("div");
  section.className = "project-section contains";

  section.innerHTML = `
    <label>Project Name</label>
    <input type="text" name="project_name">

    <label>Description</label>
    <textarea name="desc" rows="3" cols="40"></textarea>

    <label>Developer's role</label>
    <textarea name="role" rows="3" cols="40"></textarea>

    <label>Technology used</label>
    <div class="newInput">
      <span><input type="text" name="tech_uses"></span>
    </div>

    <label>Project Link</label>
    <input type="url" name="project_link">
  `;

  projectContainer.appendChild(section);
});


// Add academic section

let academicCount = 1;

document.getElementById("add-academic-btn").addEventListener("click", () => {
  const academicContainer = document.getElementById("academic-section-container");
  const newSection = document.createElement("div");
  newSection.className = "academic-section contains";

  newSection.innerHTML = `
    <label>Level of Education:</label>
    <select name="education${academicCount}">
      <option value="">Select Education</option>
      <option value="10th">10th</option>
      <option value="12th">12th</option>
      <option value="Diploma">Diploma</option>
      <option value="Graduation">Graduation</option>
      <option value="Post-Graduation">Post-Graduation</option>
      <option value="Other">Other</option>
    </select> 

    <label>Board/University:</label>
    <input type="text" name="board-university${academicCount}" required>

    <label>School/Institute:</label>
    <input type="text" name="school-institute${academicCount}" required>

    <label>Passing Year:</label>
    <input type="month" name="passYear${academicCount}">

    <label>Percentage/CGPA:</label>
    <input type="number" name="percentage${academicCount}">
  `;

  academicContainer.appendChild(newSection);

  // ✅ Attach input listeners immediately
  const inputs = newSection.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const formData = JSON.parse(localStorage.getItem('multiStepForm')) || {};
      if (input.type === 'radio') {
        formData[input.name] = input.value;
      } else if (input.type === 'checkbox') {
        formData[input.name] = input.checked;
      } else if (input.type === 'select-multiple') {
        formData[input.name] = Array.from(input.selectedOptions).map(opt => opt.value);
      } else {
        formData[input.name] = input.value;
      }
      localStorage.setItem('multiStepForm', JSON.stringify(formData));
    });
  });

  academicCount++;
});



// Multi-select dropdown
let options = ["JavaScript", "HTML", "CSS", "React", "Node.js", "Python", "Java", "C++"];
let selected = [];
const inputBox = document.getElementById("inputBox");
const optionsList = document.getElementById("optionsList");
const selectedItems = document.getElementById("selectedItems");

function updateOptions(filter = "") {
  optionsList.innerHTML = "";
  options
    .filter(item => item.toLowerCase().includes(filter.toLowerCase()) && !selected.includes(item))
    .forEach(option => {
      const div = document.createElement("div");
      div.textContent = option;
      div.onclick = () => {
        selected.push(option);
        renderSelected();
        inputBox.value = "";
        updateOptions();
      };
      optionsList.appendChild(div);
    });
}

function renderSelected() {
  selectedItems.innerHTML = "";
  selected.forEach(item => {
    const span = document.createElement("span");
    span.textContent = item;
    const close = document.createElement("i");
    close.textContent = "✕";
    close.onclick = () => {
      selected = selected.filter(i => i !== item);
      renderSelected();
      updateOptions(inputBox.value);
    };
    span.appendChild(close);
    selectedItems.appendChild(span);
  });
  localStorage.setItem('multiStepForm', JSON.stringify({
    ...(JSON.parse(localStorage.getItem('multiStepForm')) || {}),
    skills: selected
  }));
}

inputBox.addEventListener("focus", () => {
  optionsList.classList.add("active");
  updateOptions(inputBox.value);
});

inputBox.addEventListener("input", () => {
  updateOptions(inputBox.value);
});

inputBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const value = inputBox.value.trim();
    if (value && !selected.includes(value)) {
      selected.push(value);
      if (!options.includes(value)) options.push(value);
      renderSelected();
      inputBox.value = "";
      updateOptions();
    }
  }
});

document.addEventListener("click", (e) => {
  if (!document.getElementById("multiSelect").contains(e.target)) {
    optionsList.classList.remove("active");
  }
});

updateOptions();


if (Array.isArray(selected) && selected.length > 0) {
    formData.append('skills', JSON.stringify(selected));
  }


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

// ✅ Add `skills` from localStorage manually
const saved = JSON.parse(localStorage.getItem("multiStepForm") || "{}");
if (saved.skills && Array.isArray(saved.skills)) {
  formData.append("skills", JSON.stringify(saved.skills));
}


  try {
    const res = await fetch('http://localhost:3000/api/submit', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      alert('Form submitted successfully!');
      localStorage.removeItem('multiStepForm');
      window.location.href = '/thankyou';
    } else {
      alert('Submission failed.');
    }
  } catch (error) {
    alert('An error occurred while submitting.');
    console.error(error);
  }
}
