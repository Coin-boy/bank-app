'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
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

const account = [account1, account2, account3, account4]
/////////////////////////////////////////////////
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

/////////////////////////////////////////////////

// Map
const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
  ]);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]

const displayMovement = function(movements,sort = false){
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a,b)=>a-b): movements;

  movs.forEach(function(mov,i){

    const type = mov > 0 ? 'deposit':'withdrawal';
   const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov>0? mov : -mov}$</div>
  </div>`;

  containerMovements.insertAdjacentHTML('afterbegin', html)
  })

}




const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc,cur)=>acc + cur
  ,0)
    labelBalance.textContent = `${acc.balance} $`;
    console.log(acc.balance)
}

const calcDisplaySummary = function(acc){
  const incomes = acc.movements.filter(mov => mov > 0).
  reduce((acc,mov)=>acc + mov,0);
  labelSumIn.textContent =  `${incomes}E`;

  const out = acc.movements.filter(mov => mov < 0).reduce((acc,mov) => acc + mov,0);
  labelSumOut.textContent =  `${Math.abs(out)}E`;

  const interest = acc.movements.filter( mov => mov >0).
  map(deposit => (deposit * acc.interestRate)/100 )
  .filter((int,i,arr)=>{
    console.log(arr);
    return int >= 1;
  })
  .reduce((acc,int)=> acc + int,0);
  labelSumInterest.textContent = `${interest}E`

}



const createUsername = function(accs){
  accs.forEach(function(acc){
  acc.username = acc.owner
  .split(' ')
  .map(name => name[0])
  .join('')
  .toLowerCase()
  })
  
};

const updateUi = function(acc){
  //Display Movements
  displayMovement(currentAccount.movements);
  //Display Balance
  calcDisplayBalance(currentAccount);
  //Display Summary
  calcDisplaySummary(currentAccount);
}

createUsername(account)
console.log(account)
//Event Handler
let currentAccount;

btnLogin.addEventListener('click',function(e){
  e.preventDefault()
  currentAccount= account.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount)

  if(currentAccount ?.pin === Number(inputLoginPin.value)){
    //Display Ui and welcome message 
    labelWelcome.textContent = `welcome back , ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    
    console.log('Login')

    updateUi(currentAccount)


  }
})




btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = account.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount > 0 && currentAccount.balance >= amount && recieverAcc?.username !== currentAccount.username){
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUi(currentAccount)
  }

})

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  console.log('why')
  const amount = Number(inputLoanAmount.value)
  console.log(amount)

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    currentAccount.movements.push(amount)
    updateUi(currentAccount)
  }
  inputLoanAmount.value= '';
})

btnClose.addEventListener('click',function(e){
  e.preventDefault()
  if(inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin){
      const index = account.findIndex(acc => acc.username === currentAccount.username)
      console.log(index);

      account.splice(index,1)
      
      containerApp.style.opacity = 0;
    }
    inputClosePin = inputCloseUsername = '';
})

let sorted = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  console.log('ticker')
  displayMovement(currentAccount.movements,!sorted);
  sorted = !sorted;

})
//slice
// let arr = [1,2,4,5,6,7]                                                                                                         

// console.log(arr.slice())


// //splice
// // the splice method actually mutates the array of the variable

// console.log(arr.splice())
// console.log(arr)

// //Reverse
// // Note that reverse actually mutates the array



// console.log(arr.reverse())

// // concat
// // Note concat does not mutate the origianl array here      

// let letters = [1,3,4,5]

// console.log(letters.concat(6,7,8))

// // Join

// console.log(letters.join(' 3e '))


// for(const [i, movement] of movements.entries()){
//   if(movement > 0){
//     console.log(`you deposited ${i} as ${movement}`)
//   } else {
//     console.log(`you redrew ${i} as ${Math.abs(movement)}`)
//   }

// }

// movements.forEach((movement)=>{
//   if(movement > 0){console.log(`You deposited ${movement}`)} 
//   else{
//     console.log(`you redrew ${-(movement)}`)
//   }
// })

const euroToUsd = 1.1;

const movementUSD = movements.map((mov)=>{return mov * euroToUsd})

console.log(movements)
console.log(movementUSD)

movements.map((mov,i,arr)=>{
  if(mov > 0){
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdraw ${Math.abs(mov)}`)
  }
})


const deposit = movements.filter((mov)=>{
  return mov > 0;
})

console.log(deposit)

const withdrawal = movements.filter((mov)=>{
  return mov < 0;
})

console.log(withdrawal)
//Pipeline
const totalDepositsUSD = movements.filter((mov)=> mov > 0)
.map(mov => mov * euroToUsd).reduce((acc,mov)=>acc + mov,0);

console.log(totalDepositsUSD)

console.log(movements.includes(-130));
const anydeposit = movements.some(mov => mov > 500);

console.log(anydeposit)

//some returns if one elements meets the criteria
//every returns if all elements meets the criteria

const arr = [[1,2,3],[4,[5,6]],[6,7,8]]

console.log(arr.flat(2));


let totaltransaction = [account.flatMap(acc => acc.movements)]

console.log(totaltransaction.flat().reduce((acc,cur)=> acc + cur,0))

//sorting

movements.sort((a,b)=> a-b)

console.log(movements);

console.log([1,3,5,5,6])
const x = new Array(4)

console.log(x)

x.fill(3,2,5);
console.log(x)

// Array.from

const y = Array.from({length:7},(cur,i)=>i+1.)

console.log(y)