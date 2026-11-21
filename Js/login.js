let users = [
  { name: "Admin", email: "admin@restaurant.com", password: "admin1234", role: "Admin", status: "Active" },
  { name: "Customer", email: "customer@restaurant.com", password: "customer123", role: "Customer", status: "Active" },
  { name: "Chef", email: "chef@restaurant.com", password: "chef123", role: "chefs", status: "Active" },
  { name: "Delivery", email: "delivery@restaurant.com", password: "delivery123", role: "Delivery Man", status: "Active" }
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
function clearErrors(ids) {
  for (const id of ids) {
    let span = document.getElementById(id + "_error");
    if (span !== null) {
      span.innerHTML = "";
    }
  }
}
function validateLogin() {
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;
  let type = document.getElementById("user_type").value;
  let isValid = true;

  clearErrors(["email", "password", "user_type"]);

  if (email === "") {
    showError("email", "Please enter your email.");
    isValid = false;
  }
  if (password === "") {
    showError("password", "Please enter your password.");
    isValid = false;
  } else if (password.length < 6) {
    showError("password", "Password must be at least 6 characters.");
    isValid = false;
  }
  if (type === "") {
    showError("user_type", "Please select a user type.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }
  let foundUser = null;
  for (const user of users) {
    if (user.email.toLowerCase() === email.toLowerCase() && user.role === type) {
      foundUser = user;
    }
  }
  if (foundUser === null || foundUser.password !== password) {
    showError("password", "Wrong email, password or user type.");
    return false;
  }
  if (foundUser.status === "Pending") {
    alert("Your account is waiting for admin approval.");
    return false;
  }
  if (foundUser.status === "Blocked") {
    alert("This account is blocked.");
    return false;
  }
  let form = document.getElementById("login");
  switch (foundUser.role) {
    case "Admin":
      form.action = "admin/users.html";
      break;
    case "Customer":
      form.action = "customer.html";
      break;
    case "chefs":
      form.action = "index.html";
      break;
    case "Delivery Man":
      form.action = "deliveryman.html";
      break;
  }

  console.log("Login OK: " + foundUser.name + " (" + foundUser.role + ") -> " + form.action);
  return true;
}
function fillDemo(button) {
  document.getElementById("user_type").value = button.getAttribute("data-type");
  document.getElementById("email").value = button.getAttribute("data-email");
  document.getElementById("password").value = button.getAttribute("data-password");
  clearErrors(["email", "password", "user_type"]);
}

function showForm(name) {
  let ids = ["login", "signup", "forgot"];
  for (let i = 0; i < ids.length; i++) {
    if (ids[i] === name) {
      document.getElementById(ids[i]).style.display = "block";
    } else {
      document.getElementById(ids[i]).style.display = "none";
    }
  }
  if (name === "login") {
    document.getElementById("credentials").style.display = "block";
  } else {
    document.getElementById("credentials").style.display = "none";
  }
}
function checkSignup() {
  let name = document.getElementById("full_name").value.trim();
  let email = document.getElementById("new_email").value.trim();
  let password = document.getElementById("new_password").value;
  let phone = document.getElementById("phone").value.trim();

  if (name !== "" && email !== "" && password !== "" && phone !== "") {
    document.getElementById("register").disabled = false;
  } else {
    document.getElementById("register").disabled = true;
  }
}
function validateSignup() {
  let name = document.getElementById("full_name").value.trim();
  let email = document.getElementById("new_email").value.trim();
  let password = document.getElementById("new_password").value;
  let phone = document.getElementById("phone").value.trim();
  let isValid = true;

  clearErrors(["full_name", "new_email", "new_password", "phone"]);

  if (name.length < 3) {
    showError("full_name", "Name must be at least 3 characters.");
    isValid = false;
  }
  if (email.indexOf("@") === -1) {
    showError("new_email", "Enter a valid email.");
    isValid = false;
  } else {
    for (const user of users) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        showError("new_email", "This email is already registered.");
        isValid = false;
      }
    }
  }

  if (password.length < 6) {
    showError("new_password", "Password must be at least 6 characters.");
    isValid = false;
  }
  if (phone.length !== 11) {
    showError("phone", "Phone must be 11 digits.");
    isValid = false;
  }
  if (isValid === false) {
    return false;
  }

  users.push({ name: name, email: email, password: password, role: "Customer", status: "Active" });
  console.log(users);
  alert("Account created. Please login.");
  document.getElementById("signup").reset();
  showForm("login");
  return false;
}
function validateForgot() {
  let email = document.getElementById("forgot_email").value.trim();
  let found = false;

  clearErrors(["forgot_email"]);

  for (const user of users) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      found = true;
    }
  }
  if (found === false) {
    showError("forgot_email", "No account found with this email.");
    return false;
  }
  alert("Reset link sent to " + email);
  showForm("login");
  return false;
}
window.addEventListener("load", function () {
  showForm("login");
  checkSignup();
});