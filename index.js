const form = document.getElementById("form");
const write = document.getElementById("write") || createContainer();
const tallma = document.getElementById("tallma")
const API_URL = "http://localhost:3000/submissions";

let selectedId = null;

// Load records on page load
window.addEventListener("DOMContentLoaded", () => {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => data.forEach(renderCard));
});

// Submit form (POST or PATCH)
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = getFormData();
  const method = selectedId ? "PATCH" : "POST";
  const url = selectedId ? `${API_URL}/${selectedId}` : API_URL;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(record => {
      if (selectedId) {
        document.querySelector(`[data-id="${selectedId}"]`)?.remove();
        selectedId = null;
      }
      renderCard(record);
      form.reset();
      alert(`Your order ${method === 'POST' ? 'is' : 'updated'} successfully!`);
    });
});

// Extract form data
function getFormData() {
  return {
    email: form.email.value,
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    message: form.message.value,
    measurements: {
      height: {
        feet: getInput("Feet"),
        inches: getInput("Inches", 1)
      },
      weight: getInput("Pounds"),
      chest: getByLabel("Chest (in)"),
      naturalWaist: getByLabel("Natural Waist (in)"),
      bicep: getByLabel("Bicep (in)"),
      pantWaist: getByLabel("Pant Waist (in)"),
      hip: getByLabel("Hip (in)"),
      inseam: getByLabel("Inseam (in)"),
      neck: getByLabel("Neck (in)")
    }
  };
}

// Render one card
function renderCard(data) {
  const card = document.createElement("div");
  card.className = "card p-3 mb-3";
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
      <li><strong>Waist:</strong> ${data.measurements.naturalWaist || '—'} in</li>
      <li><strong>Bicep:</strong> ${data.measurements.bicep || '—'} in</li>
      <li><strong>Pant Waist:</strong> ${data.measurements.pantWaist || '—'} in</li>
      <li><strong>Hip:</strong> ${data.measurements.hip || '—'} in</li>
      <li><strong>Inseam:</strong> ${data.measurements.inseam || '—'} in</li>
      <li><strong>Neck:</strong> ${data.measurements.neck || '—'} in</li>
    </ul>
    <div class="mt-2 d-flex gap-2">
      <button class="btn btn-sm btn-danger">Delete</button>
    </div>
  `;

  // Delete button
  card.querySelector(".btn-danger").addEventListener("click", () => {
    if (confirm("Delete this entry?")) {
      fetch(`${API_URL}/${data.id}`, { method: "DELETE" })
        .then(() => card.remove());
    }
  });

  write.appendChild(card);
}

// Fill form for editing (if needed)
function fillForm(data) {
  form.email.value = data.email;
  form.firstName.value = data.firstName;
  form.lastName.value = data.lastName;
  form.message.value = data.message;

  setInput("Feet", data.measurements.height.feet);
  setInput("Inches", data.measurements.height.inches, 1);
  setInput("Pounds", data.measurements.weight);
  setByLabel("Chest (in)", data.measurements.chest);
  setByLabel("Natural Waist (in)", data.measurements.naturalWaist);
  setByLabel("Bicep (in)", data.measurements.bicep);
  setByLabel("Pant Waist (in)", data.measurements.pantWaist);
  setByLabel("Hip (in)", data.measurements.hip);
  setByLabel("Inseam (in)", data.measurements.inseam);
  setByLabel("Neck (in)", data.measurements.neck);
}

// Utility: get input by placeholder
function getInput(placeholder, index = 0) {
  return form.querySelectorAll(`input[placeholder="${placeholder}"]`)[index]?.valueAsNumber || null;
}

// Utility: set input values
function setInput(placeholder, value, index = 0) {
  const input = form.querySelectorAll(`input[placeholder="${placeholder}"]`)[index];
  if (input) input.value = value ?? '';
}

// Get value by matching label text
function getByLabel(labelText) {
  const label = Array.from(form.querySelectorAll('label'))
    .find(l => l.textContent.includes(labelText));
  return label?.nextElementSibling?.valueAsNumber || null;
}

// Set value by matching label text
function setByLabel(labelText, value) {
  const label = Array.from(form.querySelectorAll('label'))
    .find(l => l.textContent.includes(labelText));
  if (label?.nextElementSibling) {
    label.nextElementSibling.value = value ?? '';
  }
}

// Create container if not present
function createContainer() {
  const div = document.createElement("div");
  div.id = "write";
  div.className = "container mt-5";
  tallma.appendChild(div);
  return div;
}