import React from "react";

const TableActions = ({ actions }) => {
  return (
    <div className="flex space-x-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={`p-1 ${action.className || ""}`}
          title={action.title}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
};

export default TableActions;