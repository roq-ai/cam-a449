interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['System Administrator'],
  customerRoles: [],
  tenantRoles: ['Victim', 'Investigator', 'System Administrator'],
  tenantName: 'Organization',
  applicationName: 'cam',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: [],
  ownerAbilities: [
    'Manage organizations.',
    'Invite Victims and Investigators to the organization.',
    "Control access to specific data based on an investigator's region or job function.",
  ],
};
