import NextLink from 'next/link';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>
          Next.js &amp;
          <br /> Adobe Commerce
        </h1>
        <h2>...and a bit of TypeScript.</h2>
        <span>
          <NextLink href="https://github.com/rasmuswikman/vire-storefront">
            <a>Learn more</a>
          </NextLink>
        </span>
      </div>
    </div>
  );
}
