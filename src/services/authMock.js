// src/services/authMock.js
//
// ACTUALIZADO: se agregaron los roles que usa AVIS (aprendiz, admin)
// y credenciales más fáciles de recordar para desarrollo.
//
// ─── INSTRUCCIÓN ────────────────────────────────────────────────────────────
// Agrega aquí los usuarios que necesites probar mientras no tienes backend.
// Cuando tu backend en http://127.0.0.1:8000 esté listo, ve a AuthContext.jsx
// y pon USE_MOCK_LOGIN = false (ver comentario allá).
// ────────────────────────────────────────────────────────────────────────────

const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin Principal',
    email: 'admin@app.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'AP',
  },
  {
    id: '2',
    name: 'Aprendiz Demo',
    email: 'aprendiz@app.com',
    password: 'aprendiz123',
    role: 'aprendiz',
    avatar: 'AD',
  },
  {
    id: '3',
    name: 'Usuario Normal',
    email: 'user@app.com',
    password: 'user123',
    role: 'user',
    avatar: 'UN',
  },
  // ── Instructor (cuenta de prueba) ─────────────────────────────────────────
  // Elimina o reemplaza cuando el backend tenga el usuario real.
  {
    id: '4',
    name: 'Instructor Demo',
    email: 'instructor@app.com',
    password: 'instructor123',
    role: 'instructor',
    avatar: 'ID',
  },
]

export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // trim() elimina espacios accidentales al copiar/pegar el email
      const found = MOCK_USERS.find(
        (u) =>
          u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      )
      if (found) {
        const { password: _pw, ...safeUser } = found
        resolve(safeUser)
      } else {
        reject(new Error('Email o contraseña incorrectos'))
      }
    }, 600)
  })
}