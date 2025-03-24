import Navbar from '../components/Navbar';
import styles from '../styles/About.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>À propos de l'artiste</h1>
        <p className={styles.description}>
          D. Coppard est un artiste passionné par l'expression créative, combinant des techniques traditionnelles avec une vision contemporaine.
        </p>
      </main>
    </div>
  );
}
