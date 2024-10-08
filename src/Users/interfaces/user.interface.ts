export interface User {
  id:         number;
  firstName:  string;
  lastName:   string;
  maidenName: string;
  age:        number;
  gender:     string;
  email:      string;
  phone:      string;
  username:   string;
  password:   string;
  birthDate:  Date;
  image:      string;
  bloodGroup: string;
  height:     number;
  weight:     number;
  eyeColor:   string;
  hair:       Hair;
  domain:     string;
  ip:         string;
  address:    Address;
  macAddress: string;
  university: string;
  bank:       Bank;
  company:    Company;
  ein:        string;
  ssn:        string;
  userAgent:  string;
  crypto:     Crypto;
}

interface Address {
  address:     string;
  city:        string;
  coordinates: Coordinates;
  postalCode:  string;
  state:       string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType:   string;
  currency:   string;
  iban:       string;
}

interface Company {
  address:    Address;
  department: string;
  name:       string;
  title:      string;
}

interface Crypto {
  coin:    string;
  wallet:  string;
  network: string;
}

interface Hair {
  color: string;
  type:  string;
}
