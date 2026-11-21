

// ---------- Restaurant rules (the admin can change these later) ----------
let restaurantRules = {
    vatPercent: 5,
    deliveryCharge: 30,
    seatLimit: 20,
    maxQty: 20
};


let menuItems = [
    { id: "M-001", name: "Margherita Pizza", price: 350, category: "Pizza", image: "pizza.png", description: "Tomato sauce, mozzarella and fresh basil" },
    { id: "M-002", name: "Pepperoni Pizza", price: 450, category: "Pizza", image: "pizza.png", description: "Spicy pepperoni with extra cheese" },
    { id: "M-003", name: "Alfredo Pasta", price: 280, category: "Pasta", image: "pasta.png", description: "Creamy white sauce with herbs" },
    { id: "M-004", name: "Classic Beef Burger", price: 220, category: "Burger", image: "burger.png", description: "Beef patty, lettuce, tomato and sauce" },
    { id: "M-005", name: "Cheese Chicken Burger", price: 200, category: "Burger", image: "burger.png", description: "Crispy chicken with melted cheese" },
    { id: "M-006", name: "Cold Coffee", price: 120, category: "Drinks", image: "drinks.png", description: "Chilled coffee with ice cream" },
    { id: "M-007", name: "Soft Drinks", price: 50, category: "Drinks", image: "drinks.png", description: "Chilled soft drink (250 ml)" }
];


let orders = [

    { id: "O-001", customerId: "U-003", itemId: "M-001", itemName: "Margherita Pizza", qty: 1, type: "Delivery", address: "House 12, Road 5, Bashundhara R/A, Dhaka", phone: "01841464801", payment: "bKash", note: "", total: 398, date: "2026-11-17", status: "Delivered" },
    { id: "O-002", customerId: "U-003", itemId: "M-003", itemName: "Alfredo Pasta", qty: 2, type: "Pickup", address: "-", phone: "01841464801", payment: "Cash", note: "", total: 588, date: "2026-11-18", status: "Preparing" }
];


let reservations = [

];


function showSection(id) {
    const sections = document.getElementsByClassName("section");
    for (let i = 0; i < sections.length; i++) {
        sections[i].style.display = "none";
    }
    document.getElementById(id).style.display = "block";
}


function showError(id, message) {
    const element = document.getElementById(id);
    element.innerHTML = message;
    element.style.color = "red";
}

function clearError(id) {
    document.getElementById(id).innerHTML = "";
}

function clearErrors(idList) {
    for (let i = 0; i < idList.length; i++) {
        clearError(idList[i]);
    }
}

function showMessage(id, message, color) {
    const element = document.getElementById(id);
    element.innerHTML = message;
    element.style.color = color;
}


function containsText(text, search) {
    return text.toLowerCase().indexOf(search.toLowerCase()) !== -1;
}


function removeAt(array, index) {
    return array.slice(0, index).concat(array.slice(index + 1));
}


function isValidPhone(phone) {
    if (phone.length !== 11) {
        return false;
    }
    if (phone.charAt(0) !== "0" || phone.charAt(1) !== "1") {
        return false;
    }
    for (let i = 0; i < phone.length; i++) {
        if (phone.charAt(i) < "0" || phone.charAt(i) > "9") {
            return false;
        }
    }
    return true;
}

function escapeHtml(text) {
    let result = String(text);
    result = result.split("&").join("&amp;");
    result = result.split("<").join("&lt;");
    result = result.split(">").join("&gt;");
    result = result.split('"').join("&quot;");
    return result;
}


function makeId(prefix, number) {
    let digits = String(number);
    while (digits.length < 3) {
        digits = "0" + digits;
    }
    return prefix + digits;
}


function formatDate(dateObject) {
    let month = dateObject.getMonth() + 1;
    let day = dateObject.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    return dateObject.getFullYear() + "-" + month + "-" + day;
}

function todayString() {
    return formatDate(new Date());
}

function addDays(dateText, days) {
    const parts = dateText.split("-");
    const result = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]) + days);
    return formatDate(result);
}


function daysBetween(fromText, toText) {
    const a = fromText.split("-");
    const b = toText.split("-");
    const from = new Date(parseInt(a[0]), parseInt(a[1]) - 1, parseInt(a[2]));
    const to = new Date(parseInt(b[0]), parseInt(b[1]) - 1, parseInt(b[2]));
    return Math.round((to - from) / (1000 * 60 * 60 * 24));
}


//Customer dashboard
const currentCustomerId = "U-003";


const customerProfile = {
    id: "U-003",
    fullName: "Nirjora",
    phone: "01841464801",
    address: "House 12, Road 5, Bashundhara R/A, Dhaka"
};

const trackSteps = ["Pending", "Confirmed", "Preparing", "On the way", "Delivered"];

let editIndex = -1;          // -1 = creating a new order, otherwise index of the order being edited
let currentCategory = "All"; // category selected in the menu

let orderCounter = orders.length + 1;
let reservationCounter = reservations.length + 1;



function getMenuItem(id) {
    for (let i = 0; i < menuItems.length; i++) {
        if (menuItems[i].id === id) {
            return menuItems[i];
        }
    }
    return null;
}

function getCurrentCustomer() {
    return customerProfile;
}

function getRadioValue(name) {
    const radios = document.getElementsByName(name);
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return "";
}

function setRadioValue(name, value) {
    const radios = document.getElementsByName(name);
    for (let i = 0; i < radios.length; i++) {
        radios[i].checked = (radios[i].value === value);
    }
}


function calcOrderTotal(price, qty, type) {
    const subTotal = price * qty;
    const vat = Math.round(subTotal * restaurantRules.vatPercent / 100);
    let delivery = 0;
    if (type === "Delivery") {
        delivery = restaurantRules.deliveryCharge;
    }
    return subTotal + vat + delivery;
}

function statusColor(status) {
    switch (status) {
        case "Pending":
            return "orange";
        case "Confirmed":
            return "royalblue";
        case "Preparing":
            return "purple";
        case "On the way":
            return "teal";
        case "Delivered":
            return "green";
        default:
            return "gray";
    }
}

function fillMenuDropdown(selectId) {
    const select = document.getElementById(selectId);
    select.innerHTML = "";

    const first = document.createElement("option");
    first.value = "";
    first.text = "-- Select an item --";
    select.appendChild(first);

    for (let i = 0; i < menuItems.length; i++) {
        const option = document.createElement("option");
        option.value = menuItems[i].id;
        option.text = menuItems[i].name + " (" + menuItems[i].category + ") - " + menuItems[i].price + " Tk";
        select.appendChild(option);
    }
}

function updateSummary() {
    const customer = getCurrentCustomer();
    let total = 0;
    let pending = 0;

    for (let i = 0; i < orders.length; i++) {
        if (orders[i].customerId === currentCustomerId) {
            total++;
            if (orders[i].status === "Pending") {
                pending++;
            }
        }
    }

    document.getElementById("customerName").innerHTML = customer.fullName;
    document.getElementById("customerId").innerHTML = customer.id;
    document.getElementById("totalOrders").innerHTML = total;
    document.getElementById("pendingOrders").innerHTML = pending;
}



// FEATURE 1: MENU & MY ORDERS  (Create, Read, Update, Delete, Search)
function showCategory(category) {
    currentCategory = category;
    document.getElementById("menuSearch").value = "";
    renderMenu();
}


function renderMenu() {
    const search = document.getElementById("menuSearch").value;
    let html = "";
    let count = 0;

    for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];
        if (currentCategory !== "All" && item.category !== currentCategory) {
            continue;
        }
        if (containsText(item.name + " " + item.category + " " + item.description, search) === false) {
            continue;
        }
        count++;

        html += '<div style="width:210px; border:1px solid #ddd; border-radius:10px; padding:10px; text-align:center; box-shadow:0 2px 6px rgba(0,0,0,0.15);">' +
            '<img src="Image/' + item.image + '" alt="' + escapeHtml(item.name) + '" width="170" height="120" style="object-fit:cover; border-radius:8px;">' +
            "<h4>" + escapeHtml(item.name) + "</h4>" +
            "<small>" + item.category + "</small>" +
            "<p>" + escapeHtml(item.description) + "</p>" +
            "<p><b>" + item.price + " Tk</b></p>" +
            "</div>";
    }

    if (count === 0) {
        html = "<p>No food found.</p>";
    }
    document.getElementById("menuGrid").innerHTML = html;


    let title = currentCategory + " Items";
    if (currentCategory === "All") {
        title = "All Items";
    }
    document.getElementById("menuTitle").innerHTML = title + " (" + count + ")";

    const tabs = document.getElementsByClassName("tab");
    for (let j = 0; j < tabs.length; j++) {
        if (tabs[j].id === "tab-" + currentCategory) {
            tabs[j].style.backgroundColor = "#ffb703";
            tabs[j].style.fontWeight = "bold";
        } else {
            tabs[j].style.backgroundColor = "";
            tabs[j].style.fontWeight = "normal";
        }
    }
}

// ---------- My Orders ----------
function renderOrders() {
    const search = document.getElementById("orderSearch").value;
    let rows = "";
    let count = 0;

    for (let i = 0; i < orders.length; i++) {
        const o = orders[i];
        if (o.customerId !== currentCustomerId) {
            continue;
        }

        const searchable = o.id + " " + o.itemName + " " + o.type + " " + o.payment + " " + o.status;
        if (containsText(searchable, search) === false) {
            continue;
        }
        count++;


        let actions = "-";
        if (o.status === "Pending") {
            actions = '<button type="button" onclick="editOrder(' + i + ')">Edit</button> ' +
                '<button type="button" onclick="cancelOrder(' + i + ')">Cancel</button>';
        }

        rows += "<tr>" +
            "<td>" + o.id + "</td>" +
            "<td>" + escapeHtml(o.itemName) + "</td>" +
            "<td>" + o.qty + "</td>" +
            "<td>" + o.type + "</td>" +
            "<td>" + o.payment + "</td>" +
            "<td>" + o.total + "</td>" +
            "<td>" + o.date + "</td>" +
            '<td style="color:' + statusColor(o.status) + '"><b>' + o.status + "</b></td>" +
            "<td>" + actions + "</td>" +
            "</tr>";
    }

    if (count === 0) {
        rows = '<tr><td colspan="9">No orders found.</td></tr>';
    }
    document.getElementById("ordersTableBody").innerHTML = rows;
}


function saveOrder() {
    const itemId = document.getElementById("orderItem").value;
    const qty = parseInt(document.getElementById("orderQty").value);
    const type = getRadioValue("orderType");
    const address = document.getElementById("orderAddress").value.trim();
    const phone = document.getElementById("orderPhone").value.trim();
    const payment = document.getElementById("orderPayment").value;
    const note = document.getElementById("orderNote").value.trim();

    clearErrors(["orderItemError", "orderQtyError", "orderTypeError", "orderAddressError", "orderPhoneError", "orderPaymentError"]);
    let valid = true;

    if (itemId === "") {
        showError("orderItemError", "Please select a food item.");
        valid = false;
    }
    if (isNaN(qty) || qty < 1 || qty > restaurantRules.maxQty) {
        showError("orderQtyError", "Quantity must be between 1 and " + restaurantRules.maxQty + ".");
        valid = false;
    }
    if (type === "") {
        showError("orderTypeError", "Please choose an order type.");
        valid = false;
    }
    if (type === "Delivery" && address.length < 10) {
        showError("orderAddressError", "Enter a full delivery address (at least 10 characters).");
        valid = false;
    }
    if (isValidPhone(phone) === false) {
        showError("orderPhoneError", "Enter an 11 digit phone number starting with 01.");
        valid = false;
    }
    if (payment === "") {
        showError("orderPaymentError", "Please select a payment method.");
        valid = false;
    }

    if (valid === false) {
        return false;
    }

    const item = getMenuItem(itemId);
    const total = calcOrderTotal(item.price, qty, type);
    let finalAddress = address;
    if (type !== "Delivery") {
        finalAddress = "-";
    }

    if (editIndex === -1) {

        const newOrder = {
            id: makeId("O-", orderCounter),
            customerId: currentCustomerId,
            itemId: itemId,
            itemName: item.name,
            qty: qty,
            type: type,
            address: finalAddress,
            phone: phone,
            payment: payment,
            note: note,
            total: total,
            date: todayString(),
            status: "Pending"
        };
        orderCounter++;
        orders.push(newOrder);
        showMessage("ordersMessage", "Order " + newOrder.id + " placed successfully. Total: " + total + " Tk.", "green");
    } else {
        // UPDATE: change the properties of the existing object
        const order = orders[editIndex];
        order.itemId = itemId;
        order.itemName = item.name;
        order.qty = qty;
        order.type = type;
        order.address = finalAddress;
        order.phone = phone;
        order.payment = payment;
        order.note = note;
        order.total = total;
        showMessage("ordersMessage", "Order " + order.id + " updated. New total: " + total + " Tk.", "green");
        editIndex = -1;
        document.getElementById("orderSaveBtn").value = "Place Order";
    }

    document.getElementById("orderForm").reset();
    document.getElementById("orderPhone").value = getCurrentCustomer().phone;
    refreshOrderViews();
    return false;
}

function editOrder(index) {
    const order = orders[index];
    if (order.status !== "Pending") {
        alert("Only Pending orders can be edited.");
        return;
    }

    document.getElementById("orderItem").value = order.itemId;
    document.getElementById("orderQty").value = order.qty;
    setRadioValue("orderType", order.type);
    if (order.address === "-") {
        document.getElementById("orderAddress").value = "";
    } else {
        document.getElementById("orderAddress").value = order.address;
    }
    document.getElementById("orderPhone").value = order.phone;
    document.getElementById("orderPayment").value = order.payment;
    document.getElementById("orderNote").value = order.note;

    editIndex = index;
    document.getElementById("orderSaveBtn").value = "Update Order";
    clearErrors(["orderItemError", "orderQtyError", "orderTypeError", "orderAddressError", "orderPhoneError", "orderPaymentError"]);
    showMessage("ordersMessage", "Editing order " + order.id + ". Change the details and click Update Order.", "royalblue");
    document.getElementById("orderForm").scrollIntoView();
}


function cancelOrder(index) {
    const order = orders[index];
    if (order.status !== "Pending") {
        alert("Only Pending orders can be cancelled.");
        return;
    }
    if (confirm("Cancel order " + order.id + "?") === false) {
        return;
    }

    orders = removeAt(orders, index);

    if (editIndex === index) {
        cancelOrderEdit();
        document.getElementById("orderForm").reset();
    } else if (editIndex > index) {
        editIndex--;
    }

    showMessage("ordersMessage", "Order " + order.id + " cancelled.", "red");
    refreshOrderViews();
}


function cancelOrderEdit() {
    editIndex = -1;
    document.getElementById("orderSaveBtn").value = "Place Order";
    clearErrors(["orderItemError", "orderQtyError", "orderTypeError", "orderAddressError", "orderPhoneError", "orderPaymentError"]);
}

function refreshOrderViews() {
    renderOrders();
    renderCart();
    renderTrackingOptions();
    renderTrackingCards();
    refreshTrackResult();
    updateSummary();
}



// FEATURE 2 (UNIQUE): CART & BILL
function renderCart() {
    let rows = "";
    let count = 0;
    let subTotal = 0;
    let vat = 0;
    let delivery = 0;

    for (let i = 0; i < orders.length; i++) {
        const o = orders[i];
        if (o.customerId !== currentCustomerId) {
            continue;
        }
        count++;

        const item = getMenuItem(o.itemId);
        const lineTotal = item.price * o.qty;

        subTotal += lineTotal;
        vat += Math.round(lineTotal * restaurantRules.vatPercent / 100);
        if (o.type === "Delivery") {
            delivery += restaurantRules.deliveryCharge;
        }

        rows += "<tr>" +
            "<td>" + o.id + "</td>" +
            "<td>" + escapeHtml(o.itemName) + "</td>" +
            "<td>" + item.price + "</td>" +
            "<td>" + o.qty + "</td>" +
            "<td>" + lineTotal + "</td>" +
            "</tr>";
    }

    if (count === 0) {
        rows = '<tr><td colspan="5">You have not ordered anything yet.</td></tr>';
    }
    document.getElementById("cartTableBody").innerHTML = rows;

    document.getElementById("billSubTotal").innerHTML = subTotal;
    document.getElementById("billVat").innerHTML = vat;
    document.getElementById("billDelivery").innerHTML = delivery;
    document.getElementById("billGrandTotal").innerHTML = subTotal + vat + delivery;
}



// FEATURE 3 (UNIQUE): ORDER TRACKING
function renderTrackingOptions() {
    const select = document.getElementById("trackOrderId");
    const oldValue = select.value;
    select.innerHTML = "";

    const first = document.createElement("option");
    first.value = "";
    first.text = "-- Select an order --";
    select.appendChild(first);

    for (let i = 0; i < orders.length; i++) {
        if (orders[i].customerId === currentCustomerId) {
            const option = document.createElement("option");
            option.value = orders[i].id;
            option.text = orders[i].id + " - " + orders[i].itemName;
            select.appendChild(option);
        }
    }
    select.value = oldValue;
}
function refreshTrackResult() {
    if (document.getElementById("trackOrderId").value === "") {
        document.getElementById("trackResult").innerHTML = "";
    } else {
        trackOrder();
    }
}

function trackOrder() {
    const orderId = document.getElementById("trackOrderId").value;
    const result = document.getElementById("trackResult");

    clearError("trackError");

    if (orderId === "") {
        showError("trackError", "Please select an order.");
        result.innerHTML = "";
        return;
    }

    let order = null;
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].id === orderId) {
            order = orders[i];
        }
    }
    if (order === null) {
        showError("trackError", "Order not found.");
        result.innerHTML = "";
        return;
    }

    const current = trackSteps.indexOf(order.status);
    const percent = Math.round((current + 1) / trackSteps.length * 100);
    const color = statusColor(order.status);

    let html = "<h3>Order " + order.id + " - " + escapeHtml(order.itemName) + "</h3>";
    html += "<p>Placed on " + order.date + " | " + order.type + " | Total: " + order.total + " Tk</p>";
    html += '<div style="background:#ddd; border-radius:10px; height:14px;">' +
        '<div style="width:' + percent + '%; background:' + color + '; height:14px; border-radius:10px;"></div></div>';
    html += "<p>" + percent + "% complete</p>";

    for (let j = 0; j < trackSteps.length; j++) {
        let mark = "&#9675;";
        let stepColor = "gray";
        let weight = "normal";
        if (j < current) {
            mark = "&#10004;";
            stepColor = "green";
        } else if (j === current) {
            mark = "&#9679;";
            stepColor = color;
            weight = "bold";
        }
        html += '<div style="border-left:5px solid ' + stepColor + '; padding:6px 12px; margin:6px 0; font-weight:' + weight + '; color:' + stepColor + ';">' +
            mark + " " + trackSteps[j] + "</div>";
    }

    let message = "";
    switch (order.status) {
        case "Pending":
            message = "We have received your order and are waiting to confirm it.";
            break;
        case "Confirmed":
            message = "Your order is confirmed. The kitchen will start soon.";
            break;
        case "Preparing":
            message = "Our chefs are preparing your food.";
            break;
        case "On the way":
            message = "Your food has left the restaurant.";
            break;
        case "Delivered":
            message = "Delivered. Enjoy your meal!";
            break;
    }
    html += "<p><b>" + message + "</b></p>";

    result.innerHTML = html;
}


function renderTrackingCards() {
    let html = "";
    let count = 0;

    for (let i = 0; i < orders.length; i++) {
        const o = orders[i];
        if (o.customerId !== currentCustomerId) {
            continue;
        }
        count++;
        html += '<div style="border-left:6px solid ' + statusColor(o.status) + '; background:#f7f7f7; padding:10px 14px; margin:8px 0; border-radius:6px;">' +
            "<b>" + o.id + "</b> - " + escapeHtml(o.itemName) + " (x" + o.qty + ")<br>" +
            'Status: <b style="color:' + statusColor(o.status) + '">' + o.status + "</b> | " + o.type + " | " + o.total + " Tk | " + o.date +
            "</div>";
    }

    if (count === 0) {
        html = "<p>You have no orders yet.</p>";
    }
    document.getElementById("trackingCards").innerHTML = html;
}



// FEATURE 4 (UNIQUE): TABLE RESERVATION
function saveReservation() {
    const name = document.getElementById("resName").value.trim();
    const phone = document.getElementById("resPhone").value.trim();
    const date = document.getElementById("resDate").value;
    const time = document.getElementById("resTime").value;
    const guests = parseInt(document.getElementById("resGuests").value);
    const seating = document.getElementById("resSeating").value;
    const note = document.getElementById("resNote").value.trim();
    const today = todayString();

    clearErrors(["resNameError", "resPhoneError", "resDateError", "resTimeError", "resGuestsError", "resSeatingError"]);
    let valid = true;

    if (name.length < 3) {
        showError("resNameError", "Name must be at least 3 characters.");
        valid = false;
    }
    if (isValidPhone(phone) === false) {
        showError("resPhoneError", "Enter an 11 digit phone number starting with 01.");
        valid = false;
    }
    if (date === "") {
        showError("resDateError", "Please choose a date.");
        valid = false;
    } else if (date < today) {
        showError("resDateError", "The date cannot be in the past.");
        valid = false;
    } else if (daysBetween(today, date) > 30) {
        showError("resDateError", "You can reserve only up to 30 days ahead.");
        valid = false;
    }
    if (time === "") {
        showError("resTimeError", "Please choose a time.");
        valid = false;
    } else if (time < "11:00" || time > "22:00") {
        showError("resTimeError", "We are open from 11:00 AM to 10:00 PM.");
        valid = false;
    }
    if (isNaN(guests) || guests < 1 || guests > 12) {
        showError("resGuestsError", "Guests must be between 1 and 12.");
        valid = false;
    }
    if (seating === "") {
        showError("resSeatingError", "Please select a seating area.");
        valid = false;
    }

    if (valid === true) {
        let booked = 0;
        for (let i = 0; i < reservations.length; i++) {
            if (reservations[i].date === date && reservations[i].time === time) {
                booked += reservations[i].guests;
            }
        }
        if (booked + guests > restaurantRules.seatLimit) {
            let left = restaurantRules.seatLimit - booked;
            if (left < 0) {
                left = 0;
            }
            showError("resGuestsError", "Only " + left + " seats are left for this time slot.");
            valid = false;
        }
    }

    if (valid === false) {
        return false;
    }

    const selected = [];
    const boxes = document.getElementsByName("occasion");
    for (let j = 0; j < boxes.length; j++) {
        if (boxes[j].checked) {
            selected.push(boxes[j].value);
        }
    }
    let occasion = "None";
    if (selected.length > 0) {
        occasion = selected.join(", ");
    }

    const reservation = {
        id: makeId("R-", reservationCounter),
        customerId: currentCustomerId,
        name: name,
        phone: phone,
        date: date,
        time: time,
        guests: guests,
        seating: seating,
        occasion: occasion,
        note: note,
        status: "Confirmed"
    };
    reservationCounter++;
    reservations.push(reservation);

    document.getElementById("reservationForm").reset();
    fillReservationDefaults();
    renderReservations();
    showMessage("reservationMessage", "Table reserved. Your reservation ID is " + reservation.id + ".", "green");
    return false;
}

function renderReservations() {
    const today = todayString();
    let rows = "";
    let count = 0;

    for (let i = 0; i < reservations.length; i++) {
        const r = reservations[i];
        if (r.customerId !== currentCustomerId) {
            continue;
        }
        count++;

        let status = "Confirmed";
        let action = '<button type="button" onclick="cancelReservation(' + i + ')">Cancel</button>';
        if (r.date < today) {
            status = "Completed";
            action = "-";
        }

        rows += "<tr>" +
            "<td>" + r.id + "</td>" +
            "<td>" + r.date + "</td>" +
            "<td>" + r.time + "</td>" +
            "<td>" + r.guests + "</td>" +
            "<td>" + r.seating + "</td>" +
            "<td>" + escapeHtml(r.occasion) + "</td>" +
            '<td style="color:' + (status === "Confirmed" ? "green" : "gray") + '"><b>' + status + "</b></td>" +
            "<td>" + action + "</td>" +
            "</tr>";
    }

    if (count === 0) {
        rows = '<tr><td colspan="8">You have no reservations.</td></tr>';
    }
    document.getElementById("reservationTableBody").innerHTML = rows;
}

function cancelReservation(index) {
    const r = reservations[index];
    if (confirm("Cancel reservation " + r.id + "?") === false) {
        return;
    }
    reservations = removeAt(reservations, index);
    renderReservations();
    showMessage("reservationMessage", "Reservation " + r.id + " cancelled.", "red");
}


function fillReservationDefaults() {
    const customer = getCurrentCustomer();
    document.getElementById("resName").value = customer.fullName;
    document.getElementById("resPhone").value = customer.phone;
}

showSection("menu");

fillMenuDropdown("orderItem");


document.getElementById("orderPhone").value = getCurrentCustomer().phone;


document.getElementById("resDate").setAttribute("min", todayString());
document.getElementById("resDate").setAttribute("max", addDays(todayString(), 30));
fillReservationDefaults();

renderMenu();
renderOrders();
renderCart();
renderTrackingOptions();
renderTrackingCards();
renderReservations();
updateSummary();