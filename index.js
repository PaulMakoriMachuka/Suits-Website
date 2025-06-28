// let apiEndpoint ="http://localhost:3000/submissions"
// let form = document.querySelector("form");
// let button = document.getElementById("button");
// let emailInput = form.querySelector('input[type="email"]');

// //  form.addEventListener("submit", (e) => {
// //   e.preventDefault(); // Stop page from reloading
// // fetch(`http://localhost:3000/submissions`)
// // .then(res => res.json())
// // .then(posts => )

// //   console.log("Form submitted with:", emailInput.value);

// //    // Clear the input
// //    emailInput.value = "";

// //    // Show feedback on button
// //   button.textContent = "Submitted!";
// //    button.disabled = true;

// //    setTimeout(() => {
// //      button.textContent = "Submit";
// //     button.disabled = false;
// //    } );
// //  });



// const submitButton = form.querySelector('button[type="submit"]');

// form.addEventListener("submit", (e) => {
//   e.preventDefault(); // Prevent full page reload

//   // Collect form data
//   const formData = {
//     email: form.email.value,
//     firstName: form.firstName.value,
//     lastName: form.lastName.value,
//     message: form.message.value,
//     measurements: Array.from(form.querySelectorAll('input[type="number"]')).map(input => input.value)
//   };

//   console.log("Form Data:", formData);

//   // Reset all inputs and textarea
//   form.reset();

//   // Show feedback
//   submitButton.textContent = "Submitted!";
//   submitButton.disabled = true;

//   setTimeout(() => {
//     submitButton.textContent = "Submit";
//     submitButton.disabled = false;
//   });
// });


const form = document.getElementById("form");
const cont = document.getElementById("cont");
const API_URL = "http://localhost:3000/submissions"; // JSON Server
 
let selectedId = null;

// Handle form submission
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = {
    email: form.email.value,
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    message: form.message.value,
    measurements: {
      height: {
        feet: getValue("Feet"),
        inches: getValue("Inches", 1)
      },
      weight: getValue("Pounds"),
      chest: getValueByLabel("Chest (in)"),
      naturalWaist: getValueByLabel("Natural Waist (in)"),
      bicep: getValueByLabel("Bicep (in)"),
      pantWaist: getValueByLabel("Pant Waist (in)"),
      hip: getValueByLabel("Hip (in)"),
      inseam: getValueByLabel("Inseam (in)"),
      neck: getValueByLabel("Neck (in)")
    }
  };

  const method = selectedId ? 'PATCH' : 'POST';
  const url = selectedId ? `${API_URL}/${selectedId}` : API_URL;

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
    .then(res => res.json())
    .then(data => {
      if (method === 'POST') {
        renderCard(data);
      } else {
        updateCard(data);
      }
      form.reset();
      selectedId = null;
    });
});

// Helpers to get input values
function getValue(placeholder, index = 0) {
  return form.querySelectorAll(`input[placeholder="${placeholder}"]`)[index]?.valueAsNumber || null;
}
function getValueByLabel(label) {
  return Array.from(form.querySelectorAll('label'))
    .find(el => el.textContent.includes(label))
    ?.nextElementSibling?.valueAsNumber || null;
}

// Render a new card
function renderCard(data) {
  const div = document.createElement('div');
  div.className = 'card p-3 mb-3';
  div.dataset.id = data.id;

  div.innerHTML = `
    <h5>${data.firstName} ${data.lastName}</h5>
    <p><strong>Email:</strong> ${data.email}</p>
    <p>${data.message}</p>
    <button class="btn btn-warning btn-sm edit-btn">Edit</button>
  `;

  div.querySelector('.edit-btn').addEventListener('click', () => loadForEdit(data));
  cont.appendChild(div);
}

// Update existing card after PATCH
function updateCard(data) {
  const card = cont.querySelector(`.card[data-id="${data.id}"]`);
  if (card) {
    card.querySelector('h5').textContent = `${data.firstName} ${data.lastName}`;
    card.querySelector('p').textContent = data.message;
  }
}

// Load data into form for editing
function loadForEdit(data) {
  form.email.value = data.email;
  form.firstName.value = data.firstName;
  form.lastName.value = data.lastName;
  form.message.value = data.message;

  form.querySelectorAll(`input[placeholder="Feet"]`)[0].value = data.measurements?.height?.feet || '';
  form.querySelectorAll(`input[placeholder="Inches"]`)[0].value = data.measurements?.height?.inches || '';
  form.querySelector(`input[placeholder="Pounds"]`).value = data.measurements?.weight || '';

  // Set other measurement fields
  setValueByLabel("Chest (in)", data.measurements?.chest);
  setValueByLabel("Natural Waist (in)", data.measurements?.naturalWaist);
  setValueByLabel("Bicep (in)", data.measurements?.bicep);
  setValueByLabel("Pant Waist (in)", data.measurements?.pantWaist);
  setValueByLabel("Hip (in)", data.measurements?.hip);
  setValueByLabel("Inseam (in)", data.measurements?.inseam);
  setValueByLabel("Neck (in)", data.measurements?.neck);

  selectedId = data.id;
}

function setValueByLabel(label, value) {
  const input = Array.from(form.querySelectorAll('label'))
    .find(el => el.textContent.includes(label))
    ?.nextElementSibling;
  if (input && value !== undefined) input.value = value;
}

// Optional: Load existing records on page load
window.addEventListener('DOMContentLoaded', () => {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => data.forEach(renderCard));
});