import { InvestigatorInterface } from 'interfaces/investigator';
import { PerpetratorInterface } from 'interfaces/perpetrator';
import { VictimInterface } from 'interfaces/victim';
import { GetQueryInterface } from 'interfaces';

export interface AllegationInterface {
  id?: string;
  description: string;
  status: string;
  victim_id: string;
  investigator_id: string;
  perpetrator_id: string;
  created_at?: any;
  updated_at?: any;
  investigator_investigator_assigned_allegation_idToallegation?: InvestigatorInterface[];
  perpetrator_perpetrator_allegation_idToallegation?: PerpetratorInterface[];
  victim_victim_allegation_idToallegation?: VictimInterface[];
  victim_allegation_victim_idTovictim?: VictimInterface;
  investigator_allegation_investigator_idToinvestigator?: InvestigatorInterface;
  perpetrator_allegation_perpetrator_idToperpetrator?: PerpetratorInterface;
  _count?: {
    investigator_investigator_assigned_allegation_idToallegation?: number;
    perpetrator_perpetrator_allegation_idToallegation?: number;
    victim_victim_allegation_idToallegation?: number;
  };
}

export interface AllegationGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  status?: string;
  victim_id?: string;
  investigator_id?: string;
  perpetrator_id?: string;
}
