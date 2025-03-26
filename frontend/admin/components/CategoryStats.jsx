import React from 'react';

const CategoryStats = ({ categoryData }) => {
    return (
        <div className="category-stats">
            <h3>Category Statistics</h3>
            <ul>
                {categoryData.map((category, index) => (
                    <li key={index}>
                        <strong>{category.name}:</strong> 
                        Solved {category.solved}, 
                        Pending {category.pending}, 
                        Unsolved {category.unsolved}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryStats;
