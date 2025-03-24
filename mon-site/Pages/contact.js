import Navbar from '../components/Navbar';
import styles from '../styles/Contact.module.css';

export default function Contact() {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Contact</h1>
        <p className={styles.description}>
          Pour des commandes ou des questions, veuillez remplir le formulaire ci-dessous.
        </p>
        <form className={styles.form}>
          <input type="text" placeholder="Votre nom" required />
          <input type="email" placeholder="Votre email" required />
          <textarea placeholder="Votre message" rows="5" required></textarea>
          <button type="submit">Envoyer</button>
        </form>
      </main>
    </div>
  );
}
