import React from 'react';

const QueryTable = ({ queries, handleView }) => {
    return (
        <div className="query-table">
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Time</th>
                        <th>Priority</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {queries.map((query, index) => (
                        <tr key={index}>
                            <td>{query.studentName}</td>
                            <td>{query.title}</td>
                            <td>{query.category}</td>
                            <td>{query.time}</td>
                            <td>{query.priority}</td>
                            <td>
                                <button onClick={() => handleView(query._id)}>View/Assign</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default QueryTable;
