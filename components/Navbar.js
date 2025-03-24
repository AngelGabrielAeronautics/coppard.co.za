import Link from 'next/link';

export default function Navbar() {
  const styles = {
    nav: {
      display: 'flex',
      gap: '20px',
      padding: '20px',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      fontWeight: 'bold',
    },
  };

  return (
    <nav style={styles.nav}>
      <Link href="/" legacyBehavior>
        <a style={styles.link}>Home</a>
      </Link>
      <Link href="/about" legacyBehavior>
        <a style={styles.link}>About</a>
      </Link>
      <Link href="/contact" legacyBehavior>
        <a style={styles.link}>Contact</a>
      </Link>
    </nav>
  );
}
