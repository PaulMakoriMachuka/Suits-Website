let button = document.getElementById("button");

button.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("submit");
  location.reload();
});



let form = document.getElementById("form")

form.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("submit");
    location.reload();
  });
