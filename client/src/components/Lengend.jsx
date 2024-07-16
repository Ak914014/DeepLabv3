import React from 'react';

const Legend = ({ legend = {} }) => {
  return (
    <div className="  ">
      <h2 className="text-2xl mt-2"> Legend: </h2>
      <ul className="mt-4">
        {Object.entries(legend).map(([key, color]) => (
          <li key={key} className="flex items-center mb-2">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: `rgb(${color.join(',')})` }}
            ></div>
            <span className="ml-2">{key}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;
