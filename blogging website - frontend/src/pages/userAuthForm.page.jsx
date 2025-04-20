import InputBox from "../components/input.component";

export default function UserAuthForm({ type }) {
  return (
    <section className="h-cover flex items-center justify-center">
      <form action="" className="w-[80%] max-w-[400px]">
        <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
          {type == "sign-in" ? "Welcome back!" : "Join us today"}
        </h1>
        {type !== "sign-in" ? (
          <InputBox
            name="Fullname"
            type="text"
            placeholder="Full Name"
            icon="fi-rr-user"
          />
        ) : (
          ""
        )}
      </form>
    </section>
  );
}
