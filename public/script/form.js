//toggling
function showForm(index) {
  const forms = document.querySelectorAll('.form-step');
  const buttons = document.querySelectorAll('.toggle-buttons button');

  forms.forEach((form, i) => {
    form.classList.toggle('active', i === index);
    buttons[i].classList.toggle('active', i === index);
  });
}


//required validation
function showForm(index) {
  const allForms = document.querySelectorAll(".form-step");
  const currentForm = document.querySelector(".form-step.active");

  if (index > [...allForms].indexOf(currentForm)) {
    const inputs = currentForm.querySelectorAll("input, select, textarea");
    for (let input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity(); 
        return; 
      }
    }
  }
  allForms.forEach(form => form.classList.remove("active"));
  allForms[index].classList.add("active");
}


//first toggle glow & remove
let first_toggle = document.querySelector(".first-toggle");
let first_btn= document.querySelector(".next");
console.log(first_toggle)
first_btn.addEventListener("click",function(){
  first_toggle.classList.remove("first-toggle");
})


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


// Add input section on the project
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


// Add project container 
const projectContainer = document.getElementById("project-section-container");
const addProjectBtn = document.getElementById("add-project-btn");
let projectCount = 1;
let i=2;

addProjectBtn.addEventListener("click", () => {
  const section = document.createElement("div");
  section.className = "project-section contains";

  section.innerHTML = `
    <label>Project Name ${i}</label>
    <input type="text" name="project_name${projectCount}">

    <label for="desc">Description</label>
    <textarea name="desc${projectCount}" rows="3" cols="40"></textarea>

    <label>Developer's role</label>
    <textarea name="role${projectCount}" rows="3" cols="40"></textarea>

    <label>Technology used</label>
    <div class="newInput">
      <span><input type="text" name="tech_uses${projectCount}"></span>
    </div>

    <label>Project Link</label>
    <input type="url" name="project_link${projectCount}">
  `;

  projectContainer.appendChild(section);
  projectCount++
  i++;
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


// adding the new edu-box 
  const academicContainer = document.getElementById("academic-section-container");
  const addAcademicBtn = document.getElementById("add-academic-btn");

  let academicCount = 1;

  addAcademicBtn.addEventListener("click", () => {
    const newSection = document.createElement("div");
    newSection.className = "academic-section contains";

    newSection.innerHTML = `
      <label>Level of Education:</label>
      <select name="education${academicCount}">
        <option>Select Education</option>
        <option>10th</option>
        <option>12th</option>
        <option>Diploma</option>
        <option>Graduation</option>
        <option>Post-Graduation</option>
        <option>Other</option>
      </select>

      <label>Board/University:</label>
      <select name="board-university${academicCount}">
        <option>Select Board/University</option>
        <option>CBSE</option>
        <option>ICSE</option>
        <option>MP-Board</option>
        <option>Other</option>
      </select>

      <label>School/Institute:</label>
      <input type="text" name="school-institute${academicCount}">

      <label>Passing Year:</label>
      <input type="month" name="passYear${academicCount}">

      <label>Percentage/CGPA:</label>
      <input type="number" name="percentage${academicCount}">
    `;

    academicContainer.appendChild(newSection);
    academicCount++;
  });



// multiselect form

  let options = ["JavaScript", "HTML", "CSS", "React", "Node.js", "Python", "Java", "C++"];
  const inputBox = document.getElementById("inputBox");
  const optionsList = document.getElementById("optionsList");
  const selectedItems = document.getElementById("selectedItems");

  let selected = [];

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
          updateOptions("");
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
        if (!options.includes(value)) {
          options.push(value); // Add to global options too
        }
        renderSelected();
        inputBox.value = "";
        updateOptions("");
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (!document.getElementById("multiSelect").contains(e.target)) {
      optionsList.classList.remove("active");
    }
  });

  updateOptions();