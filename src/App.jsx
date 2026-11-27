
import { useState } from "react";
import "./App.css";

const initialQuestions = [
  {
    id: 1, subject: "Matematika", chapter: "Pecahan", level: "Mudah",
    duration: 30, question: "Hasil dari 1/2 + 1/4 adalah ...",
    options: ["1/4", "2/4", "3/4", "4/4"], answer: "C",
    explanation: "Samakan penyebut menjadi 4. Jadi 2/4 + 1/4 = 3/4."
  },
  {
    id: 2, subject: "IPA", chapter: "Tata Surya", level: "Sedang",
    duration: 45, question: "Planet yang dikenal sebagai planet merah adalah ...",
    options: ["Venus", "Mars", "Jupiter", "Saturnus"], answer: "B",
    explanation: "Mars disebut planet merah karena permukaannya mengandung oksida besi."
  },
  {
    id: 3, subject: "Bahasa Indonesia", chapter: "Teks", level: "Mudah",
    duration: 30, question: "Gagasan utama dalam paragraf disebut ...",
    options: ["Kalimat penjelas", "Ide pokok", "Kesimpulan", "Kata hubung"], answer: "B",
    explanation: "Ide pokok merupakan inti pembahasan dalam sebuah paragraf."
  }
];

const emptyForm = {
  subject: "Matematika", chapter: "", level: "Mudah", duration: 30,
  question: "", options: ["", "", "", ""], answer: "A", explanation: ""
};

const menus = ["Dashboard", "Bank Soal", "Kelas & Siswa", "Sesi Permainan", "Laporan", "Pengaturan"];
const icons = ["⌂", "▤", "♧", "▷", "▥", "⚙"];

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const [questions, setQuestions] = useState(initialQuestions);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState("");
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = questions.filter(q =>
    `${q.question} ${q.subject} ${q.chapter}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, options: [...emptyForm.options] });
    setModal("form");
  };

  const openEdit = q => {
    setEditing(q.id);
    setForm({ ...q, options: [...q.options] });
    setModal("form");
  };

  const saveQuestion = e => {
    e.preventDefault();
    if (!form.chapter.trim() || !form.question.trim() || form.options.some(x => !x.trim())) {
      alert("Lengkapi materi, pertanyaan, dan semua pilihan jawaban.");
      return;
    }

    if (editing) {
      setQuestions(old => old.map(q => q.id === editing ? { ...form, id: editing } : q));
    } else {
      setQuestions(old => [...old, { ...form, id: Date.now() }]);
    }
    setModal("");
    setForm(emptyForm);
  };

  const deleteQuestion = id => {
    if (window.confirm("Yakin ingin menghapus soal ini?")) {
      setQuestions(old => old.filter(q => q.id !== id));
    }
  };

  const updateOption = (index, value) => {
    const options = [...form.options];
    options[index] = value;
    setForm({ ...form, options });
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <div><b>GameEdu</b><small>Learning Adventure</small></div>
        </div>

        <p className="menu-title">MENU UTAMA</p>
        <nav className="navigation">
          {menus.map((item, i) => (
            <button key={item} className={`nav-item ${page === item ? "active" : ""}`}
              onClick={() => setPage(item)}>
              <span>{icons[i]}</span>{item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-card">
            <span>☕</span><b>Belajar jadi seru!</b>
            <small>Siapkan petualangan belajarmu.</small>
          </div>
          <div className="profile">
            <div className="avatar">G</div>
            <div><b>Guru</b><small>Administrator</small></div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <small>HALO, SELAMAT DATANG!</small>
            <h2>{page}</h2>
          </div>
          <div className="top-user">✦ <span>GameEdu</span></div>
        </header>

        <div className="content">
          {page === "Dashboard" && (
            <>
              <section className="welcome">
                <div>
                  <span className="eyebrow">LEARNING IS FUN</span>
                  <h1>Belajar Lebih Seru<br />Bersama GameEdu!</h1>
                  <p>Kelola soal dan ciptakan pengalaman belajar yang menyenangkan.</p>
                  <button className="primary-btn" onClick={() => setPage("Bank Soal")}>
                    Kelola Bank Soal →
                  </button>
                </div>
                <div className="welcome-art">📚<span>✦</span></div>
              </section>

              <div className="stats">
                <div className="stat-card"><span>▤</span><small>Total Bank Soal</small><h2>{questions.length}</h2><p>Soal tersimpan</p></div>
                <div className="stat-card"><span>▣</span><small>Mata Pelajaran</small><h2>{new Set(questions.map(q => q.subject)).size}</h2><p>Bidang pelajaran</p></div>
                <div className="stat-card"><span>♧</span><small>Materi Soal</small><h2>{new Set(questions.map(q => q.chapter)).size}</h2><p>Topik pembelajaran</p></div>
              </div>

              <div className="section-heading">
                <div><h3>Soal Terbaru</h3><p>Daftar soal yang sudah ditambahkan</p></div>
                <button className="text-btn" onClick={() => setPage("Bank Soal")}>Lihat semua →</button>
              </div>

              <div className="recent-list">
                {questions.slice(-3).reverse().map(q => (
                  <div className="recent-item" key={q.id}>
                    <div className="recent-icon">✎</div>
                    <div><b>{q.question}</b><small>{q.subject} · {q.chapter}</small></div>
                    <button className="view-btn" onClick={() => { setSelected(q); setModal("view"); }}>LIHAT</button>
                  </div>
                ))}
                {!questions.length && <p className="empty">Belum ada soal.</p>}
              </div>
            </>
          )}

          {page === "Bank Soal" && (
            <>
              <div className="page-intro">
                <div><h1>Bank Soal</h1><p>Kelola dan atur kumpulan soal pembelajaranmu.</p></div>
                <button className="primary-btn" onClick={openAdd}>＋ Tambah Soal</button>
              </div>

              <div className="question-summary">
                <div><small>Total Pertanyaan</small><h2>{questions.length} <span>Soal</span></h2></div>
                <div className="summary-icon">▤</div>
              </div>

              <div className="table-card">
                <div className="table-heading">
                  <div><h3>Daftar Pertanyaan</h3><p>Kelola soal yang tersedia di GameEdu.</p></div>
                  <input className="search" placeholder="Cari soal atau materi..."
                    value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <div className="table-wrap">
                  <table>
                    <thead><tr><th>NO</th><th>PERTANYAAN</th><th>MATA PELAJARAN</th><th>TINGKAT</th><th>AKSI</th></tr></thead>
                    <tbody>
                      {filtered.map((q, i) => (
                        <tr key={q.id}>
                          <td>{i + 1}</td>
                          <td className="question-cell">{q.question}</td>
                          <td>{q.subject}</td>
                          <td><span className="level">{q.level}</span></td>
                          <td>
                            <div className="actions">
                              <button className="view-btn" onClick={() => { setSelected(q); setModal("view"); }}>LIHAT</button>
                              <button className="edit-btn" onClick={() => openEdit(q)}>EDIT</button>
                              <button className="delete-btn" onClick={() => deleteQuestion(q.id)}>HAPUS</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!filtered.length && <tr><td colSpan="5" className="empty">Soal tidak ditemukan.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {page !== "Dashboard" && page !== "Bank Soal" && (
            <div className="coming-soon">
              <div>✦</div><h2>{page}</h2>
              <p>Bagian ini akan dikembangkan pada tahap berikutnya.</p>
              <button className="primary-btn" onClick={() => setPage("Dashboard")}>Kembali ke Dashboard</button>
            </div>
          )}
        </div>
      </main>

      {modal === "form" && (
        <div className="overlay">
          <form className="modal" onSubmit={saveQuestion}>
            <div className="modal-header">
              <div><h2>{editing ? "Edit Soal" : "Tambah Soal Baru"}</h2><p>Lengkapi informasi pertanyaan di bawah ini.</p></div>
              <button type="button" className="close" onClick={() => setModal("")}>×</button>
            </div>

            <div className="modal-body">
              <label>Mata Pelajaran
                <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                  {["Matematika", "IPA", "IPS", "Bahasa Indonesia", "Bahasa Inggris"].map(s => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label>Materi / Bab
                <input value={form.chapter} onChange={e => setForm({ ...form, chapter: e.target.value })} placeholder="Contoh: Pecahan" />
              </label>
              <div className="form-row">
                <label>Tingkat Kesulitan
                  <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                    {["Mudah", "Sedang", "Sulit"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </label>
                <label>Durasi (detik)
                  <input type="number" min="1" value={form.duration}
                    onChange={e => setForm({ ...form, duration: Number(e.target.value) })} />
                </label>
              </div>
              <label>Pertanyaan
                <textarea value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="Tuliskan pertanyaan..." />
              </label>
              <label>Pilihan Jawaban</label>
              {form.options.map((option, i) => (
                <div className="option-row" key={i}>
                  <input type="radio" name="answer" checked={form.answer === "ABCD"[i]}
                    onChange={() => setForm({ ...form, answer: "ABCD"[i] })} />
                  <b>{"ABCD"[i]}.</b>
                  <input value={option} onChange={e => updateOption(i, e.target.value)} placeholder={`Pilihan ${"ABCD"[i]}`} />
                </div>
              ))}
              <label>Pembahasan
                <textarea value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })} placeholder="Tuliskan pembahasan jawaban..." />
              </label>
            </div>

            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={() => setModal("")}>Batal</button>
              <button type="submit" className="primary-btn">Simpan Soal</button>
            </div>
          </form>
        </div>
      )}

      {modal === "view" && selected && (
        <div className="overlay">
          <div className="modal detail-modal">
            <div className="modal-header">
              <div><h2>Detail Soal</h2><p>Informasi lengkap pertanyaan.</p></div>
              <button className="close" onClick={() => setModal("")}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-tags"><span>{selected.subject}</span><span>{selected.chapter}</span><span>{selected.level}</span></div>
              <h3>{selected.question}</h3>
              <p className="detail-label">Pilihan Jawaban</p>
              {selected.options.map((option, i) => (
                <div className={`detail-option ${selected.answer === "ABCD"[i] ? "correct" : ""}`} key={i}>
                  <b>{"ABCD"[i]}.</b> {option}
                  {selected.answer === "ABCD"[i] && <strong>✓ Jawaban benar</strong>}
                </div>
              ))}
              <p className="detail-label">Pembahasan</p>
              <div className="explanation">{selected.explanation || "Belum ada pembahasan."}</div>
              <p className="detail-duration">Durasi pengerjaan: {selected.duration} detik</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setModal("")}>Tutup</button>
              <button className="primary-btn" onClick={() => openEdit(selected)}>Edit Soal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
