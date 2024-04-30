import styles from "./Login.module.scss";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { set } from "firebase/database";
import Link from "next/link";
import { signIn } from "next-auth/react";

const LoginView = () => {
  const { push , query } = useRouter();
  const callbackURL:any = query.callbackURL || '/';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setIsLoading(true);
  setError("");

  const form = event.target as HTMLFormElement;
  try {
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email.value,
      password: form.password.value,
      callbackUrl: callbackURL
    });

    if (!res?.error) {
      push(callbackURL);
    } else {
      setIsLoading(false);
      setError("Email or password incorrect");
    }
  } catch {
    setIsLoading(false);
    setError("Email or password incorrect");
  }
};


  const [showPassword, setShowPassword] = useState(false);
  const handleToggleVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <section className={styles.login}>
      <div className={styles.login_wrapper}>
        <span className={styles.login_title}>
          <h1>Login</h1>
          <p>Login your account</p>
          {error && <p>{error}</p>}
        </span>
        <span className={styles.login_icon}>
          <button className="wrap" type="button" onClick={() => signIn('google', { callbackURL, redirect : false })}>
            <Image
              width={20}
              height={20}
              alt="google"
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
            />
          </button>
          <button className="wrap">
            <Image
              width={20}
              height={20}
              alt="facebook"
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/facebook/facebook-original.svg"
            />
          </button>
        </span>
        <div className={styles.login_form}>
          <form onSubmit={handleSubmit} action="" method="post">
            <span>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" />
            </span>
            <span>
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
              />
              <i onClick={handleToggleVisibility}>
                {showPassword ? "Tutup" : "Lihat"}
              </i>
            </span>
            <button type="submit">{isLoading ? "Loading" : "login"}</button>
          </form>
        </div>
        <p>Don{"'"}t have an account ? Sign up<Link href="/auth/register">Register</Link></p>
      </div>
    </section>
  );
};

export default LoginView;
