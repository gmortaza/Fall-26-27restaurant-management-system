// chef.js - chef.html, chef-orders.html, chef_stock.html
let dates = { 101: "2026-11-01", 103: "2026-11-03", 104: "2026-11-04" };

// find a data-table by the text of its first header cell
function table(first) {
  let t = document.getElementsByClassName("data-table");
  for (let i = 0; i < t.length; i++) {
    if (t[i].rows[0].cells[0].textContent === first) return t[i];
  }
}

// dashboard summary: count Pending / Preparing / Ready
function showCounts() {
  let t = table("ID");
  let s = document.getElementsByClassName("summary-table")[0];
  if (!t || !s) return;
  let names = ["Pending", "Preparing", "Ready"];
  let n = [0, 0, 0];
  for (let i = 1; i < t.rows.length; i++) {
    let k = names.indexOf(t.rows[i].cells[4].textContent);
    if (k >= 0) n[k]++;
  }
  for (let i = 0; i < 3; i++) s.rows[i].cells[1].textContent = n[i];
}

function filterOrders(f) {
  let t = table("ID");
  let status = f.elements.status.value;
  let date = f.elements.order_date.value;
  for (let i = 1; i < t.rows.length; i++) {
    let c = t.rows[i].cells;
    let statusOk = status === "Select a Status" || c[4].textContent === status;
    let dateOk = date === "" || dates[c[0].textContent] === date;
    t.rows[i].style.display = statusOk && dateOk ? "" : "none";
  }
}

function saveStock(x) {
  if (x.food_name.value === "Select a Food") {
    alert("Please select a food");
    return;
  }
  if (x.stock.value < 0) {
    alert("Stock cannot be negative");
    return;
  }
  let t = table("Food");
  for (let i = 1; i < t.rows.length; i++) {
    if (t.rows[i].cells[0].textContent === x.food_name.value) {
      t.rows[i].cells[1].textContent = x.stock.value + (x.available.value === "no" ? " (Out of stock)" : "");
    }
  }
}

document.addEventListener("submit", function (e) {
  e.preventDefault();
  let f = e.target;
  let x = f.elements;
  if (x.status) {
    filterOrders(f);
  } else if (x.new_status) {
    f.closest("tr").cells[4].textContent = x.new_status.value;
    showCounts();
  } else if (x.food) {
    f.closest("tr").cells[2].textContent = x.available.value === "yes" ? "Available" : "Out of stock";
  } else if (x.food_name) {
    saveStock(x);
  }
});

document.addEventListener("reset", function (e) {
  if (e.target.elements.status) {
    setTimeout(function () { filterOrders(e.target); }, 0);
  }
});

window.addEventListener("load", showCounts);
