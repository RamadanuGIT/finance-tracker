const form = document.getElementById('transaction-form');
const nameInput = document.getElementById('name');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transaction-list');
const balance = document.getElementById('balance');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');

let transactions = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (!name || isNaN(amount) || amount <= 0) {
    alert("Isi nama dan jumlah dengan benar.");
    return;
  }

  const transaction = {
    id: Date.now(),
    name: name,
    amount: amount,
    type: type
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderTransactions();
  updateSummary();
  form.reset();
});

function renderTransactions() {
  transactionList.innerHTML = '';

  transactions.forEach((transaction) => {
    const tr = document.createElement('tr');
    const formattedAmount = transaction.amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });

    tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${formattedAmount}</td>
      <td>${transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</td>
      <td><button data-id="${transaction.id}">Hapus</button></td>
    `;

    transactionList.appendChild(tr);
  });

  document.querySelectorAll('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      transactions = transactions.filter((trx) => trx.id !== id);
      localStorage.setItem('transactions', JSON.stringify(transactions));
      renderTransactions();
      updateSummary();
    });
  });
}

function updateSummary() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((trx) => {
    if (trx.type === 'income') totalIncome += trx.amount;
    else if (trx.type === 'expense') totalExpense += trx.amount;
  });

  const totalBalance = totalIncome - totalExpense;

  balance.textContent = totalBalance.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR'
  });

  totalIncome.textContent = totalIncome.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR'
  });

  totalExpense.textContent = totalExpense.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR'
  });
}

// Jalankan saat halaman pertama kali dibuka
document.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem("transactions");
  if (stored) {
    transactions = JSON.parse(stored);
    renderTransactions();
    updateSummary();
  }
});
