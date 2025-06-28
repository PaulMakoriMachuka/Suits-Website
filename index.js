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

// Handle form submission (POST)
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

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
    .then(res => res.json())
    .then(data => {
      renderCard(data);
      form.reset();
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
    <button class="btn btn-danger btn-sm delete-btn">Delete</button>
  `;

  div.querySelector('.delete-btn').addEventListener('click', () => deleteEntry(data.id, div));
  cont.appendChild(div);
}

// Delete entry
function deleteEntry(id, cardElement) {
  if (!confirm("Are you sure you want to delete this entry?")) return;

  fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (res.ok) {
        cardElement.remove();
      } else {
        alert("Failed to delete. Try again.");
      }
    });
}

// Optional: Load existing entries on page load
window.addEventListener('DOMContentLoaded', () => {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => data.forEach(renderCard));
});