import { AllegationInterface } from 'interfaces/allegation';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface InvestigatorInterface {
  id?: string;
  user_id: string;
  assigned_allegation_id: string;
  investigation_status?: string;
  investigation_result?: string;
  investigation_date?: any;
  created_at?: any;
  updated_at?: any;
  allegation_allegation_investigator_idToinvestigator?: AllegationInterface[];
  user?: UserInterface;
  allegation_investigator_assigned_allegation_idToallegation?: AllegationInterface;
  _count?: {
    allegation_allegation_investigator_idToinvestigator?: number;
  };
}

export interface InvestigatorGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  assigned_allegation_id?: string;
  investigation_status?: string;
  investigation_result?: string;
}
