export enum PermissionsEnum {
  // Global/System
  SYSTEM_SUPERADMIN = 'system.superadmin',
  SYSTEM_SUPERADMIN_CREATE = 'system.create',
  SYSTEM_SUPERADMIN_UPDATE = 'system.update',
  SYSTEM_SUPERADMIN_DELETE = 'system.delete',
  SYSTEM_SUPERADMIN_READ = 'system.read',

  // Users
  USERS_CREATE = 'users.create',
  USERS_READ = 'users.read',
  USERS_UPDATE = 'users.update',
  USERS_DELETE = 'users.delete',

  // Roles & Permissions
  ROLES_CREATE = 'roles.create',
  ROLES_READ = 'roles.read',
  ROLES_UPDATE = 'roles.update',
  ROLES_DELETE = 'roles.delete',

  // Residences
  RESIDENCES_CREATE = 'residences.create',
  RESIDENCES_READ = 'residences.read',
  RESIDENCES_UPDATE = 'residences.update',
  RESIDENCES_DELETE = 'residences.delete',

  RESIDENCES_CREATE_OWN = 'residences.create.own',
  RESIDENCES_UPDATE_OWN = 'residences.update.own',
  RESIDENCES_READ_OWN = 'residences.read.own',
  RESIDENCES_DELETE_OWN = 'residences.delete.own',

  // Units
  UNITS_CREATE = 'units.create',
  UNITS_READ = 'units.read',
  UNITS_UPDATE = 'units.update',
  UNITS_DELETE = 'units.delete',

  UNITS_CREATE_OWN = 'units.create.own',
  UNITS_READ_OWN = 'units.read.own',
  UNITS_UPDATE_OWN = 'units.update.own',
  UNITS_DELETE_OWN = 'units.delete.own',

  // Leads
  LEADS_CREATE = 'leads.create',
  LEADS_READ = 'leads.read',
  LEADS_UPDATE = 'leads.update',
  LEADS_DELETE = 'leads.delete',

  // Dashboard
  DASHBOARD_READ = 'dashboard.read',

  // Companies
  COMPANIES_CREATE = 'companies.create',
  COMPANIES_READ = 'companies.read',
  COMPANIES_UPDATE = 'companies.update',
  COMPANIES_DELETE = 'companies.delete',

  // Media
  MEDIA_CREATE = 'media.create',
  MEDIA_READ = 'media.read',
  MEDIA_DELETE = 'media.delete',

  // Ranking Categories
  RANKING_CATEGORIES_CREATE = 'ranking_categories.create',
  RANKING_CATEGORIES_READ = 'ranking_categories.read',
  RANKING_CATEGORIES_UPDATE = 'ranking_categories.update',
  RANKING_CATEGORIES_DELETE = 'ranking_categories.delete',

  // Ranking Criteria
  RANKING_CRITERIA_CREATE = 'ranking_criteria.create',
  RANKING_CRITERIA_READ = 'ranking_criteria.read',
  RANKING_CRITERIA_UPDATE = 'ranking_criteria.update',
  RANKING_CRITERIA_DELETE = 'ranking_criteria.delete',

  // Key Features
  KEY_FEATURES_CREATE = 'key_features.create',
  KEY_FEATURES_READ = 'key_features.read',
  KEY_FEATURES_UPDATE = 'key_features.update',
  KEY_FEATURES_DELETE = 'key_features.delete',

  // Amenities
  AMENITIES_CREATE = 'amenities.create',
  AMENITIES_READ = 'amenities.read',
  AMENITIES_UPDATE = 'amenities.update',
  AMENITIES_DELETE = 'amenities.delete',

  // Lifestyles
  LIFESTYLES_CREATE = 'lifestyles.create',
  LIFESTYLES_READ = 'lifestyles.read',
  LIFESTYLES_UPDATE = 'lifestyles.update',
  LIFESTYLES_DELETE = 'lifestyles.delete',

  // Billing
  BILLING_READ = 'billing.read',
  BILLING_CREATE = 'billing.create',
  BILLING_UPDATE = 'billing.update',
  BILLING_DELETE = 'billing.delete',

  // Review
  REVIEWS_CREATE = 'reviews.create',
  REVIEWS_READ = 'reviews.read',
  REVIEWS_UPDATE = 'reviews.update',
  REVIEWS_DELETE = 'reviews.delete',

  // Claim Profile Contact Forms
  CLAIM_PROFILE_CONTACT_FORMS_CREATE = 'claim_profile_contact_forms.create',
  CLAIM_PROFILE_CONTACT_FORMS_READ = 'claim_profile_contact_forms.read',
  CLAIM_PROFILE_CONTACT_FORMS_UPDATE = 'claim_profile_contact_forms.update',
  CLAIM_PROFILE_CONTACT_FORMS_DELETE = 'claim_profile_contact_forms.delete',

  CLAIM_PROFILE_CONTACT_FORMS_READ_OWN = 'claim_profile_contact_forms.read.own',
  CLAIM_PROFILE_CONTACT_FORMS_UPDATE_OWN = 'claim_profile_contact_forms.update.own',
  CLAIM_PROFILE_CONTACT_FORMS_DELETE_OWN = 'claim_profile_contact_forms.delete.own',

  // Career Contact Forms
  CAREER_CONTACT_FORMS_CREATE = 'career_contact_forms.create',
  CAREER_CONTACT_FORMS_READ = 'career_contact_forms.read',
  CAREER_CONTACT_FORMS_UPDATE = 'career_contact_forms.update',
  CAREER_CONTACT_FORMS_DELETE = 'career_contact_forms.delete',

  // B2B
  B2B_CONTACT_FORMS_CREATE = 'b2b_contact_forms.create',
  B2B_CONTACT_FORMS_READ = 'b2b_contact_forms.read',
  B2B_CONTACT_FORMS_UPDATE = 'b2b_contact_forms.update',
  B2B_CONTACT_FORMS_DELETE = 'b2b_contact_forms.delete',

  // Favorites
  FAVORITES_MANAGE = 'favorites.manage',

  // Contacts (forms)
  CONTACT_FORMS_READ = 'contact_forms.read',

  // Claim Profile
  CLAIM_PROFILE_MANAGE = 'claim_profile.manage',

  // Email
  EMAIL_SEND = 'email.send',
}
