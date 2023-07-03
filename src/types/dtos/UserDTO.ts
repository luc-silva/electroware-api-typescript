interface UserName {
  first: string;
  last: string;
}
interface UserLocation {
  country: string;
  state: string;
}
interface UserDTO {
  email: string;
  password: string;
  new_password: string;
  name: UserName;
  location: UserLocation;
  description: string;
}
