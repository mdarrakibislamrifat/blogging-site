import UserAuthFormInner from "../pages/userAuthFormInner";
export default function UserAuthForm({ type }) {
  return <UserAuthFormInner key={type} type={type} />;
}
