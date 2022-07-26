import React from 'react';
import Auto from 'react-select/async-creatable';
import makeAnimated from 'react-select/animated';
import cx from 'classnames';
import PropTypes from 'prop-types';
import styles from './Search.module.css';

const colourStyles = {
  container: styles => ({ ...styles, margin: '0 8px', width: '100%' }),
  control: styles => ({ ...styles, backgroundColor: 'var(--secondary)' }),
  menu: styles => ({ ...styles, zIndex: 99, top: '30px' }),
  multiValue: (styles) => ({
    ...styles,
    color: 'var(--secondary)',
    backgroundColor: 'var(--primary)',
  }),
  placeholder: (styles) => ({
    ...styles,
    fontSize: '10px !important'
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: 'var(--secondary)',
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'var(--primary)',
    },
  }),
  option: (styles) => ({
    ...styles,
    color: 'var(--primary)',
    ':hover': {
      ...styles[':hover'],
      backgroundColor: 'var(--primary)',
      color: 'var(--secondary) !important',
    },
  }),
};

function Search({
  loadItems,
  setSelected,
  placeholder,
  selected
}) {
  const showNewOpt = placeholder === 'Search / Add Catalog (min 3 letters)' && selected.length > 1;
  const getTagsFromSearch = async (searchText) => {
    if (searchText.length < 3 || showNewOpt) {
      return [];
    }
    const data = await loadItems(searchText);
    const filtered = data.map(x => ({ label: x, value: x }));
    return filtered;
  };

  return (
    <Auto
      id="react_select_creatable"
      isMulti
      menuIsOpen={true}
      isSearchable={true}
      value={selected.map(x => ({ label: x, value: x }))}
      defaultMenuIsOpen={false}
      defaultOptions={false}
      // isValidNewOption={() => showNewOpt}
      blurInputOnSelect={true}
      styles={colourStyles}
      menuPlacement="auto"
      components={makeAnimated()}
      noOptionsMessage={() => null}
      className={cx(styles.padBottom)}
      placeholder={placeholder}
      hideSelectedOptions={true}
      onChange={(newValue) => {
        if (!newValue) {
          return [];
        }
        let newMap = [];
        const isCatalog = placeholder === 'Search / Add Catalog (min 3 letters)';
        newValue.map(x => {
          if (x.__isNew__) {
            x.label = !isCatalog ? `#${x.label}` : x.label;
            x.value = !isCatalog ? `#${x.value}` : x.value;
            x.__isNew__ = false;
            return x;
          }
          return x;
        });
        if (newValue) {
          newMap = newValue.map(x => x.value);
        }
        setSelected(newMap);
        setTimeout(() => {
          // eslint-disable-next-line no-unused-expressions
          document.activeElement.blur();
        }, 500);
      }}
      loadOptions={getTagsFromSearch}
      theme={theme => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: 'var(--secondary)',
          primary: 'var(--primary)',
        },
      })}
    />
  );
}

Search.propTypes = {
  loadItems: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
};

export default Search;
