import Navbar from '../components/Navbar';
import styles from '../styles/About.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>À propos de lartiste</h1>
        <p className={styles.description}>
        D. Coppard is a fine artist whose work blends traditional techniques with a contemporary vision. With a passion for expressive forms and abstract interpretations, his work invites viewers into a deep emotional journey.
        </p>
      </main>
    </div>
  );
}
