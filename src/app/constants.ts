
export enum DocumentState {
  STATE_NEWLY_CREATED,
  STATE_UPDATED,
  STATE_DELETED,
  STATE_PENDING_NEWLY_CREATE,
  STATE_PENDING_UPDATE,
  STATE_PENDING_DELETE
};

export enum AttendeeState {
  STATE_NOT_REVIEWED,
  STATE_REVIEWED,
};

export enum VoterState {
  STATE_ABSTAINER,
  STATE_ACCEPTER,
  STATE_REJECTER,
};
