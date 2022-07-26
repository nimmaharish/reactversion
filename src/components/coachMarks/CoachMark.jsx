import React from 'react';
import PropTypes from 'prop-types';
import { useDesktop } from 'contexts';
import styles from './CoachMark.module.css';

export function CoachMark({
  title, subTitle, onSelect, id,
}) {
  const element = document.getElementById(id);
  const top = element?.getBoundingClientRect()?.y;
  const left = element?.getBoundingClientRect()?.x;
  const elWidth = element?.getBoundingClientRect()?.width;
  const width = 100;
  const height = 100;

  const shadowHeight = 125;
  const viewPortWidth = document.body.clientWidth;
  const viewPortHeight = document.body.clientHeight;
  const isLeft = left < viewPortWidth / 2;
  const isRight = left > viewPortWidth / 2;
  const isTop = top < viewPortHeight / 2;
  const isBottom = top > viewPortHeight / 2;

  const isDesktop = useDesktop();

  const shadowStyles = isDesktop ? 'var(--primary)' : '#060b29';
  const borderStyles = isDesktop ? 'rgba(245, 96, 63, 0.7)' : 'rgb(6 11 41 / 70%)';

  const getContentStyles = () => {
    let x = 0;
    let y = 0;
    if (isLeft && isBottom) {
      y = top - shadowHeight - height;
      x = left;
    }
    if (isLeft && isTop) {
      y = top + shadowHeight;
      x = left;
    }
    if (isRight && isBottom) {
      y = top - shadowHeight - height;
      x = left - shadowHeight - height / 3;
    }
    if (isRight && isTop) {
      y = top - shadowHeight + 3 * height;
      x = left - shadowHeight;
    }
    return { x, y };
  };

  const getBoxShadow = () => {
    let x = 0;
    let y = 0;
    if (isLeft && isBottom) {
      y = -178;
      x = 0;
    }
    if (isLeft && isTop) {
      y = 136;
      x = 0;
    }
    if (isRight && isBottom) {
      y = -178;
      x = 0;
    }
    if (isRight && isTop) {
      y = 178;
      x = 0;
    }
    return `${x}px ${y}px 0px 200px ${shadowStyles},
      ${x}px ${y}px 0px 228px ${borderStyles}`;
  };
  return (
    <div className={styles.container} onClick={onSelect}>
      <div className={styles.overlay}></div>
      <div
        className={styles.content}
        style={{
          top: getContentStyles()?.y,
          left: getContentStyles()?.x
        }}
      >
        <div className={styles.title}>{title}</div>
        <div className={styles.sub}>
          {subTitle}
        </div>
      </div>
      <div
        className={styles.main}
        style={{
          top: top - 31,
          left: elWidth > 90 ? left : left - 31,
          height: `${height}px`,
          width: `${width}px`,
          boxShadow: getBoxShadow()
        }}
      >
      </div>
    </div>
  );
}

CoachMark.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

CoachMark.defaultProps = {};
