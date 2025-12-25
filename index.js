 // Sample expense data in Pakistani Rupees (PKR)
        const expenses = [
            { id: 1, name: "Hostel Rent", amount: 15000, category: "hostel", date: "2024-02-05" },
            { id: 2, name: "Electricity Bill", amount: 1500, category: "hostel", date: "2024-02-10" },
            { id: 3, name: "University Mess Fee", amount: 9000, category: "food", date: "2024-02-01" },
            { id: 4, name: "Dhaba Food with Friends", amount: 800, category: "food", date: "2024-02-14" },
            { id: 5, name: "Rickshaw Fare (Monthly)", amount: 2100, category: "pocket", date: "2024-02-01" },
            { id: 6, name: "Cinema Ticket", amount: 600, category: "pocket", date: "2024-02-15" },
            { id: 7, name: "Chai/Snacks with Friends", amount: 1000, category: "pocket", date: "2024-02-18" },
            { id: 8, name: "University Books", amount: 1500, category: "pocket", date: "2024-02-20" },
            { id: 9, name: "Mobile Recharge", amount: 500, category: "pocket", date: "2024-02-05" }
        ];
        
        // Initialize Chart.js
        const ctx = document.getElementById('budgetChart').getContext('2d');
        const budgetChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Hostel Rent', 'Food & Dining', 'Transportation', 'Entertainment', 'Stationery'],
                datasets: [{
                    data: [16500, 12800, 3000, 4000, 2500],
                    backgroundColor: [
                        '#006600',
                        '#FFD700',
                        '#D4AF37',
                        '#2E7D32',
                        '#B8860B'
                    ],
                    borderWidth: 2,
                    borderColor: '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ₨${value.toLocaleString('en-PK')} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        // Format PKR currency with comma separators
        function formatPKR(amount) {
            return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        
        // Function to render expenses in the table
        function renderExpenses() {
            const expenseTable = document.getElementById('expenseTable');
            expenseTable.innerHTML = '';
            
            expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            expenses.forEach(expense => {
                const row = document.createElement('tr');
                
                // Format date (Pakistani format)
                const dateObj = new Date(expense.date);
                const formattedDate = dateObj.toLocaleDateString('en-PK', { 
                    day: 'numeric',
                    month: 'short'
                });
                
                // Determine category badge
                let categoryClass = '';
                let categoryText = '';
                
                if (expense.category === 'hostel') {
                    categoryClass = 'category-hostel';
                    categoryText = 'Hostel';
                } else if (expense.category === 'food') {
                    categoryClass = 'category-food';
                    categoryText = 'Food';
                } else {
                    categoryClass = 'category-pocket';
                    categoryText = 'Pocket';
                }
                
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${expense.name}</td>
                    <td><span class="category-badge ${categoryClass}">${categoryText}</span></td>
                    <td><strong>₨${formatPKR(expense.amount)}</strong></td>
                `;
                
                expenseTable.appendChild(row);
            });
        }
        
        // Function to update summary values
        function updateSummary() {
            const totalBudget = 41500;
            const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const remainingBalance = totalBudget - totalExpenses;
            const percentageUsed = Math.round((totalExpenses / totalBudget) * 100);
            
            // Update summary cards
            document.getElementById('total-expenses').textContent = formatPKR(totalExpenses);
            document.getElementById('expense-percentage').textContent = `${percentageUsed}% of budget used`;
            document.getElementById('remaining-balance').textContent = formatPKR(remainingBalance);
            
            // Update progress bars based on expenses
            updateProgressBars();
        }
        
        // Function to update progress bars
        function updateProgressBars() {
            // Calculate actual spending from expenses
            const hostelSpent = expenses
                .filter(exp => exp.category === 'hostel')
                .reduce((sum, exp) => sum + exp.amount, 0);
            const hostelTotal = 17500;
            const hostelPercent = Math.min(100, Math.round((hostelSpent / hostelTotal) * 100));
            
            const foodSpent = expenses
                .filter(exp => exp.category === 'food')
                .reduce((sum, exp) => sum + exp.amount, 0);
            const foodTotal = 17000;
            const foodPercent = Math.min(100, Math.round((foodSpent / foodTotal) * 100));
            
            const pocketSpent = expenses
                .filter(exp => exp.category === 'pocket')
                .reduce((sum, exp) => sum + exp.amount, 0);
            const pocketTotal = 9500;
            const pocketPercent = Math.min(100, Math.round((pocketSpent / pocketTotal) * 100));
            
            // Update progress bars
            document.getElementById('hostel-progress').style.width = `${hostelPercent}%`;
            document.getElementById('utilities-progress').style.width = `${Math.min(100, (1500/2500)*100)}%`;
            document.getElementById('groceries-progress').style.width = `${Math.min(100, (9000/12000)*100)}%`;
            document.getElementById('eatingout-progress').style.width = `${Math.min(100, (800/5000)*100)}%`;
            document.getElementById('transport-progress').style.width = `${Math.min(100, (2100/3000)*100)}%`;
            document.getElementById('entertainment-progress').style.width = `${Math.min(100, (1600/4000)*100)}%`;
            document.getElementById('misc-progress').style.width = `${Math.min(100, (1500/2500)*100)}%`;
            
            // Update chart with actual data
            budgetChart.data.datasets[0].data = [hostelSpent, foodSpent, 
                expenses.filter(e => e.name.includes('Rickshaw') || e.name.includes('Fare')).reduce((s,e) => s + e.amount, 0),
                expenses.filter(e => e.name.includes('Cinema') || e.name.includes('Chai')).reduce((s,e) => s + e.amount, 0),
                expenses.filter(e => e.name.includes('Books')).reduce((s,e) => s + e.amount, 0)];
            budgetChart.update();
        }
        
        // Function to add new expense
        function addExpense() {
            const nameInput = document.getElementById('expenseName');
            const amountInput = document.getElementById('expenseAmount');
            const categoryInput = document.getElementById('expenseCategory');
            const dateInput = document.getElementById('expenseDate');
            
            // Validation
            if (!nameInput.value.trim() || !amountInput.value || !dateInput.value) {
                alert('Please fill in all fields');
                return;
            }
            
            const amount = parseFloat(amountInput.value);
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid amount in PKR');
                return;
            }
            
            const newExpense = {
                id: expenses.length + 1,
                name: nameInput.value.trim(),
                amount: amount,
                category: categoryInput.value,
                date: dateInput.value
            };
            
            expenses.push(newExpense);
            
            // Clear form
            nameInput.value = '';
            amountInput.value = '';
            dateInput.value = new Date().toISOString().split('T')[0];
            
            // Update UI
            renderExpenses();
            updateSummary();
            
            // Show confirmation with PKR symbol
            alert(`Expense "${newExpense.name}" of ₨${formatPKR(newExpense.amount)} added successfully!`);
        }
        
        // Event listeners
        document.getElementById('addExpenseBtn').addEventListener('click', addExpense);
        
        // Set today's date as default for new expenses
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expenseDate').value = today;
        
        // Month selector change event
        document.getElementById('monthSelect').addEventListener('change', function() {
            const months = ['January', 'February', 'March', 'April'];
            const selectedMonth = months[this.value];
            alert(`Switching to ${selectedMonth} 2024 budget view. In a full app, this would load different data.`);
        });
        
        // Allow Enter key to add expense
        document.getElementById('expenseAmount').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addExpense();
            }
        });
        
        // Initialize the app
        renderExpenses();
        updateSummary();
        updateProgressBars();
        
        // Format total budget with comma separators
        document.getElementById('total-budget').textContent = formatPKR(41500);
