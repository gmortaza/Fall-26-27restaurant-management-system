let foods = [
  { name: "Burger", category: "Fast Food", price: 350, stock: 20, available: "yes" },
  { name: "Pizza", category: "Fast Food", price: 450, stock: 15, available: "yes" },
  { name: "Pasta", category: "Fast Food", price: 350, stock: 10, available: "yes" },
  { name: "Soft Drinks", category: "Drinks", price: 120, stock: 5, available: "yes" }
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

function showFoods() {
  let rows = "<tr><th>Food</th><th>Price</th><th>Stock</th></tr>";
  for (let i = 0; i < foods.length; i++) {
    rows += "<tr><td>" + foods[i].name + "</td><td>" + foods[i].price + "</td><td>" + foods[i].stock + "</td></tr>";
  }
  document.getElementById("food_table").innerHTML = rows;
}

function saveFood() {
  let name = document.getElementById("food_name").value.trim();
  let category = document.getElementById("category").value;
  let price = Number(document.getElementById("price").value);
  let stock = Number(document.getElementById("stock").value);
  let available = "yes";
  let isValid = true;

  let radios = document.getElementsByName("available");
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      available = radios[i].value;
    }
  }

  clearErrors(["food_name", "category", "price", "stock"]);

  if (name === "") {
    showError("food_name", "Enter a food name.");
    isValid = false;
  }
  if (category === "Select a Category") {
    showError("category", "Select a category.");
    isValid = false;
  }
  if (price <= 0) {
    showError("price", "Price must be more than 0.");
    isValid = false;
  }
  if (stock < 0) {
    showError("stock", "Stock cannot be negative.");
    isValid = false;
  }
  if (isValid === false) {
    return false;
  }

  let food = { name: name, category: category, price: price, stock: stock, available: available };
  let index = -1;
  for (let i = 0; i < foods.length; i++) {
    if (foods[i].name.toLowerCase() === name.toLowerCase()) {
      index = i;
    }
  }

  if (index === -1) {
    foods.push(food);
  } else {
    foods[index] = food;
  }

  console.log(foods);
  showFoods();
  document.getElementById("food_form").reset();
  return false;
}

window.addEventListener("load", function () {
  showFoods();
});
