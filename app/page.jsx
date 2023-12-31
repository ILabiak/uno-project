
import styles from './page.module.css';
export default function Home() {
  return (
    <main
      className={styles.main}
      style={{
        backgroundImage: `url(background.webp)`,
        backgroundSize: 'cover',
      }}
    >
      <div className={styles.contentContainer}>
        <img className={styles.gameLogo} alt='logo' src="/game_logo.png" />
        <div className={styles.playButtonContainer}>
          <a className={styles.playButton} href='/play' >Play</a>
        </div>
      </div>
    </main>
  );
}
