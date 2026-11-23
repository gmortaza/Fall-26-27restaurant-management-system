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


function checkFilter() {
  let status = document.getElementById("status").value;
  let date = document.getElementById("order_date").value;
  let isValid = true;

  clearErrors(["status", "order_date"]);

  if (status === "Select a Status" && date === "") {
    showError("status", "Please select a status or a date.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }
  return true;
}

// chef_stock.html (Update Food Stock)
function checkStock() {
  let food = document.getElementById("food_name").value;
  let stock = document.getElementById("stock").value;
  let isValid = true;

  clearErrors(["food_name", "stock"]);

  if (food === "Select a Food") {
    showError("food_name", "Please select a food.");
    isValid = false;
  }

  if (stock === "") {
    showError("stock", "Please enter the stock.");
    isValid = false;
  } else if (Number(stock) < 0 || Number(stock) > 1000) {
    showError("stock", "Stock must be between 0 and 1000.");
    isValid = false;
  } else if (Number(stock) !== Math.floor(Number(stock))) {
    showError("stock", "Stock must be a whole number.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }
  return true;
}
