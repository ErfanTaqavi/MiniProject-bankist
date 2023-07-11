'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const DisplayMovments = function (movements, sort = false) {
  //like textcontent = 0
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
     <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__value">${mov}₤</div>
    </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//function to calc Balance
const calcDisplayBalance = function (acc) {
  acc.Balance = acc.movements.reduce((acc, mov) => acc + mov);

  labelBalance.textContent = `${acc.Balance} ₤`;
};

//function to calc summry in
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}₤`;
  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}₤`;
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((acc, interest) => acc + interest);
  labelSumInterest.textContent = `${interest}₤`;
};

//function to creat username for account

const createusernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createusernames(accounts);

const UpdateUI = function (acc) {
  //Display movments
  DisplayMovments(acc.movements);
  //Display Balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

let currentAccount;
//login form
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //welcome massage
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    UpdateUI(currentAccount);
  }
});

//func to transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.Balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing amount
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    UpdateUI(currentAccount);
  }
  //clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});
//func to give loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    amount >= currentAccount.movements.some(mov => mov > amount * 0.1)
  ) {
    //add movement
    currentAccount.movements.push(amount);
    //updateUI
    UpdateUI(currentAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

//func to close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    //find index of acc
    const index = accounts.findIndex(
      account => account.username === inputCloseUsername.value
    );
    //remove acc from arr
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  DisplayMovments(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//2 ways to calc total balance of accounts
// calc total movement by bank (1)
const accmovement = accounts.map(acc => acc.movements);
const allmovements = accmovement.flat(1);
const totalmovements = allmovements.reduce((acc, mov) => acc + mov);
console.log(totalmovements);
//another way to calc (2)
const overallmovements = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov);
console.log(overallmovements);

//create new arr from movements in UI. click on label Balance and see console
labelBalance.addEventListener('click', function () {
  const movmentsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('₤', ''))
  );
  console.log(movmentsUI);
});

//sum all Diposite
const BankeDipositeSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, mov) => sum + mov,0);
  
  
  console.log(BankeDipositeSum);

//Number of all Diposite greater than 1000 
//(1)
const SumDipositeGreater1000_1 =accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length
console.log(SumDipositeGreater1000_1);
//(2)
const SumDipositeGreater1000_2 =accounts.flatMap(acc => acc.movements).reduce((count,mov)=> mov >=1000 ? ++count : count,0)
console.log(SumDipositeGreater1000_2);

// sums with reduce method and create object
const sums = accounts.flatMap(acc => acc.movements).reduce((sums,cur)=>{
  cur > 0 ? (sums.deposit += cur ): (sums.withdrawal += cur)
  return sums
},
{deposit: 0, withdrawal:0 
})
console.log(sums);
/*
// practice for try with array methods
const captitle = function(title){

  const exceptions = ['a','and']
  const cap = title.toLowerCase().split(' ').map(word => exceptions.includes(word)? word : word[0].toUpperCase()+word.slice(1)).join(' ')
  return cap
}
console.log(captitle('write a title'));
*/