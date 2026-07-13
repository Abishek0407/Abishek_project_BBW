import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { RiShieldUserFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdAdminPanelSettings, MdLogout } from "react-icons/md";
import { FaCheckCircle, FaChartPie, FaListAlt } from "react-icons/fa";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

//  helpers 

const STATUS_COLORS = {
  pending:   { bg: "#fef9c3", color: "#854d0e", chart: "#f59e0b" },
  completed: { bg: "#dcfce7", color: "#166534", chart: "#22c55e" },
  confirmed: { bg: "#dbeafe", color: "#1e40af", chart: "#3b82f6" },
  cancelled: { bg: "#fee2e2", color: "#991b1b", chart: "#ef4444" },
};

const statusStyle = (status) =>
  STATUS_COLORS[status] ?? { bg: "#f3f4f6", color: "#374151", chart: "#9ca3af" };

/** Build status-count data for the pie chart */
const buildPieData = (bookings) => {
  const counts = {};
  bookings.forEach(({ status }) => {
    counts[status] = (counts[status] ?? 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: statusStyle(name).chart,
  }));
};

/** Build bookings-per-day data for the last 20 days */
const buildBarData = (bookings) => {
  const today = new Date();
  const days = Array.from({ length: 20 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (19 - i));
    return {
      label: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      dateStr: d.toISOString().slice(0, 10),
      count: 0,
    };
  });

  bookings.forEach(({ createdAt }) => {
    const ds = new Date(createdAt).toISOString().slice(0, 10);
    const slot = days.find((d) => d.dateStr === ds);
    if (slot) slot.count += 1;
  });

  return days.map(({ label, count }) => ({ label, count }));
};

// custom tooltip for bar chart 

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1e3a5f", color: "#fff", padding: "8px 14px",
      borderRadius: "8px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    }}>
      <div style={{ fontWeight: 700 }}>{label}</div>
      <div>{payload[0].value} booking{payload[0].value !== 1 ? "s" : ""}</div>
    </div>
  );
};

// Analytics panel

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

const Analytics = ({ bookings }) => {
  const pieData = buildPieData(bookings);
  const barData = buildBarData(bookings);
  const isMobile = useIsMobile();

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: "20px",
      padding: "0 0 24px",
    }}>
      {/* ── Pie chart ── */}
      <div style={{
        background: "#fff", borderRadius: "14px",
        padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        flex: isMobile ? "none" : "0 0 300px",
        width: isMobile ? "100%" : undefined,
        boxSizing: "border-box",
      }}>
        <h3 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: "#1e3a5f" }}>
          Booking Status
        </h3>
        <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#6b7280" }}>
          Distribution by current status
        </p>
        {pieData.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: "13px" }}>
            No data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? 45 : 55}
                outerRadius={isMobile ? 70 : 85}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{
                  borderRadius: "8px", border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  fontSize: "12px",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* stat pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
          {pieData.map(({ name, value, fill }) => (
            <div key={name} style={{
              display: "flex", alignItems: "center", gap: "5px",
              background: "#f9fafb", borderRadius: "20px",
              padding: "4px 10px", fontSize: "11px", fontWeight: 600,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: fill, display: "inline-block" }} />
              <span style={{ color: "#374151" }}>{name}</span>
              <span style={{ color: fill, fontWeight: 700 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bar chart ── */}
      <div style={{
        background: "#fff", borderRadius: "14px",
        padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        flex: 1,
        minWidth: 0,
        width: isMobile ? "100%" : undefined,
        boxSizing: "border-box",
      }}>
        <h3 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: "#1e3a5f" }}>
          Appointments Per Day
        </h3>
        <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#6b7280" }}>
          Last 20 days
        </p>
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
          <BarChart data={barData} barSize={isMobile ? 8 : 14} margin={{ left: 0, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: isMobile ? 9 : 10, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              interval={isMobile ? 3 : 2}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: isMobile ? 9 : 10, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              width={20}
            />
            <Tooltip content={<BarTooltip />} cursor={{ fill: "#eff6ff" }} />
            <Bar dataKey="count" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Main component 

const AdminLogin = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [activeTab, setActiveTab] = useState("analytics"); // "analytics" | "bookings"
  const [pendingCount, setPendingCount] = useState(0);
  const [adminCreds, setAdminCreds] = useState({ username: "", password: "" });

  // Fetch pending count on page load so badge shows before login
  useEffect(() => {
    fetch("http://localhost:5678/api/Booking/pending-count")
      .then((r) => r.json())
      .then((d) => { if (d.success) setPendingCount(d.count); })
      .catch(() => {});
  }, []);

  const handleLogin = async () => {
    if (!username || !password) { setError("Please enter both username and password."); return; }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5678/api/Booking/all", {
        method: "GET",
        headers: { username, password },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setBookings(data.bookings);
        setAdminCreds({ username, password });
        setPendingCount(data.bookings.filter(b => b.status === "pending").length);
        setIsLoginOpen(false);
        setIsAdminOpen(true);
        setActiveTab("analytics");
        setUsername("");
        setPassword("");
      } else if (response.status === 403) {
        setError("Invalid username or password.");
      } else if (response.status === 401) {
        setError("Credentials are required.");
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch {
      setError("Cannot connect to server. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (id) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`http://localhost:5678/api/Booking/status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", username: adminCreds.username, password: adminCreds.password },
        body: JSON.stringify({ status: "completed" }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: "completed" } : b));
        setPendingCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      alert("Failed to update status. Try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => { setIsAdminOpen(false); setBookings([]); setAdminCreds({ username: "", password: "" }); setPendingCount(0); };

  //  Tab button style helper
  const tabBtn = (active) => ({
    display: "flex", alignItems: "center", gap: "6px",
    padding: "7px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
    border: "none", cursor: "pointer",
    background: active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
    color: "#fff",
    transition: "background 0.2s",
  });

  const ui = (
    <>
      {/* Fixed Shield Button */}
      <button
        onClick={() => setIsLoginOpen(true)}
        title="Admin Login"
        style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 1000,
          width: "54px", height: "54px", borderRadius: "50%",
          background: "linear-gradient(135deg, #36221b, #3d73e6)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(29,44,78,0.45)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        <div style={{ position: "relative", display: "flex" }}>
          <RiShieldUserFill size={26} color="#fff" />
          {pendingCount > 0 && (
            <span style={{
              position: "absolute", top: "-8px", right: "-10px",
            background: "#ef4444", color: "#fff",
            fontSize: "11px", fontWeight: 700,
            minWidth: "20px", height: "20px", borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 5px", border: "2px solid #fff",
              boxShadow: "0 2px 6px rgba(239,68,68,0.5)", lineHeight: 1,
            }}>
              {pendingCount}
            </span>
          )}
        </div>
      </button>

      {/* ── Login Modal ── */}
      {isLoginOpen && (
        <div
          onClick={() => { setIsLoginOpen(false); setError(""); }}
          style={{
            position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: "16px", padding: "36px 32px 28px",
              width: "100%", maxWidth: "360px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              position: "relative", fontFamily: "'Segoe UI', sans-serif",
            }}
          >
            <button
              onClick={() => { setIsLoginOpen(false); setError(""); }}
              style={{ position: "absolute", top: "14px", right: "14px", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
            >
              <IoClose size={22} />
            </button>

            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "50%",
                background: "linear-gradient(135deg, #ac86ab, #2563eb)",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
              }}>
                <MdAdminPanelSettings size={30} color="#fff" />
              </div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#111827" }}>Admin Login</h2>
              <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#6b7280" }}>Restricted access — authorized only</p>
            </div>

            {error && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px",
                padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "#dc2626",
              }}>{error}</div>
            )}

            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Username</label>
              <input
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                style={{
                  width: "100%", padding: "10px 14px", border: "1.5px solid #d1d5db",
                  borderRadius: "8px", fontSize: "14px", outline: "none",
                  boxSizing: "border-box", color: "#111827",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  style={{
                    width: "100%", padding: "10px 40px 10px 14px",
                    border: "1.5px solid #d1d5db", borderRadius: "8px",
                    fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#111827",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
                >
                  {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin} disabled={loading}
              style={{
                width: "100%", padding: "11px",
                background: loading ? "#93c5fd" : "linear-gradient(135deg, #1e3a5f, #2563eb)",
                color: "#fff", border: "none", borderRadius: "8px",
                fontSize: "15px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </div>
        </div>
      )}

      {/* ── Admin Dashboard Modal ── */}
      {isAdminOpen && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)",
          zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px", boxSizing: "border-box",
        }}>
          <div style={{
            background: "#f9fafb", borderRadius: "18px",
            width: "100%", height: "100%",
            boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
            fontFamily: "'Segoe UI', sans-serif",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
              padding: "16px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: "10px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <MdAdminPanelSettings size={26} color="#fff" />
                <div>
                  <h2 style={{ margin: 0, color: "#fff", fontSize: "17px", fontWeight: 700 }}>Admin Dashboard</h2>
                  <p style={{ margin: 0, color: "#bfdbfe", fontSize: "12px" }}>
                    {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Tab switcher */}
              <div style={{ display: "flex", gap: "6px", margin:"1" }}>
                <button onClick={() => setActiveTab("analytics")} style={tabBtn(activeTab === "analytics")}>
                  <FaChartPie size={13} /> Analytics
                </button>
                <button onClick={() => setActiveTab("bookings")} style={tabBtn(activeTab === "bookings")}>
                  <FaListAlt size={13} /> Bookings
                </button>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                {/* <button
                  onClick={handleLogout}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
                    color: "#fff", borderRadius: "8px", padding: "7px 13px",
                    cursor: "pointer", fontSize: "13px", fontWeight: 600,
                  }}
                >
                  <MdLogout size={15} /> Logout
                </button> */}
                <button
                  onClick={() => setIsAdminOpen(false)}
                  style={{
                    background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
                    color: "#fff", borderRadius: "8px", padding: "7px 10px", cursor: "pointer", display: "flex",
                  }}
                >
                  <IoClose size={17} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ overflowY: "auto", padding: "24px", flex: 1 }}>

              {/* ── Analytics tab ── */}
              {activeTab === "analytics" && (
                <Analytics bookings={bookings} />
              )}

              {/* ── Bookings tab ── */}
              {activeTab === "bookings" && (
                bookings.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
                    <p style={{ fontSize: "16px" }}>No bookings found.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{
                      width: "100%", borderCollapse: "collapse", background: "#fff",
                      borderRadius: "12px", overflow: "hidden",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                    }}>
                      <thead>
                        <tr style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)" }}>
                          {["#", "Name", "Phone", "Address", "Service", "Note", "Status", "Action", "Date"].map((h) => (
                            <th key={h} style={{
                              padding: "13px 16px", color: "#fff", fontSize: "12px",
                              fontWeight: 700, textAlign: "left", whiteSpace: "nowrap",
                            }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b, i) => {
                          const sc = statusStyle(b.status);
                          const isPending = b.status === "pending";
                          const isUpdating = updatingId === b._id;
                          return (
                            <tr
                              key={b._id}
                              style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#f9fafb" }}
                            >
                              <td style={{ padding: "13px 16px", fontSize: "13px", color: "#6b7280" }}>{i + 1}</td>
                              <td style={{ padding: "13px 16px", fontSize: "13px", fontWeight: 600, color: "#111827" }}>{b.name}</td>
                              <td style={{ padding: "13px 16px", fontSize: "13px", color: "#374151" }}>{b.phone}</td>
                              <td style={{ padding: "13px 16px", fontSize: "13px", color: "#374151", maxWidth: "150px" }}>{b.address}</td>
                              <td style={{ padding: "13px 16px", fontSize: "13px", color: "#374151" }}>{b.service}</td>
                              <td style={{ padding: "13px 16px", fontSize: "13px", color: "#6b7280" }}>{b.note || "—"}</td>
                              <td style={{ padding: "13px 16px" }}>
                                <span style={{
                                  background: sc.bg, color: sc.color,
                                  padding: "3px 10px", borderRadius: "20px",
                                  fontSize: "11px", fontWeight: 700, textTransform: "capitalize",
                                }}>{b.status}</span>
                              </td>
                              <td style={{ padding: "13px 16px" }}>
                                {isPending ? (
                                  <button
                                    onClick={() => handleMarkCompleted(b._id)}
                                    disabled={isUpdating}
                                    style={{
                                      display: "flex", alignItems: "center", gap: "5px",
                                      background: isUpdating ? "#bbf7d0" : "linear-gradient(135deg, #16a34a, #22c55e)",
                                      color: "#fff", border: "none", borderRadius: "6px",
                                      padding: "5px 11px", fontSize: "12px", fontWeight: 600,
                                      cursor: isUpdating ? "not-allowed" : "pointer",
                                      whiteSpace: "nowrap", boxShadow: "0 2px 6px rgba(22,163,74,0.3)",
                                    }}
                                  >
                                    <FaCheckCircle size={12} />
                                    {isUpdating ? "Updating..." : "Mark Done"}
                                  </button>
                                ) : (
                                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>—</span>
                                )}
                              </td>
                              <td style={{ padding: "13px 16px", fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap" }}>
                                {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );

  return createPortal(ui, document.body);
};

export default AdminLogin;
