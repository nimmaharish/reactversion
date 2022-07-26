import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import LinearProgress from '@material-ui/core/LinearProgress';

const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 8,
    borderRadius: 5,
    margin: '8px'
  },
  colorPrimary: {
    backgroundColor: 'var(--secondary)'
  },
  bar: {
    borderRadius: 5,
    backgroundColor: 'var(--primary)'
  }
}))(LinearProgress);

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  left: {
    marginLeft: '0 !important',
    marginRight: '0 !important',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  marginLR: {
    margin: '8px'
  },
  marginR: {
    marginRight: '4px',
    fontSize: '10px',
    textTransform: 'capitalize',
    minWidth: '35px !important'
  },
  btn: {
    fontSize: '10px !important'
  }
});

function Linear({
  value, btns, onAction, text
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.label}>
        {' '}
        {text}
        {' '}
      </div>
      <div className="fs10 marginSTopBottom">
        {' '}
        Hurry now! Complete your shop profile to take your products LIVE.
        {' '}
      </div>
      <BorderLinearProgress className={classes.left} variant="determinate" value={value} />
      <div className={classes.marginLR}>
        {' '}
        {btns.map(x => (
          <Button
            className={classes.marginR}
            size="small"
            variant="outlined"
            endIcon={<EditIcon className={classes.btn} fontSize="small" />}
            onClick={() => {
              onAction();
            }}
          >
            {' '}
            {x}
            {' '}
          </Button>
        ))}
        {' '}
      </div>
    </div>
  );
}

Linear.propTypes = {
  value: PropTypes.array.isRequired,
  onAction: PropTypes.func.isRequired,
  btns: PropTypes.array.isRequired,
  text: PropTypes.string.isRequired,
};

export default Linear;
