import React, { useState } from 'react';

const COLUMNS = [
    { field: 'title', label: 'Title', filterable: true },
    { field: 'length', label: 'Length', filterable: false },
    { field: 'category', label: 'Category', filterable: true },
    { field: 'authorId', label: 'Author', filterable: true },
];

const SortIcon = ({ field, sortField, sortDir }) => {
    if (sortField !== field) return <i className="fas fa-sort ms-1 text-muted" />;
    return sortDir === 'asc'
        ? <i className="fas fa-sort-up ms-1" />
        : <i className="fas fa-sort-down ms-1" />;
};

const CourseList = ({ courses, handleRowSelect, selectedCourseId }) => {
    const [sortField, setSortField] = useState('');
    const [sortDir, setSortDir] = useState('asc');
    const [filters, setFilters] = useState({ title: '', category: '', authorId: '' });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const setFilter = (field, value) =>
        setFilters(prev => ({ ...prev, [field]: value }));

    const filtered = (courses || []).filter(c =>
        (c.title || '').toLowerCase().includes(filters.title.toLowerCase()) &&
        (c.category || '').toLowerCase().includes(filters.category.toLowerCase()) &&
        (c.authorId || '').toLowerCase().includes(filters.authorId.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        if (!sortField) return 0;
        const aVal = (a[sortField] || '').toString();
        const bVal = (b[sortField] || '').toString();
        const cmp = aVal.localeCompare(bVal);
        return sortDir === 'asc' ? cmp : -cmp;
    });

    const thStyle = { cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' };

    return (
        <div className="table-responsive mt-3">
            <table className="table table-striped table-hover table-bordered align-middle">
                <thead className="table-dark">
                    <tr>
                        {COLUMNS.map(col => (
                            <th key={col.field} style={thStyle} onClick={() => handleSort(col.field)}>
                                {col.label}
                                <SortIcon field={col.field} sortField={sortField} sortDir={sortDir} />
                                {col.filterable && (
                                    <div onClick={e => e.stopPropagation()}>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm mt-1"
                                            placeholder="Filter..."
                                            value={filters[col.field] || ''}
                                            onChange={e => setFilter(col.field, e.target.value)}
                                        />
                                    </div>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sorted.length === 0 ? (
                        <tr>
                            <td colSpan={COLUMNS.length} className="text-center text-muted">
                                No data
                            </td>
                        </tr>
                    ) : sorted.map(course => (
                        <tr
                            key={course.id}
                            onClick={() => handleRowSelect(course)}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: course.id === selectedCourseId ? '#c1f291' : ''
                            }}
                        >
                            <td>
                                <a href={course.watchHref} target="_blank" rel="noreferrer">
                                    {course.title}
                                </a>
                            </td>
                            <td>{course.length}</td>
                            <td>{course.category}</td>
                            <td>{course.authorId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseList;
