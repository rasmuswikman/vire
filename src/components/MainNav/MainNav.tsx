import React from 'react';
import {
  CategoryTreeFragment,
  CategoryDocument,
  CategoryQuery,
  CategoryQueryVariables,
} from '../../generated/types';
import { useQuery } from 'urql';
import { useRouter } from 'next/router';
import styles from './MainNav.module.css';

type Props = {
  mainNavVisible: boolean;
  setMainNavVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MainNav(props: Props) {
  const { mainNavVisible, setMainNavVisible } = props;
  const router = useRouter();
  const [result] = useQuery<CategoryQuery, CategoryQueryVariables>({
    query: CategoryDocument,
  });
  const { data, fetching } = result;
  const categories: Array<CategoryTreeFragment | null | undefined> | null =
    (data?.categoryList &&
      data?.categoryList[0] &&
      data.categoryList[0]?.children) ??
    null;

  const handleClick = (category: CategoryTreeFragment | undefined | null) => {
    if (category) {
      router.push(
        {
          pathname: `/${category.url_path}.html`,
          query: {
            type: 'CATEGORY',
            id: category.id,
          },
        },
        `/${category.url_path}.html`,
      );
      setMainNavVisible(
        typeof window !== 'undefined' && window.innerWidth < 601 ? false : true,
      );
    }
  };

  if (fetching || !data || !categories || !mainNavVisible) return null;

  return (
    mainNavVisible && (
      <nav className={styles.wrapper}>
        <ul className={styles.container}>
          {categories.map(
            (category: CategoryTreeFragment | undefined | null) =>
              category && (
                <li key={category.id} onClick={() => handleClick(category)}>
                  {category.name}
                </li>
              ),
          )}
        </ul>
      </nav>
    )
  );
}
