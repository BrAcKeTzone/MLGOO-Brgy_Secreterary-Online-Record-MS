import React from 'react';

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; {new Date().getFullYear()} MLGOO ORMS. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;