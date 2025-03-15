export class CompanyResponse {
  id!: string;
  name!: string;
  address?: string;
  logo?: string;
  phoneNumber?: string;
  phoneNumberCountryCode?: string;
  website?: string;
  contactPersonAvatar?: string;
  contactPersonFullName?: string;
  contactPersonJobTitle?: string;
  contactPersonEmail?: string;
  contactPersonPhoneNumber?: string;
  contactPersonPhoneNumberCountryCode?: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  constructor(company: any) {
    this.id = company.id;
    this.name = company.name;
    this.address = company.address;
    this.logo = company.logo;
    this.phoneNumber = company.phoneNumber;
    this.phoneNumberCountryCode = company.phoneNumberCountryCode;
    this.website = company.website;
    this.contactPersonAvatar = company.contactPersonAvatar;
    this.contactPersonFullName = company.contactPersonFullName;
    this.contactPersonJobTitle = company.contactPersonJobTitle;
    this.contactPersonEmail = company.contactPersonEmail;
    this.contactPersonPhoneNumber = company.contactPersonPhoneNumber;
    this.contactPersonPhoneNumberCountryCode = company.contactPersonPhoneNumberCountryCode;
    this.createdAt = company.createdAt;
    this.updatedAt = company.updatedAt;
    this.deletedAt = company.deletedAt;
  }
}
