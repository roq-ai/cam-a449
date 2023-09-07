import { AllegationInterface } from 'interfaces/allegation';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface VictimInterface {
  id?: string;
  user_id: string;
  allegation_id: string;
  incident_date?: any;
  incident_description?: string;
  incident_location?: string;
  created_at?: any;
  updated_at?: any;
  allegation_allegation_victim_idTovictim?: AllegationInterface[];
  user?: UserInterface;
  allegation_victim_allegation_idToallegation?: AllegationInterface;
  _count?: {
    allegation_allegation_victim_idTovictim?: number;
  };
}

export interface VictimGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  allegation_id?: string;
  incident_description?: string;
  incident_location?: string;
}
