const mapping: Record<string, string> = {
  allegations: 'allegation',
  investigators: 'investigator',
  organizations: 'organization',
  perpetrators: 'perpetrator',
  users: 'user',
  victims: 'victim',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
