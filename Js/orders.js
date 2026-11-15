let orders = [
  { id: 101, customer: "Akib", food: "Burger", quantity: 3, total: 350, payment: "Cash On Delivery", status: "Pending", date: "2026-11-01" },
  { id: 102, customer: "Arif", food: "Pizza", quantity: 2, total: 450, payment: "Bkash", status: "Delivered", date: "2026-11-02" },
  { id: 103, customer: "Salma", food: "Pasta", quantity: 2, total: 450, payment: "Bkash", status: "Preparing", date: "2026-11-03" },
  { id: 104, customer: "Mortaza", food: "Soft Drinks", quantity: 2, total: 150, payment: "Cash On Delivery", status: "Ready", date: "2026-11-04" },
  { id: 105, customer: "Nusu", food: "Wings", quantity: 2, total: 220, payment: "Nagad", status: "On the way", date: "2026-11-05" }
];

function showOrders(list) {
  let rows = "<tr><th>ID</th><th>Customer</th><th>Food</th><th>Quantity</th><th>Total</th><th>Payment</th><th>Status</th></tr>";
  for (const o of list) {
    rows += "<tr><td>" + o.id + "</td><td>" + o.customer + "</td><td>" + o.food + "</td><td>" +
            o.quantity + "</td><td>" + o.total + "</td><td>" + o.payment + "</td><td>" + o.status + "</td></tr>";
  }
  document.getElementById("orders_table").innerHTML = rows;
}

function filterOrders() {
  let status = document.getElementById("status").value;
  let date = document.getElementById("order_date").value;

  let payment = "";
  let radios = document.getElementsByName("payment");
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      switch (radios[i].value) {
        case "cod":
          payment = "Cash On Delivery";
          break;
        case "bkash":
          payment = "Bkash";
          break;
        case "nagad":
          payment = "Nagad";
          break;
      }
    }
  }

  let result = [];
  for (let i = 0; i < orders.length; i++) {
    let statusOk = status === "Select a Status" || orders[i].status === status;
    let paymentOk = payment === "" || orders[i].payment === payment;
    let dateOk = date === "" || orders[i].date === date;
    if (statusOk && paymentOk && dateOk) {
      result.push(orders[i]);
    }
  }

  console.log(result);
  showOrders(result);
  return false;
}
window.addEventListener("load", function () {
  showOrders(orders);
});