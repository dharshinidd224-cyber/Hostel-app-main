import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbNavigation = ({ items = [] }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  if (!items || items?.length === 0) {
    return null;
  }

  return (
    <nav className="breadcrumb-navigation">
      <div className="breadcrumb-navigation-container">
        <ol className="breadcrumb-navigation-list">
          {items?.map((item, index) => {
            const isLast = index === items?.length - 1;
            
            return (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="breadcrumb-navigation-separator">
                    <Icon name="ChevronRight" size={16} />
                  </span>
                )}
                {isLast ? (
                  <span className="breadcrumb-navigation-item active">
                    {item?.label}
                  </span>
                ) : (
                  <button
                    onClick={() => handleNavigation(item?.path)}
                    className="breadcrumb-navigation-item"
                  >
                    {item?.label}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default BreadcrumbNavigation;