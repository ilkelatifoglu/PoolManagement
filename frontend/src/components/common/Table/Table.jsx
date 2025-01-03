import React from "react";
import PropTypes from "prop-types";
import Button from "../Button/Button";
import "./Table.css";

const Table = ({ columns, data, actions }) => {
  // Helper function to format cell content
  const formatCellContent = (content) => {
    if (content === null || content === undefined) return "-";
    if (typeof content === "number") return content.toString();
    return content;
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor || col.header}>{col.header}</th>
            ))}
            {actions && actions.length > 0 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.accessor || col.header}>
                  {col.render
                    ? col.render(row)
                    : formatCellContent(row[col.accessor])}
                </td>
              ))}
              {actions && actions.length > 0 && (
                <td>
                  {actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      onClick={() => action.onClick(row)}
                      variant="primary"
                      size="small"
                    >
                      {action.label}
                    </Button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ),
};

export default Table;
