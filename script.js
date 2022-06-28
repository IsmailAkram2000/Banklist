'use strict'; 

/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Ismail Akram',
  movements: [
    [2000, `2019-11-18T21:31:17.178Z`],
    [1000, `2020-01-28T09:15:04.904Z`],
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Tasneem Akram',
  movements: [
    [2000, `2019-11-18T21:31:17.178Z`],
    [1000, `2020-01-28T09:15:04.904Z`],
  ],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Abdallah Akram',
  movements: [
    [2000, `2019-11-18T21:31:17.178Z`],
    [1000, `2020-01-28T09:15:04.904Z`],
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Tasbih Akram',
  movements: [
    [2000, `2019-11-18T21:31:17.178Z`],
    [1000, `2020-01-28T09:15:04.904Z`],
  ],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
let [curUser, sort] = [0, 0];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Functions

// Display all deposit and withdrawal in cur account
const displayActions = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (val, i) {
    const action = val[0] > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(val[1]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    // day/month/year
    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${action}">${
      i + 1
    } ${action}</div>
      <div class="movements__date">${day}/${month}/${year}</div>
      <div class="movements__value">${val[0]}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display total balane in the current account
const balance = function (acc) {
  const total = acc.movements.reduce(function (s, val) {
    return s + Number(val[0]);
  }, 0);

  labelBalance.textContent = `${+total.toFixed(2)} €`;
  // day/month/year, hour:minutes
  setInterval(() => {
    const date = new Date();
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const hour = `${date.getHours()}`.padStart(2, 0);
    const minutes = `${date.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;
  }, 1000);
};

// Display the summary in the current account
const displaySummary = function (movement, iR) {
  const income = movement
    .filter(val => val[0] > 0)
    .reduce((acc, val) => acc + val[0], 0);
  const outcome = movement
    .filter(val => val[0] < 0)
    .reduce((acc, val) => acc - val[0], 0);
  const interest = movement
    .filter(val => val[0] > 0)
    .reduce(
      (acc, val) =>
        (val[0] * iR) / 100 >= 1 ? acc + (val[0] * iR) / 100 : acc,
      0
    );

  labelSumIn.textContent = +income.toFixed(2);
  labelSumOut.textContent = +outcome.toFixed(2);
  labelSumInterest.textContent = +interest.toFixed(2);
};

// To display current account information
const display = function () {
  displaySummary(curUser.movements, curUser.interestRate);
  displayActions(curUser.movements);
  balance(curUser);
};

// Signin and display the user information
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  const [username, pin] = [
    inputLoginUsername.value,
    Number(inputLoginPin.value),
  ];

  curUser = accounts.find(val => val.owner == username && val.pin == pin);

  if (curUser) {
    containerApp.style.opacity = 100;
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    sort = 0;

    labelWelcome.textContent = `Wellcome back, ${curUser.owner.split(' ')[0]}!`;

    display();
  }
});

// Transfer Money to another account
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const [to, amount] = [
    inputTransferTo.value,
    Number(inputTransferAmount.value),
  ];

  inputTransferTo.value = '';
  inputTransferAmount.value = '';

  const toUser = accounts.find(val => val.owner == to);

  const total = curUser.movements.reduce((sum, val) => sum + val[0], 0);

  if (toUser && amount > 0 && amount <= total) {
    curUser.movements.push([+(amount * -1).toFixed(2), new Date()]);
    toUser.movements.push([+amount.toFixed(2), new Date()]);

    display();
  }
});

// To Take a loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  inputLoanAmount.value = '';

  if (
    amount > 0 &&
    curUser.movements.some(val => val[0] >= (amount * 10) / 100)
  ) {
    setTimeout(function () {
      curUser.movements.push([amount, new Date()]);

      display();
    }, 2000);
  }
});

// To Close an account and delete it from accounts
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const [user, pin] = [inputCloseUsername.value, Number(inputClosePin.value)];

  if (curUser.owner == user && curUser.pin == pin) {
    inputCloseUsername.value = '';
    inputClosePin.value = '';

    const index = accounts.findIndex(acc => acc == curUser);

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
});

// To sort all movements in the current account
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  sort == 1 ? (sort = 0) : (sort = 1);

  if (sort == 1) {
    displayActions(
      curUser.movements.slice().sort((a, b) => {
        if (a[0] > b[0]) return 1;
        else return -1;
      })
    );
  } else displayActions(curUser.movements);
});

displayActions(account1.movements);
