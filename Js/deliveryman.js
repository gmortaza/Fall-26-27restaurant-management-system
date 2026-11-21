const currentRiderName = "Delivery Man";

let records = [
    { orderId: "ORD-090", area: "Mirpur", distance: 9.5, payment: "Cash on Delivery", date: "2026-11-15", result: "Delivered", remarks: "" },
    { orderId: "ORD-091", area: "Uttara", distance: 14, payment: "bKash", date: "2026-11-15", result: "Delivered", remarks: "" },
    { orderId: "ORD-093", area: "Gulshan", distance: 7.5, payment: "Card", date: "2026-11-16", result: "Failed", remarks: "Customer did not answer the phone" },
    { orderId: "ORD-095", area: "Banani", distance: 6, payment: "Cash on Delivery", date: "2026-11-17", result: "Returned", remarks: "Wrong address given" }
];

let deliveries = [
    { orderId: "ORD-104", customer: "Rahim Uddin", area: "Dhanmondi", amount: 960, payment: "Cash on Delivery", status: "Assigned", reason: "" },
    { orderId: "ORD-106", customer: "Farhana Akter", area: "Mohammadpur", amount: 610, payment: "bKash", status: "Assigned", reason: "" },
    { orderId: "ORD-099", customer: "Nusrat Jahan", area: "Uttara", amount: 540, payment: "Cash on Delivery", status: "Accepted", reason: "" },
    { orderId: "ORD-100", customer: "Tanvir Ahmed", area: "Mirpur", amount: 320, payment: "Card", status: "On the Way", reason: "" },
    { orderId: "ORD-094", customer: "Kamal Hossain", area: "Dhanmondi", amount: 720, payment: "Cash on Delivery", status: "Delivered", reason: "" },
    { orderId: "ORD-097", customer: "Sadia Islam", area: "Banani", amount: 450, payment: "Cash on Delivery", status: "Delivered", reason: "" },
    { orderId: "ORD-092", customer: "Mitu Rahman", area: "Gulshan", amount: 380, payment: "bKash", status: "Delivered", reason: "" },
    { orderId: "ORD-096", customer: "Imran Hossain", area: "Gulshan", amount: 280, payment: "Cash on Delivery", status: "Rejected", reason: "Motorbike had a flat tyre" }
];

// Cash the rider has already deposited at the restaurant cashier
let settlements = [
    { date: "2026-11-17", amount: 500, note: "Given to cashier" }
];

let editIndex = -1;

const sectionIds = ["records", "assigned", "cash", "earnings"];

// ---------------------- COMMON HELPER FUNCTIONS ----------------------

function showSection(name) {
    for (let i = 0; i < sectionIds.length; i++) {
        if (sectionIds[i] === name) {
            document.getElementById(sectionIds[i]).style.display = "block";
        } else {
            document.getElementById(sectionIds[i]).style.display = "none";
        }
    }
}

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

function containsText(text, keyword) {
    return text.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
}
function removeAt(array, index) {
    return array.slice(0, index).concat(array.slice(index + 1));
}
function todayString() {
    let today = new Date();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    return today.getFullYear() + "-" + month + "-" + day;
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

// 1. DELIVERY RECORDS (Create, Read, Update, Delete, Search)

// Create + Update
function saveRecord() {
    let orderId = document.getElementById("orderId").value.trim();
    let area = document.getElementById("area").value;
    let distance = document.getElementById("distance").value;
    let payment = getSelectedRadio("payment");
    let date = document.getElementById("deliveryDate").value;
    let result = document.getElementById("result").value;
    let remarks = document.getElementById("remarks").value.trim();
    let isValid = true;

    clearErrors(["orderId", "area", "distance", "payCash", "deliveryDate", "result", "remarks"]);
    if (orderId === "") {
        showError("orderId", "Please enter the order ID.");
        isValid = false;
    } else if (orderId.indexOf("ORD-") !== 0 || !(Number(orderId.slice(4)) > 0)) {
        showError("orderId", "Order ID must look like ORD-101.");
        isValid = false;
    } else {
        for (let i = 0; i < records.length; i++) {
            if (records[i].orderId.toLowerCase() === orderId.toLowerCase() && i !== editIndex) {
                showError("orderId", "This order is already in your records.");
                isValid = false;
            }
        }
    }

    if (area === "") {
        showError("area", "Please select the customer area.");
        isValid = false;
    }

    if (distance === "") {
        showError("distance", "Please enter the distance.");
        isValid = false;
    } else if (Number(distance) < 0.5 || Number(distance) > 30) {
        showError("distance", "Distance must be between 0.5 and 30 km.");
        isValid = false;
    }

    if (date === "") {
        showError("deliveryDate", "Please select the delivery date.");
        isValid = false;
    } else if (date > todayString()) {
        showError("deliveryDate", "Delivery date cannot be in the future.");
        isValid = false;
    }

    if (result === "") {
        showError("result", "Please select the result.");
        isValid = false;
    }


    if (remarks.length > 100) {
        showError("remarks", "Remarks must be 100 characters or less.");
        isValid = false;
    } else if (result !== "" && result !== "Delivered" && remarks === "") {
        showError("remarks", "Please write the reason for a Failed or Returned order.");
        isValid = false;
    }

    if (isValid === false) {
        return false;
    }

    let record = {
        orderId: orderId,
        area: area,
        distance: Number(distance),
        payment: payment,
        date: date,
        result: result,
        remarks: remarks
    };

    if (editIndex === -1) {
        records.push(record);
        alert("Delivery record added.");
    } else {
        records[editIndex] = record;
        alert("Delivery record updated.");
    }

    document.getElementById("recordForm").reset();
    renderRecords();
    return false;
}


function resetRecordForm() {
    editIndex = -1;
    document.getElementById("recordFormTitle").innerHTML = "Add Delivery Record";
    document.getElementById("recordSaveBtn").value = "Save Record";
    clearErrors(["orderId", "area", "distance", "payCash", "deliveryDate", "result", "remarks"]);
}

function renderRecords() {
    let keyword = document.getElementById("recordSearch").value.trim();
    let rows = "";
    let count = 0;

    for (let i = 0; i < records.length; i++) {
        let r = records[i];
        let searchText = r.orderId + " " + r.area + " " + r.payment + " " + r.result + " " + r.date;

        if (containsText(searchText, keyword)) {
            count++;
            let remarkText = r.remarks;
            if (remarkText === "") {
                remarkText = "-";
            }

            rows += "<tr>";
            rows += "<td>" + count + "</td>";
            rows += "<td>" + r.orderId + "</td>";
            rows += "<td>" + r.area + "</td>";
            rows += "<td>" + r.distance + "</td>";
            rows += "<td>" + r.payment + "</td>";
            rows += "<td>" + r.date + "</td>";
            rows += "<td>" + r.result + "</td>";
            rows += "<td>" + remarkText + "</td>";
            rows += "<td>";
            rows += "<button type=\"button\" onclick=\"editRecord(" + i + ")\">Edit</button> ";
            rows += "<button type=\"button\" onclick=\"deleteRecord(" + i + ")\">Delete</button>";
            rows += "</td>";
            rows += "</tr>";
        }
    }

    document.getElementById("recordBody").innerHTML = rows;

    if (count === 0) {
        document.getElementById("recordMessage").innerHTML = "No delivery records found.";
    } else {
        document.getElementById("recordMessage").innerHTML = "";
    }
}


function editRecord(index) {
    let r = records[index];

    document.getElementById("orderId").value = r.orderId;
    document.getElementById("area").value = r.area;
    document.getElementById("distance").value = r.distance;
    document.getElementById("deliveryDate").value = r.date;
    document.getElementById("result").value = r.result;
    document.getElementById("remarks").value = r.remarks;

    let radios = document.getElementsByName("payment");
    for (let i = 0; i < radios.length; i++) {
        radios[i].checked = (radios[i].value === r.payment);
    }

    clearErrors(["orderId", "area", "distance", "payCash", "deliveryDate", "result", "remarks"]);
    editIndex = index;
    document.getElementById("recordFormTitle").innerHTML = "Edit Delivery Record";
    document.getElementById("recordSaveBtn").value = "Update Record";
}


function deleteRecord(index) {
    records = removeAt(records, index);

    if (editIndex === index) {
        document.getElementById("recordForm").reset();
    } else if (editIndex > index) {
        editIndex = editIndex - 1;
    }

    renderRecords();
    alert("Delivery record deleted.");
}


// 2. ASSIGNED DELIVERIES 

function fillAssignDropdown() {
    let select = document.getElementById("assignOrder");
    select.innerHTML = "<option value=\"\">Select Order</option>";

    for (const d of deliveries) {
        if (d.status !== "Delivered" && d.status !== "Rejected") {
            let option = document.createElement("option");
            option.value = d.orderId;
            option.text = d.orderId + " - " + d.area + " (" + d.status + ")";
            select.appendChild(option);
        }
    }
}

function updateDelivery() {
    let orderId = document.getElementById("assignOrder").value;
    let action = document.getElementById("assignAction").value;
    let reason = document.getElementById("rejectReason").value.trim();
    let isValid = true;

    clearErrors(["assignOrder", "assignAction", "rejectReason"]);

    if (orderId === "") {
        showError("assignOrder", "Please select an order.");
        isValid = false;
    }
    if (action === "") {
        showError("assignAction", "Please select an action.");
        isValid = false;
    }
    if (action === "Reject" && reason === "") {
        showError("rejectReason", "Please write the reason for rejecting.");
        isValid = false;
    }
    if (reason.length > 100) {
        showError("rejectReason", "Reason must be 100 characters or less.");
        isValid = false;
    }

    if (isValid === false) {
        return false;
    }


    let found = null;
    for (const d of deliveries) {
        if (d.orderId === orderId) {
            found = d;
        }
    }

    let requiredStatus = "";
    let newStatus = "";
    switch (action) {
        case "Accept":
            requiredStatus = "Assigned";
            newStatus = "Accepted";
            break;
        case "Reject":
            requiredStatus = "Assigned";
            newStatus = "Rejected";
            break;
        case "Pick Up":
            requiredStatus = "Accepted";
            newStatus = "Picked Up";
            break;
        case "Start Delivery":
            requiredStatus = "Picked Up";
            newStatus = "On the Way";
            break;
        case "Complete":
            requiredStatus = "On the Way";
            newStatus = "Delivered";
            break;
    }

    if (found.status !== requiredStatus) {
        showError("assignAction", "This order is " + found.status + ". \"" + action + "\" works only when it is " + requiredStatus + ".");
        return false;
    }

    found.status = newStatus;
    if (action === "Reject") {
        found.reason = reason;
    }

    alert("Order " + found.orderId + " is now " + newStatus + ".");
    document.getElementById("assignForm").reset();
    fillAssignDropdown();
    renderAssigned();
    renderCash();
    return false;
}

function renderAssigned() {
    let filter = document.getElementById("assignFilter").value;
    let rows = "";
    let count = 0;

    for (const d of deliveries) {
        if (filter === "All" || d.status === filter) {
            count++;
            let reasonText = d.reason;
            if (reasonText === "") {
                reasonText = "-";
            }

            rows += "<tr>";
            rows += "<td>" + d.orderId + "</td>";
            rows += "<td>" + d.customer + "</td>";
            rows += "<td>" + d.area + "</td>";
            rows += "<td>" + d.amount + "</td>";
            rows += "<td>" + d.payment + "</td>";
            rows += "<td>" + d.status + "</td>";
            rows += "<td>" + reasonText + "</td>";
            rows += "</tr>";
        }
    }

    if (count === 0) {
        rows = "<tr><td colspan=\"7\">No deliveries found.</td></tr>";
    }

    document.getElementById("assignBody").innerHTML = rows;
}

// 4. EARNINGS CALCULATOR (Unique Feature 3)

function calculateEarnings() {
    let count = document.getElementById("earnCount").value;
    let distance = document.getElementById("earnDistance").value;
    let tip = document.getElementById("earnTip").value;
    let vehicle = getSelectedRadio("earnVehicle");
    let isValid = true;

    clearErrors(["earnCount", "earnDistance", "earnTip"]);

    if (count === "") {
        showError("earnCount", "Please enter the number of deliveries.");
        isValid = false;
    } else if (Number(count) < 1 || Number(count) > 100) {
        showError("earnCount", "Deliveries must be between 1 and 100.");
        isValid = false;
    } else if (Number(count) !== Math.floor(Number(count))) {
        showError("earnCount", "Deliveries must be a whole number.");
        isValid = false;
    }

    if (distance === "") {
        showError("earnDistance", "Please enter the total distance.");
        isValid = false;
    } else if (Number(distance) < 1 || Number(distance) > 500) {
        showError("earnDistance", "Distance must be between 1 and 500 km.");
        isValid = false;
    }

    if (tip === "") {
        tip = 0;
    } else if (Number(tip) < 0 || Number(tip) > 2000) {
        showError("earnTip", "Tips must be between 0 and 2000 Tk.");
        isValid = false;
    }

    if (isValid === false) {
        document.getElementById("earnResult").innerHTML = "";
        return false;
    }

    count = Number(count);
    distance = Number(distance);
    tip = Number(tip);

    // Rate per km depends on the vehicle
    let ratePerKm = 0;
    switch (vehicle) {
        case "Bicycle":
            ratePerKm = 6;
            break;
        case "Motorbike":
            ratePerKm = 10;
            break;
    }

    let basePay = count * 30;
    let distancePay = Math.round(distance * ratePerKm);
    let nightBonus = document.getElementById("earnNight").checked ? count * 5 : 0;
    let rainBonus = document.getElementById("earnRain").checked ? count * 8 : 0;
    let total = basePay + distancePay + nightBonus + rainBonus + tip;

    let html = "";
    html += "<div class=\"card\">";
    html += "<h3>Earnings Summary</h3>";
    html += "<table class=\"data-table\">";
    html += "<tr><td>Base pay (" + count + " x 30 Tk)</td><td>" + basePay + " Tk</td></tr>";
    html += "<tr><td>Distance pay (" + distance + " km x " + ratePerKm + " Tk, " + vehicle + ")</td><td>" + distancePay + " Tk</td></tr>";
    html += "<tr><td>Night bonus</td><td>" + nightBonus + " Tk</td></tr>";
    html += "<tr><td>Rain bonus</td><td>" + rainBonus + " Tk</td></tr>";
    html += "<tr><td>Tips</td><td>" + tip + " Tk</td></tr>";
    html += "<tr><th>Total Earnings</th><th>" + total + " Tk</th></tr>";
    html += "</table>";
    html += "</div>";

    document.getElementById("earnResult").innerHTML = html;
    return false;
}

function clearEarningsResult() {
    document.getElementById("earnResult").innerHTML = "";
    clearErrors(["earnCount", "earnDistance", "earnTip"]);
}


// 3. CASH COLLECTION & SETTLEMENT (Unique Feature 2)


function getCashCollected() {
    let total = 0;
    for (const d of deliveries) {
        if (d.status === "Delivered" && d.payment === "Cash on Delivery") {
            total = total + d.amount;
        }
    }
    return total;
}

function getCashDeposited() {
    let total = 0;
    for (const s of settlements) {
        total = total + s.amount;
    }
    return total;
}


function renderCash() {
    let collected = getCashCollected();
    let deposited = getCashDeposited();

    document.getElementById("cashCollected").innerHTML = collected;
    document.getElementById("cashDeposited").innerHTML = deposited;
    document.getElementById("cashInHand").innerHTML = collected - deposited;


    let orderRows = "";
    for (const d of deliveries) {
        if (d.status === "Delivered" && d.payment === "Cash on Delivery") {
            orderRows += "<tr>";
            orderRows += "<td>" + d.orderId + "</td>";
            orderRows += "<td>" + d.customer + "</td>";
            orderRows += "<td>" + d.area + "</td>";
            orderRows += "<td>" + d.amount + "</td>";
            orderRows += "</tr>";
        }
    }
    if (orderRows === "") {
        orderRows = "<tr><td colspan=\"4\">No delivered COD orders yet.</td></tr>";
    }
    document.getElementById("cashOrdersBody").innerHTML = orderRows;


    let depositRows = "";
    for (let i = 0; i < settlements.length; i++) {
        let noteText = settlements[i].note;
        if (noteText === "") {
            noteText = "-";
        }
        depositRows += "<tr>";
        depositRows += "<td>" + (i + 1) + "</td>";
        depositRows += "<td>" + settlements[i].date + "</td>";
        depositRows += "<td>" + settlements[i].amount + "</td>";
        depositRows += "<td>" + noteText + "</td>";
        depositRows += "</tr>";
    }
    if (depositRows === "") {
        depositRows = "<tr><td colspan=\"4\">No deposits yet.</td></tr>";
    }
    document.getElementById("cashDepositBody").innerHTML = depositRows;
}

function saveSettlement() {
    let amount = document.getElementById("depositAmount").value;
    let date = document.getElementById("depositDate").value;
    let note = document.getElementById("depositNote").value.trim();
    let inHand = getCashCollected() - getCashDeposited();
    let isValid = true;

    clearCashErrors();


    if (amount === "") {
        showError("depositAmount", "Please enter the amount.");
        isValid = false;
    } else if (Number(amount) < 1) {
        showError("depositAmount", "Amount must be at least 1 Tk.");
        isValid = false;
    } else if (Number(amount) !== Math.floor(Number(amount))) {
        showError("depositAmount", "Amount must be a whole number.");
        isValid = false;
    } else if (Number(amount) > inHand) {
        showError("depositAmount", "You only have " + inHand + " Tk in hand.");
        isValid = false;
    }


    if (date === "") {
        showError("depositDate", "Please select the deposit date.");
        isValid = false;
    } else if (date > todayString()) {
        showError("depositDate", "Deposit date cannot be in the future.");
        isValid = false;
    }


    if (note.length > 60) {
        showError("depositNote", "Note must be 60 characters or less.");
        isValid = false;
    }

    if (isValid === false) {
        return false;
    }

    settlements.push({ date: date, amount: Number(amount), note: note });
    alert("Deposit saved. Cash in hand: " + (inHand - Number(amount)) + " Tk.");
    document.getElementById("cashForm").reset();
    renderCash();
    return false;
}

function clearCashErrors() {
    clearErrors(["depositAmount", "depositDate", "depositNote"]);
}

// PAGE LOAD

window.addEventListener("load", function () {
    document.getElementById("riderName").innerHTML = currentRiderName;
    renderRecords();
    fillAssignDropdown();
    renderAssigned();
    renderCash();
    showSection("records");
});
