import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    HiOutlineViewGrid,
    HiOutlineClock,
    HiOutlineSearch,
    HiOutlinePlus,
    HiOutlineDocumentText,
    HiOutlineCalendar,
    HiOutlineLogout,
    HiOutlineSun,
    HiOutlineMoon,
    HiOutlineTag,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineX,
    HiOutlinePaperClip,
    HiOutlineExternalLink,
    HiOutlineCloudUpload,
    HiOutlineCheckCircle,
    HiOutlineFilter,
    HiOutlineHeart,
    HiOutlineDuplicate,
    HiOutlineBookOpen,
    HiOutlineSparkles,
    HiOutlineLightningBolt,
    HiOutlineMenu,
    HiOutlineChevronRight,
    HiOutlineTrendingUp,
    HiOutlineBell
} from "react-icons/hi";

import {
    HiOutlineDocumentPlus,
} from "react-icons/hi2";

import API from "../api/axios";
import "../styles/dashboard.css";

function Dashboard() {
    // State Management
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formCategory, setFormCategory] = useState("General");
    const [formTopic, setFormTopic] = useState("");
    const [formDifficulty, setFormDifficulty] = useState("Medium");
    const [formTags, setFormTags] = useState("");
    const [formColor, setFormColor] = useState("default");
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("newest");
    const [hoveredNote, setHoveredNote] = useState(null);
    const [focusedField, setFocusedField] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);

    const navigate = useNavigate();
    const userEmail = localStorage.getItem("userEmail") || "user";

    const CATEGORIES = ["General", "DSA", "Web Dev", "DevOps", "System Design", "Database", "AI/ML", "Other"];

    const NOTE_COLORS = [
        { id: "default", bg: "var(--bg-elevated)", border: "var(--border)" },
        { id: "blue", bg: "var(--note-bg-blue)", border: "var(--note-border-blue)" },
        { id: "green", bg: "var(--note-bg-green)", border: "var(--note-border-green)" },
        { id: "purple", bg: "var(--note-bg-purple)", border: "var(--note-border-purple)" },
        { id: "orange", bg: "var(--note-bg-orange)", border: "var(--note-border-orange)" },
    ];

    const toggleTheme = useCallback(() => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const res = await API.get("/notes");
            setNotes(res.data);
        } catch (err) {
            if (err.response?.status === 401) navigate("/login");
            console.error("Failed to fetch notes:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredNotes = useMemo(() => {
        let filtered = notes;

        if (selectedCategory === "Favorites") {
            filtered = filtered.filter(n => n.isFavorite);
        } else if (selectedCategory === "Today") {
            filtered = filtered.filter(n => new Date(n.createdAt).toDateString() === new Date().toDateString());
        } else if (selectedCategory === "This Week") {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(n => new Date(n.createdAt) >= weekAgo);
        } else if (selectedCategory !== "All") {
            filtered = filtered.filter((n) => n.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (n) =>
                    n.title.toLowerCase().includes(q) ||
                    n.content.toLowerCase().includes(q) ||
                    (n.topic && n.topic.toLowerCase().includes(q)) ||
                    (n.tags && n.tags.some(t => t.toLowerCase().includes(q)))
            );
        }

        // Advanced Tag Filtering (Concept Revision Engine)
        if (selectedTags.length > 0) {
            filtered = filtered.filter(n =>
                n.tags && selectedTags.every(tag => n.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase()))
            );
        }

        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "newest": return new Date(b.createdAt) - new Date(a.createdAt);
                case "oldest": return new Date(a.createdAt) - new Date(b.createdAt);
                case "alphabetical": return a.title.localeCompare(b.title);
                default: return 0;
            }
        });
        return filtered;
    }, [notes, searchQuery, selectedCategory, sortBy]);

    const stats = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const startOfLastWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const total = notes.length;
        const beforeToday = notes.filter(n => new Date(n.createdAt) < startOfToday).length;

        const thisWeekCount = notes.filter(n => new Date(n.createdAt) >= startOfWeek).length;
        const lastWeekCount = notes.filter(n => {
            const created = new Date(n.createdAt);
            return created >= startOfLastWeek && created < startOfWeek;
        }).length;

        const totalTrend = beforeToday > 0 ? Math.round(((total - beforeToday) / beforeToday) * 100) : 0;
        const weekTrend = lastWeekCount > 0 ? Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100) : 0;

        const todayCount = notes.filter(n => new Date(n.createdAt) >= startOfToday).length;
        const favoriteCount = notes.filter(n => n.isFavorite).length;

        return {
            total,
            today: todayCount,
            thisWeek: thisWeekCount,
            favorites: favoriteCount,
            totalTrend,
            weekTrend
        };
    }, [notes]);

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
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const openNewNote = () => {
        setEditingNote(null);
        setFormTitle("");
        setFormContent("");
        setFormCategory("General");
        setFormTopic("");
        setFormDifficulty("Medium");
        setFormTags("");
        setFormColor("default");
        setFormError("");
        setUploadSuccess(false);
        setShowModal(true);
        setSelectedFile(null);
    };

    const openEditNote = (note, e) => {
        e?.stopPropagation();
        setEditingNote(note);
        setFormTitle(note.title);
        setFormContent(note.content);
        setFormCategory(note.category || "General");
        setFormTopic(note.topic || "");
        setFormDifficulty(note.difficulty || "Medium");
        setFormTags(note.tags ? note.tags.join(", ") : "");
        setFormColor(note.color || "default");
        setFormError("");
        setUploadSuccess(false);
        setShowModal(true);
        setSelectedFile(null);
    };

    const handleSave = async () => {
        if (!formTitle.trim() || !formContent.trim()) {
            setFormError("Title and content are required");
            return;
        }
        try {
            setSaving(true);
            setFormError("");
            const tagsArray = formTags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
            const noteData = {
                title: formTitle,
                content: formContent,
                category: formCategory,
                topic: formTopic || undefined,
                difficulty: formDifficulty,
                tags: tagsArray,
                color: formColor,
            };

            if (editingNote) {
                const res = await API.put(`/notes/${editingNote._id}`, noteData);
                setNotes((prev) => prev.map((n) => (n._id === editingNote._id ? res.data : n)));
                if (selectedFile) await handleFileUpload(editingNote._id);
            } else {
                const res = await API.post("/notes", noteData);
                setNotes((prev) => [res.data, ...prev]);
                // Clear filters to ensure new note is visible
                setSearchQuery("");
                setSelectedCategory("All");
                if (selectedFile) await handleFileUpload(res.data._id);
            }
            setShowModal(false);
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to save. Try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (noteId) => {
        if (!selectedFile) return;
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", selectedFile);
            const res = await API.post(`/notes/${noteId}/upload`, formData);
            setNotes((prev) => prev.map((n) => (n._id === noteId ? res.data : n)));
            setSelectedFile(null);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (err) {
            setFormError("File upload failed. Try again.");
        } finally {
            setUploading(false);
        }
    };

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

    const toggleFavorite = async (note, e) => {
        e.preventDefault();
        e.stopPropagation();

        const nextFavorite = !note.isFavorite;

        // Optimistic UI update
        setNotes((prev) => prev.map((n) => (n._id === note._id ? { ...n, isFavorite: nextFavorite } : n)));

        try {
            const res = await API.put(`/notes/${note._id}`, { isFavorite: nextFavorite });
            // Sync with server response
            setNotes((prev) => prev.map((n) => (n._id === note._id ? { ...n, ...res.data } : n)));
        } catch (err) {
            console.error("Failed to toggle favorite:", err);
            // Rollback on error
            setNotes((prev) => prev.map((n) => (n._id === note._id ? { ...n, isFavorite: !nextFavorite } : n)));
        }
    };

    const toggleTagFilter = (tag, e) => {
        e?.stopPropagation();
        const tagLower = tag.toLowerCase();
        setSelectedTags(prev =>
            prev.includes(tagLower)
                ? prev.filter(t => t !== tagLower)
                : [...prev, tagLower]
        );
    };

    const clearAllTags = () => setSelectedTags([]);

    const duplicateNote = async (note, e) => {
        e.stopPropagation();
        try {
            const { _id, createdAt, updatedAt, ...noteData } = note;
            const res = await API.post("/notes", { ...noteData, title: `${note.title} (Copy)` });
            setNotes((prev) => [res.data, ...prev]);
        } catch (err) {
            console.error("Failed to duplicate note:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        navigate("/login");
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.metaKey || e.ctrlKey) {
                if (e.key === "n") {
                    e.preventDefault();
                    openNewNote();
                }
                if (e.key === "k") {
                    e.preventDefault();
                    document.querySelector(".search-input")?.focus();
                }
            }
            if (e.key === "Escape") {
                setShowModal(false);
                setDeleteTarget(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className={`dashboard-page ${theme}`}>
            {/* Subtle background gradient */}
            <div className="bg-gradient"></div>

            {/* Sidebar */}
            <aside className={`dash-sidebar ${sidebarOpen ? "open" : "closed"}`}>
                <div className="sidebar-content">
                    <div className="sidebar-brand">
                        <div className="brand-icon">
                            <HiOutlineBookOpen />
                        </div>
                        <div className="brand-text">
                            <span className="brand-name">Notiq AI  </span>
                        </div>

                    </div>

                    <nav className="sidebar-nav">
                        <div className="nav-section">
                            <span className="nav-label">Menu</span>
                            <button
                                className={`nav-item ${selectedCategory === "All" ? "active" : ""}`}
                                onClick={() => setSelectedCategory("All")}
                            >
                                <HiOutlineViewGrid className="nav-icon" />
                                <span className="nav-text">All Notes</span>
                                <span className="nav-badge">{stats.total}</span>
                            </button>
                            <button
                                className={`nav-item ${selectedCategory === "Today" ? "active" : ""}`}
                                onClick={() => setSelectedCategory("Today")}
                            >
                                <HiOutlineSparkles className="nav-icon" />
                                <span className="nav-text">Today</span>
                                <span className="nav-badge">{stats.today}</span>
                            </button>
                            <button
                                className={`nav-item ${selectedCategory === "This Week" ? "active" : ""}`}
                                onClick={() => setSelectedCategory("This Week")}
                            >
                                <HiOutlineClock className="nav-icon" />
                                <span className="nav-text">This Week</span>
                                <span className="nav-badge">{stats.thisWeek}</span>
                            </button>
                            <button
                                className={`nav-item ${selectedCategory === "Favorites" ? "active" : ""}`}
                                onClick={() => setSelectedCategory("Favorites")}
                            >
                                <HiOutlineHeart className="nav-icon" />
                                <span className="nav-text">Favorites</span>
                                <span className="nav-badge">{stats.favorites}</span>
                            </button>
                        </div>


                    </nav>

                    <div className="sidebar-footer">
                        <div className="user-card">
                            <div className="user-avatar">
                                {userEmail.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-info">
                                <span className="user-name">{userEmail.split("@")[0]}</span>
                            </div>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>
                            <HiOutlineLogout />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dash-main">
                {/* Header */}
                <header className="dash-header">
                    <div className="header-left">
                        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <HiOutlineMenu />
                        </button>
                        <div className="breadcrumbs">
                            <span>Dashboard</span>
                            <HiOutlineChevronRight />
                            <span className="current">{selectedCategory}</span>
                        </div>
                    </div>

                    <div className="header-center">
                        <div className="search-box">
                            <HiOutlineSearch className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search notes, topics, tags..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <span className="kbd-shortcut">⌘K</span>
                        </div>
                    </div>

                    <div className="header-right">
                        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
                            {theme === "dark" ? <HiOutlineSun /> : <HiOutlineMoon />}
                        </button>
                        <button className="icon-btn" title="Notifications">
                            <HiOutlineBell />
                        </button>
                        <button className="new-note-btn" onClick={openNewNote}>
                            <HiOutlinePlus />
                            <span>New Note</span>
                        </button>
                    </div>
                </header>

                {/* Stats */}
                <section className="stats-section">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">Total Notes 📚</span>
                                {stats.totalTrend !== 0 && (
                                    <span className={`stat-trend ${stats.totalTrend > 0 ? "up" : "down"}`}>
                                        {stats.totalTrend > 0 ? <HiOutlineTrendingUp /> : <HiOutlineTrendingUp style={{ transform: 'rotate(180deg)' }} />}
                                        {stats.totalTrend > 0 ? `+${stats.totalTrend}%` : `${stats.totalTrend}%`}
                                    </span>
                                )}
                            </div>
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-bar">
                                <div className="stat-progress" style={{ width: `${Math.min(stats.total * 5, 100)}%` }}></div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">Created Today ✨</span>
                            </div>
                            <div className="stat-value">{stats.today}</div>
                            <div className="stat-subtext">Small notes today, big results tomorrow!
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">This Week 💫</span>
                                {stats.weekTrend !== 0 && (
                                    <span className={`stat-trend ${stats.weekTrend > 0 ? "up" : "down"}`}>
                                        {stats.weekTrend > 0 ? <HiOutlineTrendingUp /> : <HiOutlineTrendingUp style={{ transform: 'rotate(180deg)' }} />}
                                        {stats.weekTrend > 0 ? `+${stats.weekTrend}%` : `${stats.weekTrend}%`}
                                    </span>
                                )}
                            </div>
                            <div className="stat-value">{stats.thisWeek}</div>
                            <div className="stat-subtext">Keep the momentum!</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">Favorites 🧠</span>
                            </div>
                            <div className="stat-value">{stats.favorites}</div>
                            <div className="stat-hearts">
                                {[...Array(5)].map((_, i) => (
                                    <HiOutlineHeart key={i} className={i < stats.favorites ? "filled" : ""} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Controls */}
                <section className="controls-bar">
                    <div className="category-pills">
                        <button
                            className={`pill ${selectedCategory === "All" ? "active" : ""}`}
                            onClick={() => setSelectedCategory("All")}
                        >
                            All
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                className={`pill ${selectedCategory === cat ? "active" : ""}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="view-controls">
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="alphabetical">A-Z</option>
                        </select>
                        <div className="view-toggle">
                            <button
                                className={viewMode === "grid" ? "active" : ""}
                                onClick={() => setViewMode("grid")}
                            >
                                <HiOutlineViewGrid />
                            </button>
                            <button
                                className={viewMode === "list" ? "active" : ""}
                                onClick={() => setViewMode("list")}
                            >
                                <HiOutlineDocumentText />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Selected Tags Bar */}
                {selectedTags.length > 0 && (
                    <section className="selected-tags-bar">
                        <div className="tags-label">
                            <HiOutlineFilter />
                            <span>Active Filters:</span>
                        </div>
                        <div className="active-tags">
                            {selectedTags.map(tag => (
                                <button
                                    key={tag}
                                    className="active-tag-pill"
                                    onClick={() => toggleTagFilter(tag)}
                                >
                                    <span>{tag}</span>
                                    <HiOutlineX />
                                </button>
                            ))}
                            <button className="clear-tags-btn" onClick={clearAllTags}>
                                Clear All
                            </button>
                        </div>
                    </section>
                )}

                {/* Notes */}
                <section className="notes-content">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading notes...</p>
                        </div>
                    ) : filteredNotes.length === 0 ? (
                        <div className="empty-state">
                            <HiOutlineDocumentPlus className="empty-icon" />
                            <h3>{searchQuery ? "No matches found" : "No notes yet"}</h3>
                            <p>{searchQuery ? "Try adjusting your search" : "Create your first note to get started"}</p>
                            <button className="empty-cta" onClick={openNewNote}>
                                <HiOutlinePlus /> Create Note
                            </button>
                        </div>
                    ) : (
                        <div className={`notes-${viewMode}`}>
                            {filteredNotes.map((note, index) => (
                                <div
                                    key={note._id}
                                    className="note-card"
                                    data-color={note.color || "default"}
                                    style={{
                                        animationDelay: `${index * 0.05}s`,
                                        backgroundColor: NOTE_COLORS.find(c => c.id === (note.color || "default"))?.bg,
                                    }}
                                    onMouseEnter={() => setHoveredNote(note._id)}
                                    onMouseLeave={() => setHoveredNote(null)}
                                    onClick={() => openEditNote(note)}
                                >
                                    <div className="note-header">
                                        <div className="note-badges">
                                            {note.category && note.category !== "General" && (
                                                <span className="badge category">{note.category}</span>
                                            )}
                                            {note.difficulty && (
                                                <span className={`badge difficulty ${note.difficulty.toLowerCase()}`}>
                                                    {note.difficulty}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            className={`favorite-btn ${note.isFavorite ? "active" : ""}`}
                                            onClick={(e) => toggleFavorite(note, e)}
                                        >
                                            <HiOutlineHeart />
                                        </button>
                                    </div>

                                    <h3 className="note-title">{note.title}</h3>

                                    {note.topic && (
                                        <div className="note-topic">
                                            <HiOutlineLightningBolt />
                                            <span>{note.topic}</span>
                                        </div>
                                    )}

                                    <p className="note-excerpt">{note.content}</p>

                                    {note.attachments?.length > 0 && (
                                        <div className="note-attachments">
                                            <div className="attachment-thumb">
                                                {note.attachments[0].type === "image" ? (
                                                    <img src={note.attachments[0].url} alt="" />
                                                ) : (
                                                    <HiOutlinePaperClip />
                                                )}
                                            </div>
                                            {note.attachments.length > 1 && (
                                                <span className="att-count">+{note.attachments.length - 1}</span>
                                            )}
                                        </div>
                                    )}

                                    {note.tags?.length > 0 && (
                                        <div className="note-tags">
                                            {note.tags.slice(0, 3).map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className={`tag clickable ${selectedTags.includes(tag.toLowerCase()) ? 'active' : ''}`}
                                                    onClick={(e) => toggleTagFilter(tag, e)}
                                                    title={`Filter by ${tag}`}
                                                >
                                                    <HiOutlineTag />
                                                    {tag}
                                                </span>
                                            ))}
                                            {note.tags.length > 3 && <span className="tag more">+{note.tags.length - 3}</span>}
                                        </div>
                                    )}

                                    <div className="note-footer">
                                        <div className="note-date">
                                            <HiOutlineClock />
                                            <span>{formatDate(note.createdAt)}</span>
                                            <span className="note-reading-time">
                                                <HiOutlineDocumentText />
                                                {Math.max(1, Math.ceil(note.content.split(/\s+/).length / 200))} min read
                                            </span>
                                        </div>
                                        <div className={`note-actions ${hoveredNote === note._id ? "visible" : ""}`}>
                                            <button onClick={(e) => openEditNote(note, e)} title="Edit">
                                                <HiOutlinePencil />
                                            </button>
                                            <button onClick={(e) => duplicateNote(note, e)} title="Duplicate">
                                                <HiOutlineDuplicate />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(note); }} title="Delete" className="delete">
                                                <HiOutlineTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingNote ? "Edit Note" : "New Note"}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <HiOutlineX />
                            </button>
                        </div>

                        <div className="modal-body">
                            {formError && (
                                <div className="error-banner">
                                    <HiOutlineX />
                                    <span>{formError}</span>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    placeholder="Note title..."
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>Content</label>
                                <textarea
                                    placeholder="Write your note..."
                                    value={formContent}
                                    onChange={(e) => setFormContent(e.target.value)}
                                    rows={5}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Topic</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. React Hooks"
                                        value={formTopic}
                                        onChange={(e) => setFormTopic(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Difficulty</label>
                                    <div className="difficulty-selector">
                                        {["Easy", "Medium", "Hard"].map((level) => (
                                            <button
                                                key={level}
                                                type="button"
                                                className={formDifficulty === level ? "active" : ""}
                                                onClick={() => setFormDifficulty(level)}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Tags</label>
                                    <input
                                        type="text"
                                        placeholder="comma, separated"
                                        value={formTags}
                                        onChange={(e) => setFormTags(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Note Color</label>
                                <div className="color-picker">
                                    {NOTE_COLORS.map((color) => (
                                        <button
                                            key={color.id}
                                            type="button"
                                            className={formColor === color.id ? "selected" : ""}
                                            style={{ backgroundColor: color.bg, borderColor: color.border }}
                                            onClick={() => setFormColor(color.id)}
                                        >
                                            {formColor === color.id && <HiOutlineCheckCircle />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Attachment</label>
                                <div className="file-input">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                        hidden
                                    />
                                    <label htmlFor="file-upload">
                                        <HiOutlineCloudUpload />
                                        {selectedFile ? selectedFile.name : "Choose file"}
                                    </label>
                                    {selectedFile && editingNote && (
                                        <button
                                            type="button"
                                            className="upload-btn"
                                            onClick={() => handleFileUpload(editingNote._id)}
                                            disabled={uploading}
                                        >
                                            {uploading ? "Uploading..." : "Upload"}
                                        </button>
                                    )}
                                </div>
                                {uploadSuccess && (
                                    <div className="upload-success">
                                        <HiOutlineCheckCircle /> Uploaded!
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : editingNote ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteTarget && (
                <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="modal-container delete-modal" onClick={(e) => e.stopPropagation()}>
                        <HiOutlineTrash className="delete-icon" />
                        <h3>Delete Note?</h3>
                        <p>This will permanently delete <strong>"{deleteTarget.title}"</strong></p>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>
                                Cancel
                            </button>
                            <button className="btn-danger" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;