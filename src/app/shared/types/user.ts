export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    address: string;
    role: string;
    zipcode: string;
    avatar: string;
    gender: Gender;
    phone: string;
    verified: boolean;
    iat: number;
    exp: number;
  }
  
  export enum Gender {
    Male = 'MALE',
    Female = 'FEMALE',
    Other = 'OTHER',
  }