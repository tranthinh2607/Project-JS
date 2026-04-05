interface ILoginPayload {
  username: string;
  password: string;
}

interface IRegisterPayload {
  username: string;
  name: string;
  email: string;
  password: string;
}


export type {
  ILoginPayload,
  IRegisterPayload,
};
