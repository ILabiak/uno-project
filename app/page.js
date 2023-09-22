import Image from 'next/image';
import background from '../public/background.webp';
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
        <img className={styles.gameLogo} src="/game_logo.png" />
        <div className={styles.playButtonContainer}>
          <button className={styles.playButton}>Play</button>
        </div>
      </div>
    </main>
  );
}
