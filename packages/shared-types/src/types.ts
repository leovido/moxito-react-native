export interface MoxieModel {
  entityID: string;
  allEarningsAmount: number;
  moxieClaimTotals: MoxieClaimTotal[];
  socials: Social[];
  endTimestamp: string;
}

export interface MoxieClaimTotal {
  availableClaimAmount: number;
}

export interface Social {
  profileDisplayName: string;
  profileImage: string;
  connectedAddresses: ConnectedAddress[];
}

export interface ConnectedAddress {
  blockchain: string;
  address: string;
}

export interface MoxieClaimModel {
  fid: string;
  transactionID: string;
}

export interface MoxieClaimStatus {
  status: string;
}

export interface MoxieSplits {
  splits: Split[];
}

export interface Split {
  id: string;
  percentage: number;
  recipient: string;
}

export interface MoxiePrice {
  pair: {
    priceUsd: string;
  };
}

export interface MoxitoScoreModel {
  id: string;
  score: number;
  fid: number;
  checkInDate: string;
  createdAt: string;
  weightFactorId: string;
}

export interface MoxitoCheckinModel {
  fid: number;
  username: string;
  roundId: string;
  createdAt: string;
}

export interface MoxitoActivity {
  rounds: Round[];
}

export interface Round {
  id: string;
  score: number;
  createdAt: string;
}