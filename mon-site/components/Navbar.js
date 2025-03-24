import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/"><a className={styles.link}>Accueil</a></Link>
      <Link href="/about"><a className={styles.link}>À propos</a></Link>
      <Link href="/contact"><a className={styles.link}>Contact</a></Link>
    </nav>
  );
}
