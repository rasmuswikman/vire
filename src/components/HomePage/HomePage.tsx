import Link from 'next/link';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Next.js &amp; Adobe Commerce</h1>
        <span>
          <Link href="https://github.com/rasmuswikman/vire-storefront">
            <a>Learn more</a>
          </Link>
        </span>
      </div>
    </div>
  );
}
