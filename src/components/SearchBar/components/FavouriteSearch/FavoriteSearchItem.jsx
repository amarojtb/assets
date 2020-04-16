import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import Svg from 'components/Svg';

const propTypes = {
  item: PropTypes.shape({
    Id: PropTypes.number.isRequired,
    Name: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

const defaultProps = {
  mode: 'list',
};

const FavoriteSearchItem = ({
  item,
  onDelete,
  mode,
  onSave,
  onClick,
  onEdit,
}) => {
  const [title, setTitle] = useState(item.Name);
  const handleEdit = e => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onEdit === 'function') {
      onEdit(item.Id);
    }
  };
  const handleCancel = () => {
    setTitle(item.Name);
    if (typeof onEdit === 'function') {
      onEdit(null);
    }
  };
  const handleChange = e => {
    setTitle(e.target.value);
  };

  return (
    <div className="favourite-search_list__item">
      {mode === 'edit' ? (
        <input
          className="favourite-search_list__item-name edit"
          type="text"
          value={title}
          onChange={handleChange}
        />
      ) : (
        <div
          className="favourite-search_list__item-name text-truncate"
          onClick={onClick(item.Id)}
          onKeyUp={onClick(item.Id)}
          role="button"
          tabIndex={0}
        >
          {item.Name}
        </div>
      )}
      <div className="favourite-search_list__item-actions">
        {mode === 'edit' ? (
          <Fragment>
            <div
              className="m-right--x-small"
              onClick={handleCancel}
              onKeyUp={handleCancel}
              role="button"
              tabIndex={-1}
            >
              <Svg icon="reply" />
            </div>
            <div
              className="m-right--x-small"
              onClick={onSave(title, item.Id)}
              onKeyUp={onSave(title, item.Id)}
              role="button"
              tabIndex={-1}
            >
              <Svg size="large" icon="save" />
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div
              className="m-right--x-small"
              onClick={handleEdit}
              onKeyUp={handleEdit}
              role="button"
              tabIndex={-1}
            >
              <Svg icon="pencil" />
            </div>
            <div
              className="m-right--x-small"
              onClick={onDelete(item.Id)}
              onKeyUp={onDelete(item.Id)}
              role="button"
              tabIndex={-2}
            >
              <Svg icon="trash" />
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

FavoriteSearchItem.propTypes = propTypes;
FavoriteSearchItem.defaultProps = defaultProps;
export default FavoriteSearchItem;
