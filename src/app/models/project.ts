export class Project {
  constructor() {
    this.budget = [{value: ''}];
    this.donors = [{id: '', value: ''}];
    this.national = true;
  }
  id:number;
  code: string;
  budget:any;
  date_start: number;
  date_end: number;
  organization: number;
  name: string;
  plan_part:string;
  interagency:boolean;
  implementers:any;
  description:string;
  donors:any;
  national:boolean;
  location:any;
}
