let users = [
  { name: "Mortaza", email: "golammortaza@gmail.com", phone: "01795770761", address: "Uttara, Dhaka" },
  { name: "Salma", email: "salma@mail.com", phone: "01733333333", address: "Mirpur, Dhaka" },
  { name: "Arif", email: "arifmd@gmail.com", phone: "01908887812", address: "Kuril, Dhaka" },
  { name: "Akib", email: "mdakib@gmail.com", phone: "01626178312", address: "Kuril, Dhaka" }
];

function showError(id, message) {
  let span = document.getElementById(id + "_error");
  if (span === null) {
    span = document.createElement("span");
    span.id = id + "_error";
    span.style.color = "red";
    document.getElementById(id).parentNode.appendChild(span);
  }
  span.innerHTML = message;
}

function showUsers(list) {
  let rows = "<tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th></tr>";
  for (let i = 0; i < list.length; i++) {
    rows += "<tr><td>" + list[i].name + "</td><td>" + list[i].email + "</td><td>" +
            list[i].phone + "</td><td>" + list[i].address + "</td></tr>";
  }
  document.getElementById("users_table").innerHTML = rows;
}

function searchUsers() {
  let searchBy = document.getElementById("search_by").value;
  let text = document.getElementById("search_text").value.trim().toLowerCase();
  let isValid = true;

  let oldError = document.getElementById("search_by_error");
  if (oldError !== null) {
    oldError.innerHTML = "";
  }

  if (searchBy === "Select an Option") {
    showError("search_by", "Choose an option.");
    isValid = false;
  }
  if (isValid === false) {
    return false;
  }

  let result = [];
  for (let i = 0; i < users.length; i++) {
    let value = "";
    switch (searchBy) {
      case "Name":
        value = users[i].name;
        break;
      case "Email":
        value = users[i].email;
        break;
      case "Phone":
        value = users[i].phone;
        break;
    }
    if (value.toLowerCase().indexOf(text) !== -1) {
      result.push(users[i]);
    }
  }
  console.log(result);
  showUsers(result);
  return false;
}
window.addEventListener("load", function () {
  showUsers(users);
});