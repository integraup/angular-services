// account-data.model.ts
export interface Phone {
  country: number;
  area: number;
  number: number;
  type: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  city: string;
  region_code: string;
  country: string;
  postal_code: string;
  locality: string;
}

export interface Person {
  address: Address;
  name: string;
  birth_date: string;
  mother_name: string;
  tax_id: string;
  phones: Phone[];
}

export interface Company {
  address: Address;
  name: string;
  tax_id: string;
  phones: Phone[];
}

export interface TosAcceptance {
  user_ip: string;
  date: string;
}

export interface AccountData {
  type: string;
  person: Person;
  company: Company;
  tos_acceptance: TosAcceptance;
  business_category: string;
  email: string;
}
