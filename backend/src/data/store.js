export const users = [
  { id: 1, name: 'Daniel', email: 'daniel@daniel.com', password: '123456' },
  { id: 2, name: 'Ana',    email: 'ana@ejemplo.com',    password: 'abcdef'  }
];

export const cards = [
  { id: 1, userId: 1, name: 'Tarjeta Platino', level: 'Platino',   cardNumber: '4242 4242 4242 4242', type: 'VISA' },
  { id: 2, userId: 1, name: 'Tarjeta Oro',     level: 'Oro',       cardNumber: '4000 1234 5678 9010', type: 'MasterCard' },
  { id: 3, userId: 2, name: 'Tarjeta Classic',  level: 'Classic',  cardNumber: '5100 5678 1234 0000', type: 'MasterCard' }
];

export const accounts = [
  { id: 1, userId: 1, cardId: 1, name: 'Cuenta Principal',  balance: 11000 },
  { id: 2, userId: 1, cardId: 2, name: 'Cuenta Secundaria', balance: 21000 },
  { id: 3, userId: 2, cardId: 3, name: 'Cuenta de Ana',     balance:  5000 }
];

export const serviceAccounts = [
  { id: 1, name: 'Proveedor de Agua',     accountNumber: '8001 0000 1111' },
  { id: 2, name: 'Proveedor de Luz',      accountNumber: '8001 0000 2222' },
  { id: 3, name: 'Proveedor de Internet', accountNumber: '8001 0000 3333' }
];


export const movements = [
  { id: 1, userId: 1, accountId: 1, type: 'debit',  amount: 280,  date: '2025-08-07T09:00:00Z', description: 'Factura de Agua',      category: 'water'     },
  { id: 2, userId: 1, accountId: 1, type: 'credit', amount: 1200, date: '2025-08-06T14:00:00Z', description: 'Ingreso: Salario Jul', category: 'salary'    },
  { id: 3, userId: 1, accountId: 1, type: 'debit',  amount: 480,  date: '2025-08-06T16:00:00Z', description: 'Factura de Luz',       category: 'electricity'},
  { id: 4, userId: 1, accountId: 1, type: 'credit', amount: 500,  date: '2025-08-06T15:00:00Z', description: 'Transferencia de Jane',category: 'transfer'  },
  { id: 5, userId: 1, accountId: 1, type: 'debit',  amount: 100,  date: '2025-08-06T17:00:00Z', description: 'Factura de Internet',  category: 'internet'  },
  { id: 6, userId: 2, accountId: 3, type: 'credit', amount: 750,  date: '2025-08-07T10:00:00Z', description: 'Ingreso: Freelance',    category: 'salary'    }
]
