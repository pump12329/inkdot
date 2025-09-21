import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import './logo.css';

const InkDotLogo = ({
    size = 120,
    variant = 'lg',
    animation = '',
    clickable = false,
    customClass = '',
    hoverable = true,
    onClick,
    ...props
}) => {
    // 生成唯一的实例ID，避免多个组件实例间的ID冲突
    const instanceId = useMemo(() =>
        Math.random().toString(36).substr(2, 9),
        []
    );

    // 构建CSS类名
    const logoClasses = useMemo(() => {
        const classes = ['logo'];

        // 添加尺寸类
        if (variant !== 'lg') {
            classes.push(`logo-${variant}`);
        }

        // 添加动画类
        if (animation) {
            classes.push(`animate-${animation}`);
        }

        // 添加自定义类
        if (customClass) {
            classes.push(customClass);
        }

        // 添加可点击类
        if (clickable) {
            classes.push('clickable');
        }

        // 添加悬停类
        if (hoverable) {
            classes.push('hoverable');
        }

        return classes.join(' ');
    }, [variant, animation, customClass, clickable, hoverable]);

    // 处理点击事件
    const handleClick = (event) => {
        if (clickable && onClick) {
            onClick(event);
        }
    };

    return (
        <svg
            className={logoClasses}
            width={size}
            height={size}
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleClick}
            {...props}
        >
            <defs>
                {/* 中心点渐变 */}
                <radialGradient id={`centerGradient-${instanceId}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 1 }} />
                    <stop offset="70%" style={{ stopColor: '#333333', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#666666', stopOpacity: 1 }} />
                </radialGradient>

                {/* 连接线渐变 */}
                <linearGradient id={`lineGradient-${instanceId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#0066FF', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#00FFFF', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#0066FF', stopOpacity: 1 }} />
                </linearGradient>
            </defs>

            {/* 连接线组 */}
            <g id="connections" stroke={`url(#lineGradient-${instanceId})`} strokeWidth="2" fill="none">
                <line x1="60" y1="60" x2="60" y2="24" />           {/* 上 */}
                <line x1="60" y1="60" x2="85.5" y2="34.5" />       {/* 右上 */}
                <line x1="60" y1="60" x2="96" y2="60" />            {/* 右 */}
                <line x1="60" y1="60" x2="85.5" y2="85.5" />       {/* 右下 */}
                <line x1="60" y1="60" x2="60" y2="96" />            {/* 下 */}
                <line x1="60" y1="60" x2="34.5" y2="85.5" />       {/* 左下 */}
                <line x1="60" y1="60" x2="24" y2="60" />            {/* 左 */}
                <line x1="60" y1="60" x2="34.5" y2="34.5" />       {/* 左上 */}
            </g>

            {/* 墨点组 */}
            <g id="dots">
                {/* 外围墨点 */}
                <circle cx="60" cy="24" r="5" fill="#333333" />     {/* 上 */}
                <circle cx="85.5" cy="34.5" r="5" fill="#333333" /> {/* 右上 */}
                <circle cx="96" cy="60" r="5" fill="#333333" />     {/* 右 */}
                <circle cx="85.5" cy="85.5" r="5" fill="#333333" /> {/* 右下 */}
                <circle cx="60" cy="96" r="5" fill="#333333" />     {/* 下 */}
                <circle cx="34.5" cy="85.5" r="5" fill="#333333" /> {/* 左下 */}
                <circle cx="24" cy="60" r="5" fill="#333333" />     {/* 左 */}
                <circle cx="34.5" cy="34.5" r="5" fill="#333333" /> {/* 左上 */}

                {/* 中心墨点 */}
                <circle cx="60" cy="60" r="9" fill={`url(#centerGradient-${instanceId})`} />
            </g>
        </svg>
    );
};

// PropTypes 定义（如果使用PropTypes）
InkDotLogo.propTypes = {
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    variant: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    animation: PropTypes.oneOf(['', 'birth', 'loading', 'glow', 'pulse']),
    clickable: PropTypes.bool,
    customClass: PropTypes.string,
    hoverable: PropTypes.bool,
    onClick: PropTypes.func,
};

// 默认属性
InkDotLogo.defaultProps = {
    size: 120,
    variant: 'lg',
    animation: '',
    clickable: false,
    customClass: '',
    hoverable: true,
    onClick: undefined,
};

export default InkDotLogo;
