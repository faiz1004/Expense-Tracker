// script.js

// Get references to DOM elements
const transactionForm = document.getElementById("transactionForm");
const transactionName = document.getElementById("transactionName");
const transactionAmount = document.getElementById("transactionAmount");
const transactionType = document.getElementById("transactionType");
const transactionList = document.getElementById("transactionList");
const balanceElement = document.getElementById("balance");
const clearAllBtn = document.getElementById("clearAllBtn");

// Load transactions from local storage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Function to update the UI with transactions
function updateUI() {
    transactionList.innerHTML = "";
    let totalBalance = 0;

    transactions.forEach(transaction => {
        // Create list item
        const li = document.createElement("li");
        li.classList.add("transaction-item", transaction.type);
        li.innerHTML = `
            ${transaction.name} - ₹${transaction.amount.toFixed(2)}
            <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">X</button>
        `;
        
        transactionList.appendChild(li);
        
        // Update balance
        totalBalance += transaction.type === "income" ? transaction.amount : -transaction.amount;
        if(totalBalance<0){
            const totalB= document.getElementById('totalB');
            totalB.style.color = "red"
        }
        else{
            totalB.style.color = "green"
        }
    });

    balanceElement.textContent = totalBalance.toFixed(2);
    
    // Save transactions to local storage
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Function to add a new transaction
function addTransaction(event) {
    event.preventDefault();

    const name = transactionName.value.trim();
    let amount = parseFloat(transactionAmount.value);
    const type = transactionType.value;

    if (name === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid name and amount.");
        return;
    }

    // Ensure expenses are stored as positive values
    amount = Math.abs(amount);

    // Create new transaction object
    const newTransaction = {
        id: Date.now(),
        name,
        amount,
        type
    };

    transactions.push(newTransaction);
    updateUI();

    // Clear input fields
    transactionForm.reset();
}

// Function to delete a single transaction
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateUI();
}

// Function to clear all transactions
function clearAllTransactions() {
    if (confirm("Are you sure you want to delete all transactions?")) {
        transactions = [];
        updateUI();
    }
}

// Event listener for form submission
transactionForm.addEventListener("submit", addTransaction);

// Event listener for clear all transactions button
clearAllBtn.addEventListener("click", clearAllTransactions);

// Initialize UI with stored transactions
updateUI();
