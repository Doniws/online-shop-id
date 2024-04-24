import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className={styles.navbar}>
      <div className={styles.navbar_wrapper}>
        <h1>My App</h1>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
        <button className={styles.navbar_button}
          onClick={() => {
            session ? signOut() : signIn();
          }}
        >
          {session ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
