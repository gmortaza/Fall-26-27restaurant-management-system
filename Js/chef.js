let orders = [
  { id: 101, customer: "Akib", food: "Burger", quantity: 3, status: "Pending", date: "2026-11-01" },
  { id: 103, customer: "Salma", food: "Pasta", quantity: 2, status: "Preparing", date: "2026-11-03" },
  { id: 104, customer: "Mortaza", food: "Soft Drinks", quantity: 2, status: "Ready", date: "2026-11-04" }
];

let foods = [
  { name: "Burger", stock: 20, available: "yes" },
  { name: "Pizza", stock: 15, available: "yes" },
  { name: "Pasta", stock: 10, available: "yes" },
  { name: "Soft Drinks", stock: 5, available: "yes" }
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

function getSelectedRadio(groupName) {
  let radios = document.getElementsByName(groupName);
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
  return "";
}

function mark(value, current, word) {
  if (value === current) {
    return " " + word;
  }
  return "";
}

function availText(available) {
  if (available === "yes") {
    return "Available";
  }
  return "Out of stock";
}

// chef.html + chef-orders.html

function showOrders(list) {
  let rows = "";
  for (let i = 0; i < list.length; i++) {
    let o = list[i];
    rows += "<tr><td>" + o.id + "</td><td>" + o.customer + "</td><td>" + o.food + "</td><td>" + o.quantity + "</td><td>" + o.status + "</td>";
    rows += "<td><select id=\"status" + o.id + "\">";
    rows += "<option" + mark("Pending", o.status, "selected") + ">Pending</option>";
    rows += "<option" + mark("Preparing", o.status, "selected") + ">Preparing</option>";
    rows += "<option" + mark("Ready", o.status, "selected") + ">Ready</option>";
    rows += "</select> <input type=\"button\" value=\"Update\" onclick=\"updateStatus(" + o.id + ")\"></td></tr>";
  }
  if (rows === "") {
    rows = "<tr><td colspan=\"6\">No orders found.</td></tr>";
  }
  document.getElementById("ordersBody").innerHTML = rows;
}

function filterOrders() {
  let status = document.getElementById("status").value;
  let date = document.getElementById("order_date").value;

  let result = [];
  for (let i = 0; i < orders.length; i++) {
    let statusOk = status === "Select a Status" || orders[i].status === status;
    let dateOk = date === "" || orders[i].date === date;
    if (statusOk && dateOk) {
      result.push(orders[i]);
    }
  }

  showOrders(result);
  return false;
}

function updateStatus(id) {
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].id === id) {
      orders[i].status = document.getElementById("status" + id).value;
    }
  }
  filterOrders();
  showCounts();
}

function showCounts() {
  if (document.getElementById("pendingCount") === null) {
    return;
  }
  let pending = 0;
  let preparing = 0;
  let ready = 0;
  for (let i = 0; i < orders.length; i++) {
    if (orders[i].status === "Pending") {
      pending++;
    } else if (orders[i].status === "Preparing") {
      preparing++;
    } else {
      ready++;
    }
  }
  document.getElementById("pendingCount").innerHTML = pending;
  document.getElementById("preparingCount").innerHTML = preparing;
  document.getElementById("readyCount").innerHTML = ready;
}

// chef.html food stock table

function showStock() {
  let rows = "";
  for (let i = 0; i < foods.length; i++) {
    let f = foods[i];
    rows += "<tr><td>" + f.name + "</td><td>" + f.stock + "</td><td>" + availText(f.available) + "</td><td>";
    rows += "<input type=\"radio\" id=\"yes" + i + "\" name=\"available" + i + "\" value=\"yes\"" + mark("yes", f.available, "checked") + ">";
    rows += "<label for=\"yes" + i + "\">Available</label> ";
    rows += "<input type=\"radio\" id=\"no" + i + "\" name=\"available" + i + "\" value=\"no\"" + mark("no", f.available, "checked") + ">";
    rows += "<label for=\"no" + i + "\">Out of stock</label> ";
    rows += "<input type=\"button\" value=\"Save\" onclick=\"saveAvailability(" + i + ")\"></td></tr>";
  }
  document.getElementById("stockBody").innerHTML = rows;
}

function saveAvailability(index) {
  foods[index].available = getSelectedRadio("available" + index);
  showStock();
}

// chef_stock.html

function showFoodStock() {
  let rows = "";
  for (let i = 0; i < foods.length; i++) {
    rows += "<tr><td>" + foods[i].name + "</td><td>" + foods[i].stock + "</td></tr>";
  }
  document.getElementById("foodBody").innerHTML = rows;
}

function saveStock() {
  let name = document.getElementById("food_name").value;
  let stock = Number(document.getElementById("stock").value);
  let available = getSelectedRadio("available");
  let isValid = true;

  clearErrors(["food_name", "stock"]);

  if (name === "Select a Food") {
    showError("food_name", "Select a food.");
    isValid = false;
  }
  if (stock < 0) {
    showError("stock", "Stock cannot be negative.");
    isValid = false;
  }
  if (isValid === false) {
    return false;
  }

  for (let i = 0; i < foods.length; i++) {
    if (foods[i].name === name) {
      foods[i].stock = stock;
      foods[i].available = available;
    }
  }

  showFoodStock();
  document.getElementById("stock_form").reset();
  return false;
}

window.addEventListener("load", function () {
  if (document.getElementById("ordersBody") !== null) {
    showOrders(orders);
    showCounts();
  }
  if (document.getElementById("stockBody") !== null) {
    showStock();
  }
  if (document.getElementById("foodBody") !== null) {
    showFoodStock();
  }
});
