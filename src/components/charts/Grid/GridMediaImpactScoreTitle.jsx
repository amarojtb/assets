import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { TableCell } from 'components/Table';

const propTypes = {
  id: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  isTeased: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string,
};

const defaultProps = {
  url: null,
};

const GridMediaImpactScoreTitle = ({
  id,
  intl: { formatMessage },
  onClick,
  title,
  url,
  isTeased,
}) => {
  const handleClick = () => {
    onClick(id);
  };

  return (
    <TableCell
      dataLabel={formatMessage({ id: 'Global.headline' })}
      title={title}
    >
      {isTeased ? (
        <span className="grid-media-impact-score-title__no-link">{title}</span>
      ) : (
        <a
          href={url}
          onClick={handleClick}
          rel="noopener noreferrer"
          target="_blank"
        >
          {title}
        </a>
      )}
    </TableCell>
  );
};

GridMediaImpactScoreTitle.propTypes = propTypes;
GridMediaImpactScoreTitle.defaultProps = defaultProps;
export default injectIntl(GridMediaImpactScoreTitle);
