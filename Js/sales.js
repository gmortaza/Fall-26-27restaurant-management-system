let prices = {
    "Burger":350, 
    "Pizza": 450, 
    "Pasta": 350, 
    "Soft Drinks": 120 
};
let sales = [
  { date: "2026-11-01", food: "Burger", sold: 2 },
  { date: "2026-11-02", food: "Pizza", sold: 2 },
  { date: "2026-11-02", food: "Burger", sold: 3 },
  { date: "2026-11-03", food: "Pizza", sold: 2 },
  { date: "2026-11-03", food: "Pasta", sold: 3 },
  { date: "2026-11-04", food: "Soft Drinks", sold: 4 }
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

function showReport(fromDate, toDate) {
  let foods = [];
  let sold = [];
  let orderCount = 0;

  for (let i = 0; i < sales.length; i++) {
    if (sales[i].date >= fromDate && sales[i].date <= toDate) {
      orderCount++;
      let index = foods.indexOf(sales[i].food);
      if (index === -1) {
        foods.push(sales[i].food);
        sold.push(sales[i].sold);
      } else {
        sold[index] += sales[i].sold;
      }
    }
  }

  let rows = "<tr><th>Food</th><th>Sold</th><th>Revenue</th></tr>";
  let total = 0;
  let best = "-";
  let bestSold = 0;

  for (let i = 0; i < foods.length; i++) {
    let revenue = sold[i] * prices[foods[i]];
    total += revenue;
    rows += "<tr><td>" + foods[i] + "</td><td>" + sold[i] + "</td><td>" + revenue + "</td></tr>";
    if (sold[i] > bestSold) {
      bestSold = sold[i];
      best = foods[i];
    }
  }

  document.getElementById("sales_table").innerHTML = rows;
  document.getElementById("total_sales").innerHTML = total + " Taka";
  document.getElementById("total_orders").innerHTML = orderCount;
  document.getElementById("best_seller").innerHTML = best;
}

function validateReport() {
  let type = document.getElementById("report_type").value;
  let from = document.getElementById("from_date").value;
  let to = document.getElementById("to_date").value;
  let isValid = true;

  clearErrors(["report_type", "to_date"]);

  if (type === "Select a Type") {
    showError("report_type", "Choose a report type.");
    isValid = false;
  }
  if (to < from) {
    showError("to_date", "To date must be after From date.");
    isValid = false;
  }
  if (isValid === false) {
    return false;
  }

  showReport(from, to);
  return false;
}
window.addEventListener("load", function () {
  showReport("", "9999-12-31");
});