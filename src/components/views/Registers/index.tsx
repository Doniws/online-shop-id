import styles from "./Register.module.scss";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter  } from "next/router";
import Link from "next/link";

import { signIn } from "next-auth/react";

const RegsiterView = () => {
  const { push  , query} = useRouter();
   const callbackURL:any = query.callbackURL || '/';
  const [isLoading , setIsLoading ] = useState(false);
  const [error , setError] = useState('');
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const form = event.target as HTMLFormElement;
    // get data from "name "
    event.preventDefault();
    setIsLoading(true);
    setError('');
    const data = {
      email: form.email.value,
      password: form.password.value,
      fullname: form.fullname.value,
      phone: form.phone.value
    };
    const result = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setIsLoading(false);

    if (result.status === 200) {
      form.reset();
      push("/auth/login");
    } else {
      setIsLoading(false);
      setError('Email sudah digunakan');
      console.log("failed");
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleToggleVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <section className={styles.register}>
      <div className={styles.register_wrapper}>
        <span className={styles.register_title}>
          <h1>Register</h1>
          <p>Register your account</p>
         {error && <p>{error}</p>}
        </span>
        <span className={styles.register_icon}>
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
        <div className={styles.register_form}>
          <form onSubmit={handleSubmit} action="" method="post">
            <span>
              <label htmlFor="fullname">Fullname</label>
              <input required name="fullname" type="text" />
            </span>
            <span>
              <label htmlFor="phone">Phone</label>
              <input name="phone" type="number" />
            </span>
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
            <button type="submit"> 
              {isLoading ? "Loading" : "Register"}
            </button>
          </form>
        </div>
        <p>Have account ? <Link href="/auth/login">Login</Link></p>
      </div>
    </section>
  );
};

export default RegsiterView;
