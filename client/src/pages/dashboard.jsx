import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    HiOutlineViewGrid,
    HiOutlineClock,
    HiOutlineSearch,
    HiOutlinePlus,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineLogout,
    HiOutlineX,
    HiOutlineDocumentText,
    HiOutlineCalendar,
} from "react-icons/hi";
import {
    HiOutlineSparkles,
    HiOutlineDocumentPlus,
} from "react-icons/hi2";
import API from "../api/axios";
import "../styles/dashboard.css";

function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();

    // Get user email from token or localStorage
    const userEmail = localStorage.getItem("userEmail") || "user";

    // Fetch notes on mount
    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const res = await API.get("/notes");
            setNotes(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                navigate("/login");
            }
            console.error("Failed to fetch notes:", err);
        } finally {
            setLoading(false);
        }
    };

    // Filtered notes
    const filteredNotes = useMemo(() => {
        if (!searchQuery.trim()) return notes;
        const q = searchQuery.toLowerCase();
        return notes.filter(
            (n) =>
                n.title.toLowerCase().includes(q) ||
                n.content.toLowerCase().includes(q)
        );
    }, [notes, searchQuery]);

    // Stats
    const totalNotes = notes.length;
    const todayNotes = notes.filter((n) => {
        const created = new Date(n.createdAt);
        const today = new Date();
        return created.toDateString() === today.toDateString();
    }).length;

    const thisWeekNotes = notes.filter((n) => {
        const created = new Date(n.createdAt);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return created >= weekAgo;
    }).length;

    // Format date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    // Open modal for new note
    const openNewNote = () => {
        setEditingNote(null);
        setFormTitle("");
        setFormContent("");
        setFormError("");
        setShowModal(true);
    };

    // Open modal for editing
    const openEditNote = (note, e) => {
        e.stopPropagation();
        setEditingNote(note);
        setFormTitle(note.title);
        setFormContent(note.content);
        setFormError("");
        setShowModal(true);
    };

    // Save note (create or update)
    const handleSave = async () => {
        if (!formTitle.trim() || !formContent.trim()) {
            setFormError("Title and content are required");
            return;
        }

        try {
            setSaving(true);
            setFormError("");

            if (editingNote) {
                const res = await API.put(`/notes/${editingNote._id}`, {
                    title: formTitle,
                    content: formContent,
                });
                setNotes((prev) =>
                    prev.map((n) => (n._id === editingNote._id ? res.data : n))
                );
            } else {
                const res = await API.post("/notes", {
                    title: formTitle,
                    content: formContent,
                });
                setNotes((prev) => [res.data, ...prev]);
            }

            setShowModal(false);
        } catch (err) {
            setFormError(
                err.response?.data?.message || "Failed to save. Try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete note
    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await API.delete(`/notes/${deleteTarget._id}`);
            setNotes((prev) => prev.filter((n) => n._id !== deleteTarget._id));
            setDeleteTarget(null);
        } catch (err) {
            console.error("Failed to delete note:", err);
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/login");
    };

    return (
        <div className="dashboard-page">
            {/* ===== Sidebar ===== */}
            <aside className="dash-sidebar">
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <img src="/notespace-logo.png" alt="NoteSpace" className="brand-logo-img" />
                    </div>
                    <span className="brand-name">NoteSpace</span>
                </div>

                <nav className="sidebar-nav">
                    <button className="nav-item active">
                        <span className="nav-icon">
                            <HiOutlineViewGrid />
                        </span>
                        All Notes
                        <span className="nav-count">{totalNotes}</span>
                    </button>
                    <button className="nav-item">
                        <span className="nav-icon">
                            <HiOutlineSparkles />
                        </span>
                        Today
                        <span className="nav-count">{todayNotes}</span>
                    </button>
                    <button className="nav-item">
                        <span className="nav-icon">
                            <HiOutlineClock />
                        </span>
                        This Week
                        <span className="nav-count">{thisWeekNotes}</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            {userEmail.charAt(0)}
                        </div>
                        <span className="user-email">{userEmail}</span>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <HiOutlineLogout />
                        Logout
                    </button>
                </div>
            </aside>

            {/* ===== Main Content ===== */}
            <main className="dash-main">
                {/* Top Bar */}
                <header className="dash-topbar">
                    <div className="topbar-left">
                        <h1>Dashboard</h1>
                        <p>Manage your notes and ideas</p>
                    </div>
                    <div className="topbar-right">
                        <div className="search-box">
                            <span className="search-icon">
                                <HiOutlineSearch />
                            </span>
                            <input
                                type="text"
                                placeholder="Search notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="new-note-btn" onClick={openNewNote}>
                            <HiOutlinePlus />
                            New Note
                        </button>
                    </div>
                </header>

                {/* Stats */}
                <div className="stats-bar">
                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <HiOutlineDocumentText />
                        </div>
                        <div>
                            <div className="stat-value">{totalNotes}</div>
                            <div className="stat-label">Total Notes</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <HiOutlineSparkles />
                        </div>
                        <div>
                            <div className="stat-value">{todayNotes}</div>
                            <div className="stat-label">Created Today</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon amber">
                            <HiOutlineCalendar />
                        </div>
                        <div>
                            <div className="stat-value">{thisWeekNotes}</div>
                            <div className="stat-label">This Week</div>
                        </div>
                    </div>
                </div>

                {/* Notes Area */}
                <div className="notes-area">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loader"></div>
                        </div>
                    ) : filteredNotes.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <HiOutlineDocumentPlus />
                            </div>
                            {searchQuery ? (
                                <>
                                    <h3>No results found</h3>
                                    <p>Try a different search term</p>
                                </>
                            ) : (
                                <>
                                    <h3>No notes yet</h3>
                                    <p>Create your first note to get started</p>
                                    <button className="new-note-btn" onClick={openNewNote}>
                                        <HiOutlinePlus /> New Note
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="notes-grid">
                            {filteredNotes.map((note, i) => (
                                <div
                                    key={note._id}
                                    className="note-card"
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                    onClick={() => {
                                        setEditingNote(note);
                                        setFormTitle(note.title);
                                        setFormContent(note.content);
                                        setFormError("");
                                        setShowModal(true);
                                    }}
                                >
                                    <h3 className="note-title">{note.title}</h3>
                                    <p className="note-content">{note.content}</p>
                                    <div className="note-footer">
                                        <span className="note-date">
                                            <HiOutlineClock size={13} />
                                            {formatDate(note.createdAt)}
                                        </span>
                                        <div className="note-actions">
                                            <button
                                                className="action-btn"
                                                onClick={(e) => openEditNote(note, e)}
                                                title="Edit"
                                            >
                                                <HiOutlinePencil />
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteTarget(note);
                                                }}
                                                title="Delete"
                                            >
                                                <HiOutlineTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* ===== Create/Edit Modal ===== */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingNote ? "Edit Note" : "New Note"}</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowModal(false)}
                            >
                                <HiOutlineX />
                            </button>
                        </div>

                        <div className="modal-form">
                            {formError && <div className="modal-error">{formError}</div>}

                            <div className="form-group">
                                <label htmlFor="note-title">Title</label>
                                <input
                                    id="note-title"
                                    type="text"
                                    placeholder="Give your note a title..."
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="note-content">Content</label>
                                <textarea
                                    id="note-content"
                                    placeholder="Write your thoughts here..."
                                    value={formContent}
                                    onChange={(e) => setFormContent(e.target.value)}
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="save-btn"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : editingNote ? "Update Note" : "Create Note"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== Delete Confirmation Modal ===== */}
            {deleteTarget && (
                <div
                    className="modal-overlay"
                    onClick={() => setDeleteTarget(null)}
                >
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Delete Note</h2>
                            <button
                                className="close-btn"
                                onClick={() => setDeleteTarget(null)}
                            >
                                <HiOutlineX />
                            </button>
                        </div>
                        <div className="delete-confirm">
                            <p>
                                Are you sure you want to delete{" "}
                                <strong>"{deleteTarget.title}"</strong>? This action cannot
                                be undone.
                            </p>
                            <div className="delete-actions">
                                <button
                                    className="cancel-btn"
                                    onClick={() => setDeleteTarget(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="confirm-delete-btn"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;