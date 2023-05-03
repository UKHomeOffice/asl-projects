import React from 'react';
import { OverflowWrapper } from '@ukhomeoffice/asl-components';

const renderBlock = (props, editor, next) => {
  const { attributes, children, node, readOnly } = props;
  switch (node.type) {
    case 'table':
      if (readOnly) {
        return (
          <div className="force-show-scrollbars">
            <OverflowWrapper>
              <table {...attributes}>
                <tbody>{children}</tbody>
              </table>
            </OverflowWrapper>
          </div>
        );
      }
      return (
        <div className="rte-table-container">
          <table {...attributes}>
            <tbody>{children}</tbody>
          </table>
        </div>
      );
    case 'table-row':
      return <tr { ...attributes }>{ children }</tr>;
    case 'table-cell':
      return (
        <td
          colSpan={node.get('data').get('colSpan')}
          rowSpan={node.get('data').get('rowSpan')}
          {...attributes}
          className="rte-table-cell"
        >
          {children}
        </td>
      );
    default:
      return next();
  }
};

export default renderBlock;
