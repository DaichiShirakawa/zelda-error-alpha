export interface ZeldaIssue {
  id: string,
  situation: string,
  title: string,
  vote: number,
  type: ZeldaIssueType,
  status: ZeldaIssueStatus,

  ticket: ZeldaIssueTicket,

  props: any,
}

export enum ZeldaIssueType {
  error = 'error',
  request = 'request',
}

export enum ZeldaIssueStatus {
  open = 'open',
  next_patch = 'next_patch',
  fixed = 'fixed',
}


export interface ZeldaIssueTicket {
  id: number,
  url?: string,
  createdAt?: Date,
  closedAt?: Date,
  closedBy?: Date,
}
