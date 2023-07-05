interface User extends Document {
  id: string;
  name: {
    first: string;
    last: string | null;
  };
  // location: {
  //   state: string;
  //   country: string;
  // };
  email: string;
  funds: number;
  description: string;
  password: string;
  get(key: string): string;
}
