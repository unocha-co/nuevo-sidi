export class Project {
  constructor() {
    this.budget = [{value: null}];
    this.donors = [{id: null, value: null}];
    this.national = "1";
    this.hrp = 1;
    this.contact = 1;
    this.tags = {};
    this.implementers = [];
    this.beneficiaries = {
      poblacionales:{
        total: null,
        gender:{
          m:{
            total: null,
            age1: null,
            age2: null,
            age3: null,
            age4: null
          },
          h:{
            total: null,
            age1: null,
            age2: null,
            age3: null,
            age4: null
          }
        },
        groups: []
      },
      indirectos:{
        total: null,
        gender:{
          m:{
            total: null,
            age1: null,
            age2: null,
            age3: null,
            age4: null
          },
          h:{
            total: null,
            age1: null,
            age2: null,
            age3: null,
            age4: null
          }
        }
      },
      organizations:[]
    }
  }
  id:number;
  code: string;
  budget:any;
  date_start: number;
  date_end: number;
  organization: number;
  name: string;
  hrp:number;
  interagency:boolean;
  implementers:any;
  description:string;
  donors:any;
  national:string;
  location:any;
  contact:number;
  tags:any;
  _organization:string;
  beneficiaries:any;
  cost:number;
}
