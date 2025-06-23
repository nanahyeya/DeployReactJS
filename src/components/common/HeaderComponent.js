import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const HeaderComponent = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const location = useLocation();

  // 디버깅을 위한 콘솔 로그 (개발 중에만 사용)
  useEffect(() => {
    console.log('Current pathname:', location.pathname);
  }, [location.pathname]);

  // 현재 경로를 기반으로 활성 상태 확인
  const getCurrentSection = () => {
    const path = location.pathname;
    console.log('Checking path:', path);
    
    // Department 관련 경로들
    if (path.startsWith('/departments') || path === '/add-department' || path.startsWith('/edit-department')) {
      console.log('Matched departments section');
      return 'departments';
    } 
    // Employee 관련 경로들 (기본값 포함)
    else if (path === '/' || path.startsWith('/employees') || path === '/add-employee' || path.startsWith('/edit-employee')) {
      console.log('Matched employees section');
      return 'employees';
    }
    
    console.log('Defaulting to employees');
    return 'employees'; // 기본값
  };

  const currentSection = getCurrentSection();
  console.log('Current section:', currentSection);

  const getNavLinkStyle = (section, isHovered) => {
    const isActive = currentSection === section;
    console.log(`Button ${section} - isActive:`, isActive);
    
    return {
      // 레이아웃 고정 속성 (변하지 않음)
      borderRadius: '0.75rem',
      padding: '0.875rem 1.25rem',
      textDecoration: 'none',
      fontSize: '0.9rem',
      letterSpacing: '0.3px',
      display: 'inline-block',
      minWidth: '130px',
      maxWidth: '130px',
      textAlign: 'center',
      boxSizing: 'border-box',
      border: '2px solid transparent',
      fontFamily: 'inherit',
      lineHeight: '1.2',
      height: '44px',
      
      // 부드러운 전환만 적용
      transition: 'background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
      
      // 상태별 색상 - 명시적으로 설정
      backgroundColor: isActive ? '#8b5cf6' : isHovered ? '#fbbf24' : '#ffffff',
      color: isActive || isHovered ? '#ffffff' : '#1f2937',
      borderColor: isActive ? '#7c3aed' : isHovered ? '#f59e0b' : '#e5e7eb',
      boxShadow: isActive 
        ? '0 4px 12px rgba(139, 92, 246, 0.25)' 
        : isHovered 
        ? '0 4px 12px rgba(251, 191, 36, 0.25)' 
        : '0 2px 6px rgba(0, 0, 0, 0.1)',
      fontWeight: isActive || isHovered ? '700' : '600',
      
      // 브라우저별 최적화
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      backfaceVisibility: 'hidden',
      perspective: '1000px',
      willChange: 'background-color, color, box-shadow, border-color',
    };
  };

  return (
    <header className="app-header">
      <div className="header-title-section">
        <h1>
          <Link 
            to="/employees"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            Employee Management System
          </Link>
        </h1>
        {import.meta.env.VITE_MODE && (
          <span className="mode-badge">
            {import.meta.env.VITE_MODE}
          </span>
        )}
      </div>
      
      <div className="header-nav">
        <Link 
          to="/employees"
          style={getNavLinkStyle('employees', hoveredLink === 'employees')}
          onMouseEnter={() => setHoveredLink('employees')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Employees
        </Link>
        
        <Link 
          to="/departments"
          style={getNavLinkStyle('departments', hoveredLink === 'departments')}
          onMouseEnter={() => setHoveredLink('departments')}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Departments
        </Link>
      </div>
    </header>
  );
};

export default HeaderComponent;