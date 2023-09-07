import { AllegationInterface } from 'interfaces/allegation';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PerpetratorInterface {
  id?: string;
  user_id: string;
  allegation_id: string;
  incident_role?: string;
  incident_consequence?: string;
  incident_remarks?: string;
  created_at?: any;
  updated_at?: any;
  allegation_allegation_perpetrator_idToperpetrator?: AllegationInterface[];
  user?: UserInterface;
  allegation_perpetrator_allegation_idToallegation?: AllegationInterface;
  _count?: {
    allegation_allegation_perpetrator_idToperpetrator?: number;
  };
}

export interface PerpetratorGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  allegation_id?: string;
  incident_role?: string;
  incident_consequence?: string;
  incident_remarks?: string;
}
