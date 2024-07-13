export type SailStatus = 'created' | 'processing' | 'completed';
export type SailJobStatus =
  | {
      status: 'completed' | 'failed' | 'skipped' | 'error';
      message: string;
    }
  | {
      status: 'processing' | 'queued';
    };

export interface ApiGetRoutines {
  routines: {
    id: string;
    name: string;
  }[];
}

export interface ApiGetMarketRoutines {
  routines: {
    id: string;
    displayName: string;
    url: string;
  }[];
}

export interface ApiGetSails {
  sails: {
    id: string;
  }[];
}

export interface ApiPostSails {
  sailId: string;
}

export interface ApiGetSailsSailId {
  status: SailStatus;
  total: number;
  done: number;
  jobs: SailJobStatus[];
}

export interface ApiError {
  error: string;
}
