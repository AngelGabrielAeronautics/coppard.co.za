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
      <a href="/" style={styles.link}>Home</a>
      <a href="/about" style={styles.link}>About</a>
      <a href="/contact" style={styles.link}>Contact</a>
    </nav>
  );
}
