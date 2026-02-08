export const customers = [
  { id: 1, name: "Kwame Mensah", phone: "024 123 4567", email: "kwame@example.com" },
  { id: 2, name: "Ama Boateng", phone: "020 987 6543", email: "ama@example.com" },
  { id: 3, name: "Kojo Asare", phone: "055 456 7890", email: "kojo@example.com" },
  { id: 4, name: "Kakra", phone: "024 111 2222", email: "kakra@gmail.com" },
  { id: 5, name: "Ezekiel", phone: "020 333 4444", email: "ez@gmail.com" },
  { id: 6, name: "Panin", phone: "055 555 6666", email: "panin@gmail.com" },
  { id: 7, name: "Lamech", phone: "024 777 8888", email: "lae@gmail.com" },
  { id: 8, name: "Gideon", phone: "020 999 0000", email: "gid@gmail.com" },
];

export const loans = [
  { id: 1, customer: "Kwame Mensah", amount: 5000, interestRate: 5.5, term: 12, status: "Active", date: "2024-01-15" },
  { id: 2, customer: "Ama Boateng", amount: 3000, interestRate: 6.0, term: 6, status: "Completed", date: "2024-02-20" },
  { id: 3, customer: "Kojo Asare", amount: 10000, interestRate: 5.0, term: 24, status: "Active", date: "2024-03-10" },
  { id: 4, customer: "Kakra", amount: 7500, interestRate: 5.8, term: 18, status: "Active", date: "2024-04-05" },
];

export const transactions = [
  { id: 1, loanId: 1, amount: 1000, type: "Repayment", date: "2024-02-15" },
  { id: 2, loanId: 1, amount: 500, type: "Repayment", date: "2024-03-15" },
  { id: 3, loanId: 2, amount: 3000, type: "Disbursement", date: "2024-02-20" },
  { id: 4, loanId: 3, amount: 10000, type: "Disbursement", date: "2024-03-10" },
  { id: 5, loanId: 4, amount: 7500, type: "Disbursement", date: "2024-04-05" },
];
