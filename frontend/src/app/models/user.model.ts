export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  isModerator: boolean;
  isFirstLogin: boolean;
  invitedBy: string;
}