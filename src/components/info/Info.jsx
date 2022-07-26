import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardContent,
  Typography
} from '@material-ui/core';
import cx from 'classnames';
import InfoIcon from 'assets/images/info/info.svg';
import InfoClose from 'assets/images/info/close.svg';
import styles from './Info.module.css';

function Info({
  text, title, onClose
}) {
  const [show, setShow] = useState(true);
  const newText = text.split('\n');
  if (!show) {
    return null;
  }

  const close = () => {
    if (onClose) {
      onClose();
    }

    setShow(false);
  };

  return (
    <div className={styles.container}>
      <Card className={cx(styles.card)}>
        <CardHeader
          classes={{
            action: styles.action,
            avatar: styles.noRightMargin,
            title: styles.content
          }}
          className="padding0"
          avatar={<img src={InfoIcon} alt="" />}
          action={<img src={InfoClose} onClick={close} alt="" />}
          title={title}
        />
        <CardContent className="padding0">
          {newText.map((x, i) => <Typography key={i} className={styles.cardText} component="div">{x}</Typography>)}
        </CardContent>
      </Card>
    </div>
  );
}

Info.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

Info.defaultProps = {
  onClose: null,
};

export default Info;
