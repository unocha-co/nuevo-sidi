export class Project {
  constructor() {
    this.budget = [{id: 0, value: null}, {id: 99, value: null}];
    this.donors = [{id: null, value: null}];
    this.national = '1';
    this.hrp = 1;
    this.contact = 1;
    this.tags = {};
    this.shorttags1 = {};
    this.shorttags2 = {};
    this.shorttags3 = {};
    this.shorttags4 = {};
    this.implementers = [];
    this.beneficiaries = {
      poblacionales: {
        total: null,
        gender: {
          m: {
            total: null,
            age1: null,
            age2: null,
            age3: null,
            age4: null
          },
          h: {
            total: null,
            age1: null,
            age2: null,
            age3: null,
            age4: null
          }
        },
        groups: []
      },
      indirectos: {
        total: null,
        gender: {
          m: {
            total: null,
            age1: null,
            age2: null,
            age3: null,
            age4: null
          },
          h: {
            total: null,
            age1: null,
            age2: null,
            age3: null,
            age4: null
          }
        }
      },
      organizations: []
    };
  }

  id: any;
  code: string;
  budget: any;
  date_start: any = new Date();
  date_end: any = new Date();
  organization: number;
  name: string;
  hrp: number;
  interagency: boolean;
  implementers: any;
  description: string;
  donors: any;
  national: string;
  location: any;
  contact: number;
  tags: any;
  shorttags1: any;
  shorttags2: any;
  shorttags3: any;
  shorttags4: any;

  _organization: string;
  beneficiaries: any;
  cost: number;
}
