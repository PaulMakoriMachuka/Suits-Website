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





// On page load: fetch and display all records
window.addEventListener('DOMContentLoaded', () => {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => data.forEach(renderCard));
});

// Handle form submit (POST or PATCH)
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
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
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(record => {
      if (method === 'POST') {
        renderCard(record);
      } else {
        updateCard(record);
      }
      form.reset();
      selectedId = null;
    });
});

// Helpers
function getValue(placeholder, index = 0) {
  return form.querySelectorAll(`input[placeholder="${placeholder}"]`)[index]?.valueAsNumber || null;
}
function getValueByLabel(label) {
  return Array.from(form.querySelectorAll('label'))
    .find(el => el.textContent.includes(label))
    ?.nextElementSibling?.valueAsNumber || null;
}

// Render individual card
function renderCard(data) {
  const card = document.createElement('div');
  card.className = 'card p-3 mb-3';
  card.dataset.id = data.id;

  card.innerHTML = `
    <h5>${data.firstName} ${data.lastName}</h5>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Message:</strong> ${data.message}</p>
    <p><strong>Measurements:</strong></p>
    <ul class="ms-3">
      <li><strong>Height:</strong> ${data.measurements.height.feet || '—'} ft ${data.measurements.height.inches || '—'} in</li>
      <li><strong>Weight:</strong> ${data.measurements.weight || '—'} lbs</li>
      <li><strong>Chest:</strong> ${data.measurements.chest || '—'} in</li>
      <li><strong>Waist (Natural):</strong> ${data.measurements.naturalWaist || '—'} in</li>
      <li><strong>Bicep:</strong> ${data.measurements.bicep || '—'} in</li>
      <li><strong>Pant Waist:</strong> ${data.measurements.pantWaist || '—'} in</li>
      <li><strong>Hip:</strong> ${data.measurements.hip || '—'} in</li>
      <li><strong>Inseam:</strong> ${data.measurements.inseam || '—'} in</li>
      <li><strong>Neck:</strong> ${data.measurements.neck || '—'} in</li>
    </ul>
    <div class="mt-2">
      <button class="btn btn-sm btn-warning me-2">Edit</button>
      <button class="btn btn-sm btn-danger">Delete</button>
    </div>
  `;

  // Edit
  card.querySelector('.btn-warning').addEventListener('click', () => {
    form.email.value = data.email;
    form.firstName.value = data.firstName;
    form.lastName.value = data.lastName;
    form.message.value = data.message;

    setValue("Feet", data.measurements.height.feet);
    setValue("Inches", data.measurements.height.inches, 1);
    setValue("Pounds", data.measurements.weight);
    setByLabel("Chest (in)", data.measurements.chest);
    setByLabel("Natural Waist (in)", data.measurements.naturalWaist);
    setByLabel("Bicep (in)", data.measurements.bicep);
    setByLabel("Pant Waist (in)", data.measurements.pantWaist);
    setByLabel("Hip (in)", data.measurements.hip);
    setByLabel("Inseam (in)", data.measurements.inseam);
    setByLabel("Neck (in)", data.measurements.neck);

    selectedId = data.id;
  });

  // Delete
  card.querySelector('.btn-danger').addEventListener('click', () => {
    if (confirm('Delete this entry?')) {
      fetch(`${API_URL}/${data.id}`, { method: 'DELETE' })
        .then(() => card.remove());
    }
  });

  cont.appendChild(card);
}

// Patch: update the existing card
function updateCard(data) {
  const oldCard = cont.querySelector(`.card[data-id="${data.id}"]`);
  if (oldCard) {
    oldCard.remove(); // Remove the old version
    renderCard(data); // Add updated version
  }
}

// Helpers to set form values
function setValue(placeholder, value, index = 0) {
  const input = form.querySelectorAll(`input[placeholder="${placeholder}"]`)[index];
  if (input) input.value = value || '';
}
function setByLabel(label, value) {
  const input = Array.from(form.querySelectorAll('label'))
    .find(el => el.textContent.includes(label))
    ?.nextElementSibling;
  if (input) input.value = value || '';
}